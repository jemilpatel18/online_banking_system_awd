const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.signup = async (req, res) => {
  try {
    const { fullName, email, phone, password, address } = req.body;
    
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: 'User already exists' });
    
    const usersCount = await User.countDocuments();
    const accountNumber = 'APEX' + (10001 + usersCount);
    
    const hashedPassword = await bcrypt.hash(password, 10);
    
    user = new User({
      fullName,
      email,
      phone,
      password: hashedPassword,
      address,
      accountNumber
    });
    
    await user.save();
    
    const payload = { id: user._id, role: user.role, fullName: user.fullName, accountNumber: user.accountNumber, balance: user.balance };
    const token = jwt.sign(payload, 'apexbank_secret_key', { expiresIn: '1d' });
    
    const userData = { _id: user._id, role: user.role, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, accountNumber: user.accountNumber, balance: user.balance };
    res.status(201).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });
    
    const payload = { id: user._id, role: user.role, fullName: user.fullName, accountNumber: user.accountNumber, balance: user.balance };
    const token = jwt.sign(payload, 'apexbank_secret_key', { expiresIn: '1d' });
    
    const userData = { _id: user._id, role: user.role, fullName: user.fullName, email: user.email, phone: user.phone, address: user.address, accountNumber: user.accountNumber, balance: user.balance };
    res.status(200).json({ token, user: userData });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
