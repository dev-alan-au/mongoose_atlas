const mongoose = require('mongoose');
require('dotenv').config();

main().catch(err => console.log(err));

async function main() {
  const username = process.env.DB_ADMIN_USERNAME;
  const password = process.env.DB_ADMIN_PASSWORD;
  const connectionStr = `mongodb+srv://${username}:${password}@cluster0.rxomr5o.mongodb.net/?retryWrites=true&w=majority`;
  await mongoose.connect(connectionStr);

  console.log('Connected to Atlas');
}

