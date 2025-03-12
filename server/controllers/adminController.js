import User from '../models/User.js';
import Campaign from '../models/Campaign.js';

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password'); // omit password
    res.status(200).json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// ✅ Add missing deleteCampaign
export const deleteCampaign = async (req, res) => {
    try {
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) return res.status(404).json({ message: "Campaign not found" });

      await campaign.deleteOne();
      res.json({ message: "Campaign deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  // ✅ Also make sure deleteUser exists:
  export const deleteUser = async (req, res) => {
    try {
      const user = await User.findById(req.params.id);
      if (!user) return res.status(404).json({ message: "User not found" });

      await user.deleteOne();
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: "Server error" });
    }
  };

export const getAllCampaigns = async (req, res) => {
  try {
    const campaigns = await Campaign.find();
    res.status(200).json(campaigns);
  } catch (err) {
    console.error('Error fetching campaigns:', err);
    res.status(500).json({ message: 'Server error' });
  }
};
