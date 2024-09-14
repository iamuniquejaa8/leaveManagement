const express = require('express');
const router = express.Router();
const { partnerController } = require('../../controller');

// Route to create a new partner
router.post('/', partnerController.createPartner);
// Route to get all partners
router.get('/', partnerController.getAllPartners);
// Route to get a partner by ID
router.get('/:id', partnerController.getPartnerById);

module.exports = router;