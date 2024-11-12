const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { body, validationResult , query} = require('express-validator');
const User = require('../models/user');
 const Token = require('../models/tokenModel');
const AkshayaCenter = require('../models/AkshayaCenter');
const verifyToken = require("../middlewares/authMiddleware");
const authorizeRoles = require("../middlewares/roleMiddleware")


const router = express.Router();


router.get(
  '/search-akshaya-centers', verifyToken, authorizeRoles("user"),
  
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

      
      if (location) searchCriteria.location = { $regex: location, $options: 'i' };
      if (name) searchCriteria.name = { $regex: name, $options: 'i' };
      if (service) searchCriteria.services = { $regex: service, $options: 'i' }; // assuming services is an array field

      try {
          const akshayaCenters = await AkshayaCenter.find(searchCriteria).select('-legalCertificates'); 
          res.json(akshayaCenters);
      } catch (error) {
          res.status(500).json({ message: 'Server error' });
      }
  }
);


router.get(
  '/akshaya-center/:centerId',

  async (req, res) => {
      const { centerId } = req.params;

      try {
          const akshayaCenter = await AkshayaCenter.findById(centerId).select('-legalCertificates');
          if (!akshayaCenter) {
              return res.status(404).json({ message: 'Akshaya Center not found' });
          }

         
          const activeTokensCount = await Token.countDocuments({
              centerId,
              status: 'active' 
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
    
    [
        body('centerId').notEmpty().withMessage('Center ID is required'),
        // body('serviceId').notEmpty().withMessage('Service ID is required'),
        
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { centerId, userId} = req.body;
       

        try {
          
            const akshayaCenter = await AkshayaCenter.findById(centerId);
            if (!akshayaCenter || akshayaCenter.status !== 'active') {
                return res.status(400).json({ message: 'Center is not available' });
            }
            if (!akshayaCenter.tokenGenerationEnabled) {
                return res.status(400).json({ message: 'Token generation is currently disabled for this center' });
            }

          
            const startOfToday = new Date();
            startOfToday.setHours(0, 0, 0, 0);

            
            const existingToken = await Token.findOne({
                userId,
                centerId,
                createdAt: { $gte: startOfToday }
            });

            if (existingToken) {
                return res.status(400).json({ message: 'You can only generate one token per day at this center.' });
            }

            
            const tokenCount = await Token.countDocuments({ centerId });
            const tokenNumber = tokenCount + 1;

            
            const newToken = new Token({
                userId,
                centerId,
                // serviceId,
                
                tokenNumber
            });
            await newToken.save();

           
            akshayaCenter.currentPeopleCount += 1;
            await akshayaCenter.save();
            res.status(201).json({ message: 'Token generated successfully', tokenId: newToken._id, tokenNumber: newToken.tokenNumber });


           
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

router.get('/token-details/:tokenId', async (req, res) => {
    const { tokenId } = req.params;

    try {
       
        const token = await Token.findById(tokenId);
        if (!token) {
            return res.status(404).json({ message: 'Token not found' });
        }

        
        const user = await User.findById(token.userId);
        const akshayaCenter = await AkshayaCenter.findById(token.centerId);

        if (!user || !akshayaCenter) {
            return res.status(404).json({ message: 'User or Center not found' });
        }

        
        const response = {
            tokenNumber: token.tokenNumber,
            date: token.createdAt.toLocaleDateString(),
            username: user.name,
            centerName: akshayaCenter.centerName,
            location: akshayaCenter.location,
            // services: akshayaCenter.services
        };

        res.status(200).json(response);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
});


router.get('/token-detail/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        
        
        const tokens = await Token.find({ userId })
            .sort({ createdAt: -1 }) 
            .populate('userId', 'name') 
            .populate('centerId', 'centerName location') 
        
        
        if (!tokens || tokens.length === 0) {
            return res.status(404).json({ message: 'No tokens found' });
        }
        
        
        res.status(200).json(tokens);
    } catch (err) {
        res.status(500).json({ message: 'Server error', error: err.message });
    }
});





module.exports = router;
