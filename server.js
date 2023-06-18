const express = require('express');
// Import and require mysql2
const mysql = require('mysql2');
const CLI = require('./index.js');
const cli = new CLI();

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


cli.run();