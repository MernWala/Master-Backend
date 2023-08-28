const ReportBugs = require('../../../models/quizer/ReportBugs');
const express = require('express');
const router = express.Router();
const { body, validationResult } = require('express-validator');

// ROUTE 1 - default report bug endpoint
router.post('/default', [
    body('fName', "First name not found").exists(),
    body('lName', "Last name not found").exists(),
    body('email', "Email not found").exists(),
    body('accountType', "Account type not found").exists(),
    body('report', "Report length shoud be at least 25 charaters").isLength({ min: 25 }),
], async (req, res) => {
    const error = validationResult(req);
    if (!error.isEmpty()) {
        return res.status(400).json({ error: error.array() })
    }

    try {
        let report = await ReportBugs.create({
            fName: req.body.fName,
            lName: req.body.lName,
            email: req.body.email,
            accountType: req.body.accountType,
            report: req.body.report,
        });

        const data = {
            user: {
                id: report.id
            }
        }

        res.status(201).json({status: 'sucess'});

    } catch (error) {
        console.log(`error in reportbug router - ${error}`);
        res.status(500).json({ error });
    }
});

module.exports = router