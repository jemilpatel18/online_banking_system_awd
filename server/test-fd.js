const mongoose = require('mongoose');
const User = require('./models/User');
const FixedDeposit = require('./models/FixedDeposit');
const Transaction = require('./models/Transaction');
const Settings = require('./models/Settings');

const testFD = async () => {
  try {
    await mongoose.connect('mongodb://localhost:27017/apexbank');
    console.log('MongoDB connected');

    // Get a user
    const user = await User.findOne({ role: 'user' });
    if (!user) {
      console.log('No user found. Creating test user...');
      const bcrypt = require('bcryptjs');
      const hashedPassword = await bcrypt.hash('test123', 10);
      user = new User({
        fullName: 'Test User',
        email: 'test@test.com',
        phone: '1234567890',
        password: hashedPassword,
        accountNumber: 'APEX10001',
        balance: 10000,
        role: 'user'
      });
      await user.save();
    }
    console.log('User:', user.accountNumber, 'Balance:', user.balance);

    // Get settings
    const settings = await Settings.findOne();
    const rate = Number(settings?.fdInterestRate ?? 15);
    console.log('FD Rate:', rate);

    const amount = 5000;
    const duration = 2;
    const interest = (amount * rate * duration) / 100;
    const maturityAmount = amount + interest;
    const maturityDate = new Date();
    maturityDate.setFullYear(maturityDate.getFullYear() + duration);

    console.log('Creating FD with amount:', amount, 'duration:', duration);

    // Create FD
    const fd = new FixedDeposit({
      user: user._id,
      amount,
      interestRate: rate,
      duration,
      interest,
      maturityAmount,
      maturityDate
    });
    await fd.save();
    console.log('FD saved successfully:', fd._id);

    // Create Transaction
    const transaction = new Transaction({
      sender: user.accountNumber,
      receiver: 'BANK',
      type: 'FD Creation',
      amount,
      description: `Fixed Deposit creation for ${duration} years - Amount debited from account`,
      status: 'Success'
    });
    await transaction.save();
    console.log('Transaction saved successfully:', transaction._id);

    console.log('Test completed successfully!');
  } catch (err) {
    console.error('Test failed:', err);
    console.error('Error details:', {
      message: err.message,
      name: err.name,
      stack: err.stack
    });
  } finally {
    await mongoose.disconnect();
  }
};

testFD();
