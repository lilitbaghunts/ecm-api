const mongoose = require('mongoose');
const { faker } = require('@faker-js/faker');
const User = require('../src/models/User');
const connectDB = require('../src/config/db');
const MONGO_URI = 'mongodb://localhost:27017/emc';

connectDB(MONGO_URI);

// Function to generate random users
function generateUsers(count) {
  const roles = ['customer', 'admin', 'seller'];
  const users = [];

  for (let i = 0; i < count; i++) {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: faker.internet.password(),
      role: roles[Math.floor(Math.random() * roles.length)]
    };
    users.push(user);
  }

  return users;
}

// Insert generated users into MongoDB
async function insertUsers() {
  try {
    const users = generateUsers(1);
    const insertedUsers = await User.insertMany(users);
    console.log(
      `${insertedUsers.length} users have been inserted into the users collection.`
    );
  } catch (error) {
    console.error('Error inserting users:', error);
  } finally {
    mongoose.connection.close();
  }
}

// Run the insertion function
insertUsers();
