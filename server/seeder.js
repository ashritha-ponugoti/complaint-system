require('dotenv').config();
const mongoose = require('mongoose');
const connectDB = require('./config/db');

const User = require('./models/user');
const Complaint = require('./models/complaint');
const Feedback = require('./models/Feedback');

const seedData = async () => {
  try {
    await connectDB();

    // Clear existing data
    await User.deleteMany();
    await Complaint.deleteMany();
    await Feedback.deleteMany();

    // Create users (passwords auto-hash via pre-save hook)
    const admin = await User.create({
      name: 'Admin User',
      email: 'admin@demo.com',
      password: 'admin1234',
      role: 'ADMIN',
    });

    const agent1 = await User.create({
      name: 'Agent Smith',
      email: 'agent1@demo.com',
      password: 'agent1234',
      role: 'AGENT',
    });

    const agent2 = await User.create({
      name: 'Agent Johnson',
      email: 'agent2@demo.com',
      password: 'agent1234',
      role: 'AGENT',
    });

    const user1 = await User.create({
      name: 'Demo User',
      email: 'user@demo.com',
      password: 'user1234',
      role: 'USER',
    });

    const user2 = await User.create({
      name: 'Jane Cooper',
      email: 'user2@demo.com',
      password: 'user1234',
      role: 'USER',
    });

    // Create complaints
    const complaint1 = await Complaint.create({
      title: 'Login page not loading',
      description: 'The login page shows a blank screen on Chrome and Firefox.',
      category: 'Technical',
      priority: 'High',
      status: 'Open',
      user: user1._id,
    });

    const complaint2 = await Complaint.create({
      title: 'Double charged for subscription',
      description: 'I was charged twice for my monthly subscription this billing cycle.',
      category: 'Billing',
      priority: 'Urgent',
      status: 'In Progress',
      user: user2._id,
      assignedAgent: agent1._id,
      messages: [
        {
          sender: agent1._id,
          senderName: agent1.name,
          senderRole: agent1.role,
          message: 'Hi, I am looking into the duplicate charge now. Could you share your transaction ID?',
        },
      ],
    });

    const complaint3 = await Complaint.create({
      title: 'Poor customer service experience',
      description: 'Waited over an hour on chat support and never got a response.',
      category: 'Service',
      priority: 'Medium',
      status: 'Resolved',
      user: user1._id,
      assignedAgent: agent2._id,
      resolvedAt: new Date(),
    });

    const complaint4 = await Complaint.create({
      title: 'Product arrived damaged',
      description: 'The package arrived with a cracked screen on the device.',
      category: 'Product',
      priority: 'High',
      status: 'Open',
      user: user2._id,
    });

    const complaint5 = await Complaint.create({
      title: 'Feature request: dark mode',
      description: 'Would love to see a dark mode option added to the dashboard.',
      category: 'Other',
      priority: 'Low',
      status: 'Closed',
      user: user1._id,
      closedAt: new Date(),
    });

    
    // Feedback for the resolved complaint
await Feedback.create({
    complaint: complaint3._id,
    user: user1._id,
    agent: agent2._id,
    rating: 4,
    comment: 'Took a while but the agent was helpful once they responded.',
});

    console.log('Seeding complete');
    console.log(`Users: ${await User.countDocuments()}`);
    console.log(`Complaints: ${await Complaint.countDocuments()}`);
    console.log(`Feedback: ${await Feedback.countDocuments()}`);

    process.exit(0);
  } catch (err) {
    console.error('Seeding error:', err);
    process.exit(1);
  }
};

seedData();