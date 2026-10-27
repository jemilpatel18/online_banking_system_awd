const Scheme = require('../models/Scheme');
const SchemeApplication = require('../models/SchemeApplication');

// Get all schemes (public)
exports.getAllSchemes = async (req, res) => {
  try {
    const schemes = await Scheme.find().sort({ type: 1, createdAt: -1 });
    res.status(200).json(schemes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get schemes by type
exports.getSchemesByType = async (req, res) => {
  try {
    const { type } = req.params;
    const schemes = await Scheme.find({ type }).sort({ createdAt: -1 });
    res.status(200).json(schemes);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single scheme details
exports.getSchemeById = async (req, res) => {
  try {
    const scheme = await Scheme.findById(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    res.status(200).json(scheme);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Apply for a scheme (user only)
exports.applyForScheme = async (req, res) => {
  try {
    const { schemeId, amount, tenure, notes } = req.body;
    const userId = req.user.id;

    // Check if scheme exists
    const scheme = await Scheme.findById(schemeId);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });
    if (scheme.status !== 'Active') return res.status(400).json({ message: 'Scheme is not active' });

    // Check for duplicate application
    const existingApplication = await SchemeApplication.findOne({
      user: userId,
      scheme: schemeId
    });
    if (existingApplication) {
      return res.status(400).json({ message: 'You have already applied for this scheme' });
    }

    // Validate amount if scheme has min/max limits
    if (scheme.minAmount && amount < scheme.minAmount) {
      return res.status(400).json({ message: `Minimum amount for this scheme is ₹${scheme.minAmount}` });
    }
    if (scheme.maxAmount && amount > scheme.maxAmount) {
      return res.status(400).json({ message: `Maximum amount for this scheme is ₹${scheme.maxAmount}` });
    }

    // Create application
    const application = new SchemeApplication({
      user: userId,
      scheme: schemeId,
      amount,
      tenure,
      notes,
      status: 'Pending'
    });

    await application.save();
    res.status(201).json({ message: 'Application submitted successfully', application });
  } catch (err) {
    if (err.code === 11000) {
      return res.status(400).json({ message: 'You have already applied for this scheme' });
    }
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's scheme applications
exports.getUserApplications = async (req, res) => {
  try {
    const applications = await SchemeApplication.find({ user: req.user.id })
      .populate('scheme')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Create a new scheme
exports.createScheme = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const scheme = new Scheme(req.body);
    await scheme.save();
    res.status(201).json({ message: 'Scheme created successfully', scheme });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update scheme
exports.updateScheme = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const scheme = await Scheme.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true }
    );
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    res.status(200).json({ message: 'Scheme updated successfully', scheme });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Delete scheme
exports.deleteScheme = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const scheme = await Scheme.findByIdAndDelete(req.params.id);
    if (!scheme) return res.status(404).json({ message: 'Scheme not found' });

    res.status(200).json({ message: 'Scheme deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Get all scheme applications
exports.getAllApplications = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const applications = await SchemeApplication.find()
      .populate('user', 'fullName email accountNumber')
      .populate('scheme')
      .sort({ createdAt: -1 });
    res.status(200).json(applications);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

// Admin: Update application status
exports.updateApplicationStatus = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });

    const { status } = req.body;
    const application = await SchemeApplication.findByIdAndUpdate(
      req.params.id,
      { status, updatedAt: Date.now() },
      { new: true }
    );
    if (!application) return res.status(404).json({ message: 'Application not found' });

    res.status(200).json({ message: 'Application status updated', application });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
