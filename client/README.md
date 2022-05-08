# Gravity Legal take home test
## CODE:

## SQL
### In MySQL workbench:
CREATE DATABASE gravitylegal;
USE gravitylegal;

CREATE TABLE invoices(
invoice_number INT AUTO_INCREMENT PRIMARY KEY UNIQUE,
title VARCHAR(125),
description VARCHAR(500),
amount decimal
);

ALTER USER 'root'@'localhost' IDENTIFIED WITH mysql_native_password BY 'Th3R00t)fAll#v1l!sM0n3y';
flush privileges;

### In ./server/index.js, configure the connection like this:
db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'Th3R00t)fAll#v1l!sM0n3y',
  database: 'gravitylegal'
});

## TESTS:
### ADD INVOICE:
REQUEST:
curl -X POST \
 http://localhost:3001/invoices/new \
 -H "Content-Type: application/json" \
 -d '{"title": "Invoice10", "description":"this is the tenth invoice", "amount":"25000"}'
RESONSE:
{"status":200,"data":{"url":"localhost:3000/pay_invoice/10"},"message":"New invoice 10 added successfully"}

### FAIL TO ADD INVALID INVOICE:
curl -X POST \
 http://localhost:3001/invoices/new \
 -H "Content-Type: application/json" \
 -d '{"title": "Invoice8", "description":"this is the eighth invoice", "amount":"-15000"}'
RESPONSE:
{"status":0,"errors":[{"code":"123","desription":"amount cannot be negative"}]}

### UPDATE INVOICE AMOUNT DUE
REQUEST:
curl -X PUT \
 http://localhost:3001/invoices/10 \
 -H "Content-Type: application/json" \
 -d '{"remainderDue": "20000"}'
 RESPONSE:
 {"status":200,"data":{"fieldCount":0,"affectedRows":1,"insertId":0,"serverStatus":2,"warningCount":0,"message":"(Rows matched: 1  Changed: 1  Warnings: 0","protocol41":true,"changedRows":1},"message":"Invoice 10 updated successfully"}

 ### FAIL TO UPDATE INVOICE:
 I did the error handling in the client. I chose to do the calculation before sending off an update as opposed to handling the errors in the application.

## OTHER COMMANDS:
### LIST ALL INVOICES:
curl -X GET \
 http://localhost:3001/invoices/list \
 -H "Content-Type: application/json" \
 RESPONSE:
 {"status":200,"data":[{"invoice_number":1,"title":"Invoice1","description":"this is the first invoice","amount":0},{"invoice_number":2,"title":"Invoice2","description":"this is the second invoice","amount":0},{"invoice_number":3,"title":"Invoice3","description":"this is the third invoice","amount":1850},{"invoice_number":4,"title":"Invoice4","description":"this is the fourth invoice","amount":15000},{"invoice_number":5,"title":"Invoice4","description":"this is the fourth invoice","amount":15000},{"invoice_number":6,"title":"Invoice5","description":"this is the fifth invoice","amount":15000},{"invoice_number":7,"title":"Invoice7","description":"this is the seventh invoice","amount":15000},{"invoice_number":8,"title":"Invoice8","description":"this is the eighth invoice","amount":15000},{"invoice_number":9,"title":"Invoice9","description":"this is the ninth invoice","amount":1000},{"invoice_number":10,"title":"Invoice10","description":"this is the tenth invoice","amount":20000}],"message":"Invoices list retrieved successfully"}
**Note: You can also run this command from the browser:
http://localhost:3001/invoices/list

### LIST SINGLE INVOICE BY INVOICE NUMBER:
curl -X GET \       
 http://localhost:3001/invoices/1 \
 -H "Content-Type: application/json" \
 RESPONSE:
{"status":200,"data":[{"invoice_number":1,"title":"Invoice1","description":"this is the first invoice","amount":0}],"message":"Invoice 1 retrieved successfully"}
**Note: You can also run this command from the brower:
http://localhost:3001/invoices/1
