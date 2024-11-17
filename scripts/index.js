const mongoose = require('mongoose');
const insertUsers = require('./generateUsers');
const insertProducts = require('./generateProducts');
const insertOrders = require('./generateOrders');
const MONGO_URI = 'mongodb://localhost:27017/emc';

(async () => {
  await mongoose.connect(MONGO_URI);

  const scriptArg = process.argv[2];
  if (!scriptArg) {
    await insertUsers();
    await insertProducts();
    await insertOrders();
  } else {
    scriptArg === 'users'
      ? await insertUsers()
      : scriptArg === 'products'
        ? await insertProducts()
        : await insertOrders();
  }

  mongoose.connection.close();
})();
