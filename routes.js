// routes.js
const express = require('express');
const router = express.Router();
const mssql = require('mssql');
const pool = new mssql.ConnectionPool(require('./configuration/dbConfig'));

router.post('/WebcastAllDetail', async (req, res) => {
  try {
    const { IPClientCode, IPDeptID } = req.body;

    if (!IPClientCode || !IPDeptID) {
      return res.status(400).json({ error: 'IPClientCode and IPDeptID are required in the request body' });
    }

    const connection = await pool.connect();


    const request = connection.request();
    request.input('IP_ClientCode', mssql.VarChar, IPClientCode);
    request.input('IP_DeptID', mssql.VarChar, IPDeptID);
    request.output('OP_ErrorCode', mssql.VarChar);
    request.output('OP_ErrorMessage', mssql.VarChar);

    const result = await request.execute('Wc_Get_Webcast_All_Detail_ClientCode_deptid');

    connection.close();

    const evtObj = {
      events: [],
      allowdDomainList: [],
      speakerList: [],
      fieldList: []
    };

    // Process the first result set (assuming it contains event details)
    result.recordset.forEach((row) => {
      const evt = {
        WcId: row.WcId,
        Title: row.Title,
        // ... add other properties
      };
      evtObj.events.push(evt);
    });

    // Process the second result set (assuming it contains allowed domains)
    result.recordsets[1].forEach((row) => {
      const objad = {
        WcId: row.WcId,
        AllowedDomain: row.AllowedDomain,
      };
      evtObj.allowdDomainList.push(objad);
    });

    // Process the third result set (assuming it contains speaker details)
    result.recordsets[2].forEach((row) => {
      const spkPro = {
        SpkName: row.SpkName,
        SpkType: row.SpkType,
        SpkImage: row.SpkImage,
      };
      evtObj.speakerList.push(spkPro);
    });

    // Process the fourth result set (assuming it contains field details)
    result.recordsets[3].forEach((row) => {
      const fieldObj = {
        WcFid: row.WcFid,
        FieldCode: row.FieldCode,
        FieldType: row.FieldType,
        IsMandate: row.IsMandate,
        PlaceHolder: row.PlaceHolder,
        DisplayOrder: row.DisplayOrder,
      };
      evtObj.fieldList.push(fieldObj);
    });

    res.json(evtObj);
  } catch (error) {
    console.error('Error executing stored procedure:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

module.exports = router;
