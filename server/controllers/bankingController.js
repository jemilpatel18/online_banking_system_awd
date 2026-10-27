const User = require('../models/User');
const Transaction = require('../models/Transaction');

exports.deposit = async (req, res) => {
  try {
    const { amount, description } = req.body;
    const user = await User.findById(req.user.id);
    
    if (!user) return res.status(404).json({ message: 'User not found' });
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    
    user.balance += amount;
    await user.save();
    
    const transaction = new Transaction({
      sender: user.accountNumber,
      receiver: user.accountNumber,
      type: 'Deposit',
      amount,
      description: description || 'Self Deposit'
    });
    
    await transaction.save();
    res.status(200).json({ message: 'Deposit successful', balance: user.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.transfer = async (req, res) => {
  try {
    const { receiverAccount, amount, description } = req.body;
    
    if (amount <= 0) return res.status(400).json({ message: 'Invalid amount' });
    
    const sender = await User.findById(req.user.id);
    if (!sender) return res.status(404).json({ message: 'Sender not found' });
    
    if (sender.balance < amount) return res.status(400).json({ message: 'Insufficient balance' });
    if (sender.accountNumber === receiverAccount) return res.status(400).json({ message: 'Cannot transfer to same account' });
    
    const receiver = await User.findOne({ accountNumber: receiverAccount });
    if (!receiver) return res.status(404).json({ message: 'Receiver account not found' });
    
    sender.balance -= amount;
    await sender.save();
    
    receiver.balance += amount;
    await receiver.save();
    
    const transaction = new Transaction({
      sender: sender.accountNumber,
      receiver: receiver.accountNumber,
      type: 'Transfer',
      amount,
      description: description || 'Fund Transfer'
    });
    
    await transaction.save();
    res.status(200).json({ message: 'Transfer successful', balance: sender.balance });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getTransactions = async (req, res) => {
  try {
    let transactions;
    if (req.user.role === 'admin') {
      transactions = await Transaction.find().sort({ createdAt: -1 });
    } else {
      const user = await User.findById(req.user.id);
      transactions = await Transaction.find({
        $or: [{ sender: user.accountNumber }, { receiver: user.accountNumber }]
      }).sort({ createdAt: -1 });
    }
    res.status(200).json(transactions);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
