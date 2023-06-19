const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const CLI = require('./index.js');


const PORT = process.env.PORT || 3001;
const app = express();

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: 'localhost',
    // MySQL username,
    user: 'root',
    // MySql password
    password: 'Nintendowii1!',
    // MySQL database
    database: 'employees_db'
  },
  console.log(`Connected to the employees_db database.`)
);

db.connect((err) => {
  if (err) {
    console.error('Error Connecting to Database', err);
    return;
  }
  console.log('Connected to Database');

  // Connects the command line prompt to the database
  const cli = new CLI(db);
  cli.run();
});

// Application listening
app.listen(PORT, () =>{
  console.log(`Server is running on port ${PORT}`);
});