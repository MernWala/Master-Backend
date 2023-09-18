const express = require('express');
const router = express.Router();
const Instructor = require('../../../models/quizer/Instructor');
const Student = require('../../../models/quizer/Student');
const OTP = require('../../../models/quizer/OTP')
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const fetchuser = require('../../../middleware/quizer/fetchuser')
const multer = require('multer');

// Route 1 - Register Instructor endpoint
router.post('/inst', [
    body("fName", "First name is too short").isLength({ min: 3 }),
    body("lName", "Last name is too short").isLength({ min: 3 }),
    body('email', "Email id is required").isEmail(),
    body('password', "Length of password is short").isLength({ min: 6 }),
    body('OTP', "OTP not found").exists()
], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {
        // Check whether the user with this email exists already
        let inst = await Instructor.findOne({ email: req.body.email });
        if (inst) {
            return res.status(400).json({ errors: [{ msg: "Sorry, user with this email already exists" }] });
        }

        let salt = bcrypt.genSaltSync(10);
        let secPass = await bcrypt.hash(req.body.password, salt);

        const otpData = await OTP.findOne({
            email: req.body.email
        })

        if ((otpData.otp - req.body.OTP) !== 0) {

            console.log(req.body.OTP);
            console.log(otpData.otp);

            return res.status(400).json({ errors: [{ msg: "OTP not matched try please try again" }] });

        } else {

            // creating users
            inst = await Instructor.create({
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                password: secPass,
                picture: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
                verified: true
            });

            const data = {
                user: {
                    id: inst.id
                }
            }

            const authTocken = jwt.sign(data, process.env.GLOBAL_JWT_KEY);
            return res.status(201).json({ authTocken });
        }

    } catch (err) {
        console.error(err);
        return res.status(500).send("Internal Server Error")
    }
});

// Route 2 - Register Student endpoint
router.post('/stu', [
    body("fName", "First name is too short").isLength({ min: 3 }),
    body("lName", "Last name is too short").isLength({ min: 3 }),
    body('email', "Email id is required").isEmail(),
    body('password', "Length of password is short").isLength({ min: 6 }),
    body('OTP', "OTP not found").exists()

], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    try {

        const otpData = await OTP.findOne({
            email: req.body.email
        })

        if ((otpData.otp - req.body.OTP) !== 0) {

            return res.status(400).json({ errors: [{ msg: "OTP not matched try please try again" }] });

        } else {

            let stu = await Student.findOne({ email: req.body.email });
            if (stu) {
                return res.status(400).json({ errors: [{ msg: "Sorry, user with this email already exists" }] });
            }

            let salt = bcrypt.genSaltSync(10);
            let secPass = await bcrypt.hash(req.body.password, salt);

            // creating users
            stu = await Student.create({
                fName: req.body.fName,
                lName: req.body.lName,
                email: req.body.email,
                OTP: req.body.OTP,
                password: secPass,
                picture: "https://static.vecteezy.com/system/resources/previews/005/544/718/original/profile-icon-design-free-vector.jpg",
                verified: true
            });

            const data = {
                user: {
                    id: stu.id
                }
            }

            const authTocken = jwt.sign(data, process.env.GLOBAL_JWT_KEY);
            return res.status(201).json({ authTocken });
        }

    } catch (err) {
        // catching unknown erros
        console.error(err);
        return res.status(500).send("Internal Server Error")
    }
});

// Route 3 - Reset password of instructor account with two factor verification
router.put('/account/forget-password/', [

    body('email', "Email id not found").exists(),
    body('otp', "OTP not found").exists(),
    body('account', "Can't get accout type").exists(),
    body('password', "Pawword not found").exists()

], async (req, res) => {

    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ errors: error.array() });
    }

    let { email, otp, account, password } = req.body

    try {

        // verifying OTP
        await OTP.findOne(
            { email }
        ).then(async (data) => {
            if (data === null) return res.status(404).json("You can only change your password")

            if (data.otp === Number(otp)) {
                let secPass = await bcrypt.hash(password, bcrypt.genSaltSync(10));

                if (account === "instructor") {
                    await Instructor.findOneAndUpdate({ email }, { $set: { password: secPass } }).then(() => {
                        return;
                    })
                    return res.status(200).json("Password has been changed")
                } else if (account === 'student') {
                    await Student.findOneAndUpdate({ email }, { $set: { password: secPass } }).then(() => {
                        return;
                    })
                    return res.status(200).json("Password has been changed");
                }

                return res.status(400).json("Invalid account type")

            } else {

                return res.status(400).json("OTP not matched")

            }
        })

    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: error.message })
    }

})

