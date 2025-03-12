// controllers/campaignController.js
import Campaign from '../models/Campaign.js';

// Create a campaign
export const createCampaign = async (req, res) => {
  const { title, description, goalAmount, category, image } = req.body;

  try {
    const newCampaign = new Campaign({
      title,
      description,
      goalAmount,
      category,
      image,
      creator: req.user?._id || req.body.creator, // support for protected + manual
    });

    await newCampaign.save();
    res.status(201).json(newCampaign);
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ message: 'Server error while creating campaign' });
  }
};

// Get all campaigns
export const getCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find().populate("creator", "name");
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Fetch campaigns error:', err);
    res.status(500).json({ message: 'Server error while fetching campaigns' });
  }
};

// Get campaign by ID
export const getCampaignById = async (req, res) => {
  const { id } = req.params;

  try {
    const campaign = await Campaign.findById(id).populate("creator", "name");
    if (!campaign) {
      return res.status(404).json({ message: 'Campaign not found' });
    }
    res.status(200).json(campaign);
  } catch (err) {
    console.error('Get campaign error:', err);
    res.status(500).json({ message: 'Server error while fetching campaign' });
  }
};

// Delete a campaign
export const deleteCampaign = async (req, res) => {
    const { id } = req.params;

    try {
      const campaign = await Campaign.findById(id);
      if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

      // ✅ Only creator or admin can delete
      if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to delete this campaign' });
      }

      await Campaign.findByIdAndDelete(id);
      res.status(200).json({ message: 'Campaign deleted successfully' });
    } catch (err) {
      console.error('Delete campaign error:', err);
      res.status(500).json({ message: 'Server error while deleting campaign' });
    }
  };

  // Update a campaign
  export const updateCampaign = async (req, res) => {
    const { id } = req.params;

    try {
      const campaign = await Campaign.findById(id);
      if (!campaign) return res.status(404).json({ message: 'Campaign not found' });

      // ✅ Only creator or admin can update
      if (campaign.creator.toString() !== req.user.id && req.user.role !== 'admin') {
        return res.status(403).json({ message: 'Unauthorized to update this campaign' });
      }

      const updated = await Campaign.findByIdAndUpdate(id, req.body, { new: true });
      res.status(200).json(updated);
    } catch (err) {
      console.error('Update campaign error:', err);
      res.status(500).json({ message: 'Server error while updating campaign' });
    }
  };
