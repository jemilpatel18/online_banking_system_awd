const User = require('../models/User');
const FixedDeposit = require('../models/FixedDeposit');
const Settings = require('../models/Settings');
const Transaction = require('../models/Transaction');

exports.createFD = async (req, res) => {
  let debitedUser;
  let fd;
  let transaction;
  let amount;

  try {
    console.log('FD creation request body:', req.body);
    console.log('User from token:', req.user);

    amount = Number(req.body?.amount);
    const duration = Number(req.body?.duration);
    if (!Number.isFinite(amount) || amount < 1000 || !Number.isInteger(duration) || duration <= 0) {
      return res.status(400).json({ message: 'Invalid input' });
    }

    const settings = await Settings.findOne();
    const rate = Number(settings?.fdInterestRate ?? 15);
    if (!Number.isFinite(rate) || rate < 0) {
      throw new Error('FD interest rate configuration is invalid');
    }

    const interest = (amount * rate * duration) / 100;
    const maturityAmount = amount + interest;
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + duration);

    // Atomically prevent concurrent requests from overdrawing the account.
    debitedUser = await User.findOneAndUpdate(
      { _id: req.user.id, balance: { $gte: amount } },
      { $inc: { balance: -amount } },
      { new: true }
    );
    if (!debitedUser) {
      const userExists = await User.exists({ _id: req.user.id });
      return res.status(userExists ? 400 : 404).json({
        message: userExists ? 'Insufficient balance for FD' : 'User not found'
      });
    }

    fd = new FixedDeposit({
      user: debitedUser._id,
      amount,
      interestRate: rate,
      duration,
      interest,
      maturityAmount,
      maturityDate
    });

    transaction = new Transaction({
      sender: debitedUser.accountNumber,
      receiver: 'BANK',
      type: 'FD Creation',
      amount,
      description: `Fixed Deposit creation for ${duration} years - Amount debited from account`,
      status: 'Success'
    });
    console.log('Saving FD:', fd);
    await fd.save();
    console.log('FD saved successfully');
    console.log('Saving transaction:', transaction);
    await transaction.save();
    console.log('Transaction saved successfully');

    res.status(201).json({
      message: 'Fixed Deposit created successfully',
      fd,
      newBalance: debitedUser.balance
    });
  } catch (err) {
    console.error('FD creation error:', err);
    console.error('Error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });

    if (debitedUser) {
      const rollbackOperations = [
        User.updateOne({ _id: debitedUser._id }, { $inc: { balance: amount } })
      ];
      if (fd?._id) rollbackOperations.push(FixedDeposit.deleteOne({ _id: fd._id }));
      if (transaction?._id) rollbackOperations.push(Transaction.deleteOne({ _id: transaction._id }));

      const rollbackResults = await Promise.allSettled(rollbackOperations);
      rollbackResults.forEach((result) => {
        if (result.status === 'rejected') {
          console.error('FD creation rollback failed:', result.reason);
        }
      });
      if (rollbackResults.some((result) => result.status === 'rejected')) {
        return res.status(500).json({
          message: 'FD creation failed and account rollback needs attention. Contact support.'
        });
      }
    }

    res.status(500).json({ message: 'Unable to create fixed deposit. Please try again.' });
  }
};

exports.getAllFDs = async (req, res) => {
  try {
    let fds;
    if (req.user.role === 'admin') {
      fds = await FixedDeposit.find().populate('user', 'fullName email accountNumber');
    } else {
      fds = await FixedDeposit.find({ user: req.user.id });
    }
    res.status(200).json(fds);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.deleteFD = async (req, res) => {
  try {
    if (req.user.role !== 'admin') return res.status(403).json({ message: 'Access denied' });
    
    const fd = await FixedDeposit.findByIdAndDelete(req.params.id);
    if (!fd) return res.status(404).json({ message: 'FD not found' });
    
    res.status(200).json({ message: 'Fixed Deposit deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
