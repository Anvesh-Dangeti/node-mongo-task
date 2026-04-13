const{body, validationResult} = require('express-validator');


async function validateRegister(req, res, next){
    
    const errors = validationResult(req);

    if(!errors.isEmpty()){
        return res.status(400).json({
            errors: errors.array()
        })
    }

    next();

}


const registerValidationRules = [
    body("username")
        .isString()
        .withMessage("Username must be a string")
        .isLength({min: 4, max: 30})
        .withMessage("Username must be between 4 and 30 characters long"),

    body("email")
        .isEmail()
        .withMessage("Invalid email format"),

    body("password")
        .isString()
        .withMessage("Password must be a string")
        .isLength({min: 6})
        .withMessage("Password must be at least 6 characters long"),

    body("role")
        .isIn(["admin", "user"])
        .withMessage("Role must be either admin or user"),
    validateRegister
    
]


module.exports = { registerValidationRules };