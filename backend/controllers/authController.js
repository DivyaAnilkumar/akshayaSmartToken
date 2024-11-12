const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user') 
const {body, validationResult}= require('express-validator');

const registerValidation = [
    body('name').notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Enter a valid email'),
    // body('phone').notEmpty().withMessage('Phone number is required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
];

const register = async (req, res) => {


    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password,role } = req.body;

    try {
        // Check if the email is already registered
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const passwordHash = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({ name, email, passwordHash, role });
        await newUser.save();

        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

const loginValidation = [
    body('email').isEmail().withMessage('Enter a valid email'),
    body('password').notEmpty().withMessage('Password is required')
];

const login = async (req, res) =>{
   
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;

        try {
            const user = await User.findOne({ email });
            if (!user) {
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Check if user is blocked
            if (user.failedAttempts >= 5) {
                return res.status(403).json({ message: 'Account locked due to too many failed attempts' });
            }

            const isMatch = await bcrypt.compare(password, user.passwordHash);
            if (!isMatch) {
                user.failedAttempts += 1;
                await user.save();
                return res.status(400).json({ message: 'Invalid email or password' });
            }

            // Reset failed attempts on successful login
            user.failedAttempts = 0;
            await user.save();

            // Generate JWT token
            const token = jwt.sign({ userId: user._id , role: user.role }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, user: {
                id: user._id,
                email: user.email,
                role: user.role
            }, message: 'Login successful' });
        } catch (error) {
            console.log(error);
            res.status(500).json({ message: 'Server error' });
        }
    }


module.exports = {
    register,
    login,
    registerValidation,
    loginValidation
}

