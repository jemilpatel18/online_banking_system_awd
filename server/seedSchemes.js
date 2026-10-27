const mongoose = require('mongoose');
const Scheme = require('./models/Scheme');

mongoose.connect('mongodb://localhost:27017/apexbank')
  .then(async () => {
    console.log('MongoDB connected');

    // Clear existing schemes
    await Scheme.deleteMany({});
    console.log('Cleared existing schemes');

    // Regular Banking Schemes
    const regularSchemes = [
      {
        name: 'Fixed Deposit (FD)',
        type: 'regular',
        category: 'FD',
        description: 'Deposit a lump sum for a selected tenure with attractive interest rates',
        benefits: 'Guaranteed returns, flexible tenure options, competitive interest rates',
        eligibility: 'Any individual with a valid bank account',
        interestRate: 7.5,
        tenure: '1-10 years',
        minAmount: 1000,
        maxAmount: 10000000,
        status: 'Active',
        icon: '🏦'
      },
      {
        name: 'Recurring Deposit (RD)',
        type: 'regular',
        category: 'RD',
        description: 'Save a fixed amount regularly and build your savings systematically',
        benefits: 'Regular savings habit, attractive interest rates, loan facility available',
        eligibility: 'Any individual aged 18 years and above',
        interestRate: 6.5,
        tenure: '6 months to 10 years',
        minAmount: 500,
        maxAmount: 100000,
        status: 'Active',
        icon: '💰'
      },
      {
        name: 'Savings Growth Scheme',
        type: 'regular',
        category: 'Savings',
        description: 'Encourage regular savings with clearly defined benefits and interest',
        benefits: 'Higher interest on regular deposits, bonus for consistent savings',
        eligibility: 'Existing account holders with minimum 6 months relationship',
        interestRate: 5.5,
        tenure: '1-5 years',
        minAmount: 1000,
        status: 'Active',
        icon: '📈'
      },
      {
        name: 'Senior Citizen Savings Scheme',
        type: 'regular',
        category: 'Savings',
        description: 'Special savings scheme for senior citizens with additional benefits',
        benefits: 'Higher interest rates, tax benefits, secure investment',
        eligibility: 'Individuals aged 60 years and above',
        interestRate: 8.0,
        tenure: '5 years',
        minAmount: 1000,
        maxAmount: 1500000,
        status: 'Active',
        icon: '👴'
      }
    ];

    // Festival Special Schemes
    const festivalSchemes = [
      {
        name: 'Diwali Special Savings Scheme',
        type: 'festival',
        category: 'Savings',
        description: 'Festival-themed savings plan with promotional rewards and special benefits',
        benefits: 'Additional 0.5% interest, festive bonus, no processing fee',
        eligibility: 'All customers, new and existing',
        interestRate: 6.0,
        tenure: '1-3 years',
        minAmount: 5000,
        maxAmount: 500000,
        status: 'Active',
        startDate: new Date('2024-10-20'),
        endDate: new Date('2024-11-15'),
        festivalYear: 2024,
        icon: '🪔'
      },
      {
        name: 'Navratri Savings Scheme',
        type: 'festival',
        category: 'Savings',
        description: 'A special nine-day savings campaign with clearly defined promotional terms',
        benefits: 'Special interest rate for 9 days, festival bonuses, quick processing',
        eligibility: 'All account holders',
        interestRate: 5.8,
        tenure: '9 days to 1 year',
        minAmount: 2000,
        status: 'Upcoming',
        startDate: new Date('2024-10-03'),
        endDate: new Date('2024-10-12'),
        festivalYear: 2024,
        icon: '🎪'
      },
      {
        name: 'Holi Special Deposit Scheme',
        type: 'festival',
        category: 'FD',
        description: 'Festival-themed deposit offer with configurable rewards and tenure',
        benefits: 'Colorful bonuses, flexible tenure, special rates',
        eligibility: 'All customers',
        interestRate: 7.0,
        tenure: '3 months to 2 years',
        minAmount: 3000,
        maxAmount: 300000,
        status: 'Expired',
        startDate: new Date('2024-03-15'),
        endDate: new Date('2024-03-25'),
        festivalYear: 2024,
        icon: '🎨'
      },
      {
        name: 'Dhanteras Wealth Scheme',
        type: 'festival',
        category: 'FD',
        description: 'Promote FD investments and long-term savings during Dhanteras',
        benefits: 'Gold-tier benefits, preferential rates, wealth management tips',
        eligibility: 'All customers, special benefits for premium customers',
        interestRate: 7.8,
        tenure: '1-5 years',
        minAmount: 10000,
        maxAmount: 1000000,
        status: 'Upcoming',
        startDate: new Date('2024-10-29'),
        endDate: new Date('2024-11-01'),
        festivalYear: 2024,
        icon: '💎'
      },
      {
        name: 'Makar Sankranti Savings Scheme',
        type: 'festival',
        category: 'Savings',
        description: 'Seasonal savings promotion with defined benefits for the harvest festival',
        benefits: 'Harvest bonuses, special rates, flexible withdrawal options',
        eligibility: 'All customers, especially rural and semi-urban customers',
        interestRate: 6.2,
        tenure: '6 months to 3 years',
        minAmount: 1500,
        maxAmount: 200000,
        status: 'Upcoming',
        startDate: new Date('2025-01-12'),
        endDate: new Date('2025-01-15'),
        festivalYear: 2025,
        icon: '🪁'
      },
      {
        name: 'New Year Savings Scheme',
        type: 'festival',
        category: 'Savings',
        description: 'Encourage users to start a new savings plan with promotional offers',
        benefits: 'New year bonus, special interest for first month, goal-based savings',
        eligibility: 'All customers, especially new account holders',
        interestRate: 6.5,
        tenure: '1-5 years',
        minAmount: 1000,
        maxAmount: 500000,
        status: 'Active',
        startDate: new Date('2024-01-01'),
        endDate: new Date('2024-01-31'),
        festivalYear: 2024,
        icon: '🎆'
      }
    ];

    // Insert all schemes
    await Scheme.insertMany([...regularSchemes, ...festivalSchemes]);
    console.log('Schemes seeded successfully');

    console.log('Total schemes inserted:', regularSchemes.length + festivalSchemes.length);
    console.log('Regular schemes:', regularSchemes.length);
    console.log('Festival schemes:', festivalSchemes.length);

    mongoose.connection.close();
    console.log('Database connection closed');
  })
  .catch(err => {
    console.error('Error seeding schemes:', err);
    process.exit(1);
  });
