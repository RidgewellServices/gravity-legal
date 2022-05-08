const express = require('express');
const router = express.Router();

// get invoices list
router.get('/list', function(req, res) {
  let sql = `SELECT * FROM invoices`;
  db.query(sql, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: "Invoices list retrieved successfully"
    })
  })
});

// get invoice by invoice_number
router.get('/:invoice_number', function(req, res) {
  let sql = `SELECT * FROM invoices WHERE invoice_number='${req.params.invoice_number}'`;
  db.query(sql, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: `Invoice ${req.params.invoice_number} retrieved successfully`
    })
  })
});
// update invoice amount by invoice_number
router.put('/:invoice_number', function(req, res) {
  let sql = `UPDATE invoices SET amount='${req.body.remainderDue}' WHERE invoice_number='${req.params.invoice_number}'`;
  db.query(sql, function(err, data, fields) {
    if (err) throw err;
    res.json({
      status: 200,
      data,
      message: `Invoice ${req.params.invoice_number} updated successfully`
    })
  })
});

// create new invoice
router.post('/new', function(req, res) {
  if (req.body.amount < 0) {
    res.json({
      status: 0,
      "errors": [
        {
          "code":"123",
          "desription":"amount cannot be negative"
        }
      ]
    })
  } else {
    let sql = `INSERT INTO invoices(title, description, amount) VALUES (?)`;
    let values = [
      req.body.title,
      req.body.description,
      req.body.amount
    ];
    db.query(sql, [values], function(err, data, fields) {
      if (err) throw err;
      res.json({
        status: 200,
        data: { "url": `localhost:3000/pay_invoice/${data.insertId}`},
        message: `New invoice ${data.insertId} added successfully`
      })
    })
  }
});

module.exports = router;
