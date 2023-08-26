var jwt = require("jsonwebtoken");
const JWT_Secret = process.env.GLOBAL_JWT_KEY

const fetchUser = (req, res, next) => {
    // get user from JWT tocken and add id to req object
    const token = req.header('auth-token');
    if(!token){
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }
    try {
        const data = jwt.verify(token, JWT_Secret);
        req.user = data.user;
        next();
    } catch (error) {
        return res.status(401).json({error: "Please authenticate using a valid token"});
    }
}

module.exports = fetchUser;