const express = require('express');
const { body, validationResult } = require('express-validator');
const AkshayaCenter = require('../models/AkshayaCenter');
const Service = require('../models/serviceModel');
// const authMiddleware = require('../middleware/authMiddleware');
// const adminMiddleware = require('../middleware/adminMiddleware');

const router = express.Router();

// Route to toggle token generation for an Akshaya Center
router.patch(
    '/toggle-token-generation',
    // authMiddleware,
    async (req, res) => {
        const { centerId, enableTokenGeneration } = req.body;

        try {
            const center = await AkshayaCenter.findById(centerId);
            if (!center) {
                return res.status(404).json({ message: 'Center not found' });
            }

            center.tokenGenerationEnabled = enableTokenGeneration;
            await center.save();

            res.status(200).json({
                message: `Token generation has been ${enableTokenGeneration ? 'enabled' : 'disabled'} for this center`,
                tokenGenerationEnabled: center.tokenGenerationEnabled
            });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Route to add a new service for the Akshaya Center
router.post(
    '/add-service',
    // authMiddleware,
    [
        body('centerId').notEmpty().withMessage('Center ID is required'),
        body('serviceName').notEmpty().withMessage('Service name is required'),
        body('description').notEmpty().withMessage('Service description is required')
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { centerId, serviceName, description } = req.body;

        try {
            const newService = new Service({
                centerId,
                serviceName,
                description
            });

            await newService.save();
            res.status(201).json({ message: 'Service added successfully', service: newService });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

// Route to edit an existing service
router.patch(
    '/edit-service',
    // authMiddleware,
    [
        body('serviceId').notEmpty().withMessage('Service ID is required'),
        body('serviceName').optional().isString(),
        body('description').optional().isString()
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { serviceId, serviceName, description } = req.body;

        try {
            const service = await Service.findById(serviceId);
            if (!service) {
                return res.status(404).json({ message: 'Service not found' });
            }

            if (serviceName) service.serviceName = serviceName;
            if (description) service.description = description;

            await service.save();
            res.status(200).json({ message: 'Service updated successfully', service });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'Server error' });
        }
    }
);

module.exports = router;
