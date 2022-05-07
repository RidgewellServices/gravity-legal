const path = require('path');
const express = require("express");
const mysql = require('mysql');
const cors = require('cors');
const bodyParser = require('body-parser');
const invoicesRouter = require('../routes/invoices');

const PORT = process.env.PORT || 3001;

db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Th3R00t)fAll#v1l!sM0n3y',
  database: 'gravitylegal'
});

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Have Node serve the files for our built React app
app.use(express.static(path.resolve(__dirname, '../client/build')));

app.get("/api", (req, res) => {
  res.set('Content-Type', 'application/json');
  res.json({ message: "Hello from server!" });
});

app.use('/invoices', invoicesRouter);

// All other GET requests not handled before will return our React app
app.get('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '../client/build', 'index.html'));
});

app.listen(PORT, () => {
  console.log(`Server listening on ${PORT}`);
});
