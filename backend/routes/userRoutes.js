const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult , query} = require('express-validator');
const User = require('../models/user');
 const Token = require('../models/tokenModel');
const AkshayaCenter = require('../models/AkshayaCenter');
//const authMiddleware = require('../middleware/authMiddleware'); // JWT auth middleware

const router = express.Router();

// Registration Route
router.post(
    '/register',
    [
        body('name').notEmpty().withMessage('Name is required'),
        body('email').isEmail().withMessage('Enter a valid email'),
        body('phone').notEmpty().withMessage('Phone number is required'),
        body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, phone, password } = req.body;

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
            const newUser = new User({ name, email, phone, passwordHash });
            await newUser.save();

            res.status(201).json({ message: 'User registered successfully' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Login Route
router.post(
    '/login',
    [
        body('email').isEmail().withMessage('Enter a valid email'),
        body('password').notEmpty().withMessage('Password is required')
    ],
    async (req, res) => {
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
            const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
            res.json({ token, message: 'Login successful' });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);
router.get(
  '/search-akshaya-centers',
  //authMiddleware,
  [
      query('location').optional().isString().withMessage('Location should be a valid string'),
      query('name').optional().isString().withMessage('Name should be a valid string'),
      query('service').optional().isString().withMessage('Service should be a valid string')
  ],
  async (req, res) => {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
          return res.status(400).json({ errors: errors.array() });
      }

      const { location, name, service } = req.query;
      const searchCriteria = {};

      // Build search criteria based on query parameters
      if (location) searchCriteria.location = { $regex: location, $options: 'i' };
      if (name) searchCriteria.name = { $regex: name, $options: 'i' };
      if (service) searchCriteria.services = { $regex: service, $options: 'i' }; // assuming services is an array field

      try {
          const akshayaCenters = await AkshayaCenter.find(searchCriteria).select('-legalCertificates'); // Exclude sensitive data
          res.json(akshayaCenters);
      } catch (error) {
          res.status(500).json({ message: 'Server error' });
      }
  }
);

// Route to get details of a specific Akshaya Center, including the number of people
router.get(
  '/akshaya-center/:centerId',
  //authMiddleware,
  async (req, res) => {
      const { centerId } = req.params;

      try {
          const akshayaCenter = await AkshayaCenter.findById(centerId).select('-legalCertificates');
          if (!akshayaCenter) {
              return res.status(404).json({ message: 'Akshaya Center not found' });
          }

          // Count number of active tokens (people) in the center
          const activeTokensCount = await Token.countDocuments({
              centerId,
              status: 'active' // Assuming token status field
          });

          res.json({
              centerDetails: akshayaCenter,
              peopleCount: activeTokensCount
          });
      } catch (error) {
          res.status(500).json({ message: 'Server error' });
      }
  }
);

router.post(
    '/generate-token',
    // authMiddleware,
    [
        body('centerId').notEmpty().withMessage('Center ID is required'),
        // body('serviceId').notEmpty().withMessage('Service ID is required'),
        // body('tokenTime').notEmpty().withMessage('Token time is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { centerId, userId} = req.body;
        // const userId = req.user.userId;

        try {
            // Find the specified Akshaya Center
            const akshayaCenter = await AkshayaCenter.findById(centerId);
            if (!akshayaCenter || akshayaCenter.status !== 'active') {
                return res.status(400).json({ message: 'Center is not available' });
            }
            if (!akshayaCenter.tokenGenerationEnabled) {
                return res.status(400).json({ message: 'Token generation is currently disabled for this center' });
            }

            // Get the start of the current day (midnight)
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            // Check if the user already generated a token today for this center
            const existingToken = await Token.findOne({
                userId,
                centerId,
                createdAt: { $gte: startOfToday }
            });

            if (existingToken) {
                return res.status(400).json({ message: 'You can only generate one token per day at this center.' });
            }

            // Generate a unique token number (incrementing by count of current tokens for simplicity)
            const tokenCount = await Token.countDocuments({ centerId });
            const tokenNumber = tokenCount + 1;

            // Create and save the new token
            const newToken = new Token({
                userId,
                centerId,
                // serviceId,
                // tokenTime,
                tokenNumber
            });
            await newToken.save();

            // Update the current people count in the Akshaya Center
            akshayaCenter.currentPeopleCount += 1;
            await akshayaCenter.save();

            res.status(201).json({ message: 'Token generated successfully', tokenNumber: newToken.tokenNumber });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);


// Route to generate token number (appointment) for a user at a specific Akshaya Center
// router.post(
//     '/generate-token',
//     //authMiddleware,  // Ensure user is authenticated
//     [
//         body('centerId').notEmpty().withMessage('Center ID is required'),
//         // body('serviceId').notEmpty().withMessage('Service ID is required'),
//         body('tokenTime').notEmpty().withMessage('Token time is required')
//     ],
//     async (req, res) => {
//         const errors = validationResult(req);
//         if (!errors.isEmpty()) {
//             return res.status(400).json({ errors: errors.array() });
//         }

//         const { centerId, tokenTime,userId } = req.body;
//         // const userId = req.user.userId;

//         try {
//             const akshayaCenter = await AkshayaCenter.findById(centerId);
//             if (!akshayaCenter || akshayaCenter.status !== 'active') {
//                 return res.status(400).json({ message: 'Center is not available' });
//             }

//             const newToken = new Token({ userId, centerId, tokenTime });
//             await newToken.save();

//             res.status(201).json({ message: 'Token generated successfully', tokenNumber: newToken.tokenNumber });
//         } catch (error) {
//           res.status(500).json({  error });
//             // res.status(500).json({ message: 'Server error' });
//         }
//     }
// );

// Get user profile
router.get('/profile',
   //authMiddleware,
    async (req, res) => {
    try {
        const user = await User.findById(req.user.userId).select('-passwordHash');
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(user);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Update user profile
router.put(
    '/profile',
    //authMiddleware,
    [
        body('name').optional().notEmpty().withMessage('Name is required'),
        body('phone').optional().notEmpty().withMessage('Phone number is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, phone } = req.body;
        const userId = req.user.userId;

        try {
            const updatedUser = await User.findByIdAndUpdate(
                userId,
                { name, phone, updatedAt: Date.now() },
                { new: true }
            ).select('-passwordHash');
            
            res.json({ message: 'Profile updated successfully', updatedUser });
        } catch (error) {
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
