const express = require('express');
const bodyParser = require('body-parser');
const mssql = require('mssql');
const dbConfig = require('./configuration/dbConfig');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());

// MSSQL Connection Pool
const pool = new mssql.ConnectionPool(dbConfig);
const poolConnect = pool.connect();

poolConnect.then((connection) => {
  console.log('Connected to MSSQL');
  connection.close();
}).catch((err) => {
  console.error('Error connecting to MSSQL:', err);
});

// Use API routes
app.use('/', routes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});