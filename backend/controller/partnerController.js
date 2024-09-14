const { Partner } = require('../model');
const { response } = require('../utils');

// Create a new partner
const createPartner = async (req, res) => {
  try {
    const partner = new Partner(req.body);
    await partner.save();
    const data = response(200, partner, null, 'Partner created successfully');
    res.status(200).json(data);
  }
  catch (error) {
    const data = response(500, null, error, 'Error creating partner');
    res.status(500).json(data);
  }
}


// Get all partners with their weekly schedule
const getAllPartners = async (req, res) => {
  try {
    const partners = await Partner.find();
    const data = response(200, partners, null, 'Partners fetched successfully');
    res.status(200).json(data);
  } catch (error) {
    const data = response(500, null, error, 'Error fetching partners');
    res.status(500).json(data);
  }
};

// Get partner by ID with weekly schedule
const getPartnerById = async (req, res) => {
  try {
    const partner = await Partner.findById(req.params.id);
    if (!partner) {
      throw new Error('Partner not found');
    }
    const data = response(200, partner, null, 'Partner fetched successfully');
    res.status(200).json(data);
  } catch (error) {
    const data = response(500, null, error, 'Error fetching partner');
    res.status(500).json(data);
  }
};

module.exports = {
    createPartner,
    getAllPartners,
    getPartnerById,
};