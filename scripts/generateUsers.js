const { faker } = require('@faker-js/faker');
const bcrypt = require('bcryptjs');
const User = require('../src/models/User');

// Function to generate random users
const generateUsers = (count) => {
  const roles = ['customer', 'admin', 'seller'];
  const users = [];

  for (let i = 0; i < count; i++) {
    const user = {
      name: faker.person.fullName(),
      email: faker.internet.email(),
      passwordHash: 'Password1234',
      role: roles[Math.floor(Math.random() * roles.length)]
    };
    users.push(user);
  }

  return users;
};

async function hashPasswords(users) {
  return Promise.all(
    users.map(async (user) => {
      user.passwordHash = await bcrypt.hash(user.passwordHash, 10);
      return user;
    })
  );
}

// Insert generated users into MongoDB
const insertUsers = async () => {
  try {
    const users = await hashPasswords(generateUsers(1000));
    const insertedUsers = await User.insertMany(users);
    console.log(
      `${insertedUsers.length} users have been inserted into the users collection.`
    );
  } catch (error) {
    console.error('Error inserting users:', error);
  }
};

module.exports = insertUsers;
