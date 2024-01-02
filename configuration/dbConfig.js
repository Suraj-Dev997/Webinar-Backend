const sql = require("mssql");


module.exports = {
    user: 'dev',
    password: 'Dev@2023',
    server: '216.48.176.144', 
    database: 'NetcastDbNew',
    port:1433,
    options: {
      encrypt: true, // Use if you're on Windows Azure
      enableArithAbort: true,
      trustServerCertificate: true,
    },
  };