// Route 4 - (Update Profile) --> Update fName, lName, picture
router.put('/account/update-details', [

    body('fName', "First name not valid").isLength({ min: 3 }),
    body('lName', "Last name not valid").isLength({ min: 3 }),
    body('email', "Email id not valid").isEmail(),
    body('accountType', "Account type not found").exists()

], fetchuser, async (req, res) => {
    try {
        let { fName, lName, email, picture, accountType } = req.body

        const error = validationResult(req);
        if (!error.isEmpty()) {
            return res.status(400).json({ errors: error.array() });
        }

        let userId = req.user.id

        if (accountType === 'Instructor') {
            await Instructor.findOne(
                { _id: userId, accountType }
            ).then(async (userData) => {
                if (userData === null) return res.status(404).json("User not found.")

                if (userData.email === email) {
                    await Instructor.findByIdAndUpdate({ _id: userId }, { $set: { fName, lName, picture } })
                    return res.status(200).json("Account Updated")
                } else {
                    return res.status(400).json("You can only update your profile")
                }
            })
        } else if (accountType === 'Student') {
            await Student.findOne(
                { _id: userId, accountType }
            ).then(async (userData) => {
                if (userData === null) return res.status(404).json("User not found.")

                if (userData.email === email) {
                    await Student.findByIdAndUpdate({ _id: userId }, { $set: { fName, lName, picture } })
                    return res.status(200).json("Account Updated")
                } else {
                    return res.status(400).json("You can only update your profile")
                }
            })
        }

    } catch (error) {

        console.log(error)
        return res.json(error.message)

    }
})

// Route 5 - (Upload profile pik limit to 204 KB)
router.post('/account/update-profile/:accountType', fetchuser, async (req, res) => {
    const uploadProfileLimit = 1024 * 200;

    try {

        const _id = req.user.id
        const accountType = req.params.accountType
        let fileExtention = ""

        if (accountType === "Instructor") {
            await Instructor.findById({ _id }).then(async (data) => {
                multer({
                    storage: multer.diskStorage({
                        destination: (req, file, cb) => {
                            cb(null, 'uploads/quizer'); // Save uploaded files to the 'uploads' folder
                        },
                        filename: (req, file, cb) => {
                            fileExtention = file.originalname.split('.')[1]
                            cb(null, _id + "-Instructor." + fileExtention); // Rename files to avoid conflicts
                        },
                    }),
                    limits: { fileSize: uploadProfileLimit }, // Limit file size to 1 MB (adjust as needed)
                }).single('profile_image')(req, res, async (err) => {
                    if (err) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(413).json({ error: `File size exceeds the limit (${Math.floor(uploadProfileLimit / 1000)} KB)` });
                        }
                        // Handle other multer errors here
                        console.log(err);
                        return res.status(500).json({ error: 'Something went wrong' });
                    }

                    await Instructor.findByIdAndUpdate({ _id }, { $set: { picture: _id + "." + fileExtention } })
                    // If there are no errors, the file has been uploaded successfully
                    return res.status(200).json({ message: 'Image uploaded successfully' });
                });
            })

        } else if (accountType === "Student") {
            await Student.findById({ _id }).then((data) => {
                multer({
                    storage: multer.diskStorage({
                        destination: (req, file, cb) => {
                            cb(null, 'uploads/quizer'); // Save uploaded files to the 'uploads' folder
                        },
                        filename: (req, file, cb) => {
                            cb(null, _id + "-Student." + file.originalname.split('.')[1]); // Rename files to avoid conflicts
                        },
                    }),
                    limits: { fileSize: uploadProfileLimit }, // Limit file size to 1 MB (adjust as needed)
                }).single('profile_image')(req, res, async (err) => {
                    if (err) {
                        if (err.code === 'LIMIT_FILE_SIZE') {
                            return res.status(413).json({ error: `File size exceeds the limit (${Math.floor(uploadProfileLimit / 1000)} KB)` });
                        }
                        // Handle other multer errors here
                        return res.status(500).json({ error: 'Something went wrong' });
                    }

                    await Student.findByIdAndUpdate({ _id }, { $set: { picture: _id + "." + fileExtention } })

                    // If there are no errors, the file has been uploaded successfully
                    return res.status(200).json({ message: 'Image uploaded successfully' });
                });
            })
        }

    } catch (error) {
        return res.json(error.message)
    }
})

// Route 6 - getProfilePhoto
router.get('/account/get-profile/:accountType', fetchuser, async (req, res) => {
    try {
        let prePath = __dirname.split("routers\\quizer\\routes")[0]

        if (req.params.accountType === "Instructor") {
            await Instructor.findById({ _id: req.user.id }).then(async (data) => {
                let fileName = data.picture.split('.')[0]
                let fileExtention = data.picture.split('.')[1]

                return res.status(200).sendFile(`${prePath}/uploads/quizer/${fileName + "-Instructor." + fileExtention}`);
            })
        } else if (req.params.accountType === "Student") {
            await Student.findById({ _id: req.user.id }).then(async (data) => {
                let fileName = data.picture.split('.')[0]
                let fileExtention = data.picture.split('.')[1]

                return res.status(200).sendFile(`${prePath}/uploads/quizer/${fileName + "-Student." + fileExtention}`);
            })
        }
    } catch (error) {
        console.log(error);
        return res.json(error.message)
    }
})

module.exports = router;