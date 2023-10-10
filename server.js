const express = require('express');
const fs = require('fs');
const Papa = require('papaparse');
const path = require('path');

const app = express();
const port = 3000;

// Middleware to add CORS headers
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');  // Replace '*' with your origin if needed
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
  });  

app.use(express.static(path.join(__dirname)));  // Serve static files

app.get('/data', (req, res) => {
  fs.readFile('data.csv', 'utf8', (err, data) => {
    if (err) {
      console.error(err);
      return res.sendStatus(500);
    }
    Papa.parse(data, {
      header: true,
      complete: (result) => {
        res.json(result.data);
        fs.writeFile('data.json', JSON.stringify(result.data, null, 2), (err) => {
          if (err) throw err;
          console.log('Data written to file');
        });
      }
    });
  });
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}/`);
});
