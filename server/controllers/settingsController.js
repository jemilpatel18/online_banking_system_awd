const Settings = require('../models/Settings');

exports.getFDRate = async (req, res) => {
  try {
    const settings = await Settings.findOne();
    const rate = settings ? Number(settings.fdInterestRate) : 15;
    res.status(200).json({ fdInterestRate: rate });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateFDRate = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const parsedRate = Number(req.body.fdInterestRate);
    if (!Number.isFinite(parsedRate) || parsedRate < 0) {
      return res.status(400).json({ message: 'FD interest rate must be a valid positive number' });
    }

    let settings = await Settings.findOne();
    if (!settings) {
      settings = new Settings({ fdInterestRate: parsedRate });
    } else {
      settings.fdInterestRate = parsedRate;
    }

    await settings.save();
    res.status(200).json({ message: 'FD Rate updated', settings });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
