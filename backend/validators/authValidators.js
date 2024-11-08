const { check } = require('express-validator');

exports.userSignupValidator = [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
];

exports.akshayaCenterSignupValidator = [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    check('services', 'At least one service is required').isArray().notEmpty(),
    check('legalCertificates', 'Legal certificates are required').notEmpty(),
];

exports.loginValidator = [
    check('email', 'Valid email is required').isEmail(),
    check('password', 'Password is required').notEmpty(),
];
