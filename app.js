//Inventory System
const express = require('express');
const mysql = require('mysql');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');


const app = express();
const port = 3000;


//CORS middleware to allow cross-origin requests (different origins for HTTP headers)
app.use(cors());

//body-parser middleware for JSON bodies (FORM INPUTS)
app.use(bodyParser.json());

//Parse application/x-www-form-urlencoded content
app.use(bodyParser.urlencoded({ extended: true }));

//MySQL Connection
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'tester',
    password: 'Dragon9786!@#',
    database: 'inventory_fp'
});

//Once database connects
connection.connect(error => {
    if (error) throw error;
    console.log('Successfully connected to inventory_fp database');
});

//Initiating database use
connection.query('USE inventory_fp', (error, results) => {
    if (error) throw error;
    console.log('Using inventory_fp.');
});


//Serving files from directory of index.html
app.get('/add-tech', (req, res) => {
    res.sendFile(__dirname + '/index.html');
});



// Serve static files from the current directory
app.use(express.static(__dirname));





//ROUTE HANDLER for form submission
app.post('/add-tech', (req, res) => {
    const {name, type, brand, price} = req.body;
    const sql = 'INSERT INTO inventory (Name, Type, Brand, Price) VALUES (?, ?, ?, ?)';

    // Check if the name field is empty
    if (!name || !type || !brand || !price) {
        console.error('Fields cannot be empty');
        res.status(400).send('No field can be empty');
        return;
    }

    connection.query(sql, [name, type, brand, price], (error, results) => {
        if (error) {
            console.error('Error adding item', error.message);
            res.status(500).send('Error adding item');
            return;
        };
        console.log('Item added successfully:', results);
        res.send('Item is now in inventory');
    });
});



//ROUTE HANDLER FOR UPDATE AND SEARCH

//Search Tech
app.get('/search-tech', (req, res) => {
    const searchQuery = req.query.search;
    const sql = 'SELECT * FROM Inventory WHERE Name LIKE ? OR Type LIKE ? OR Brand LIKE ? OR Price LIKE ?';

    connection.query(sql, [`%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`, `%${searchQuery}%`], (err, results) =>{
        if (err) {
            console.error('Error fetching items', err);
            return res.status(500).send('An error has occurred while fetching the items');
        }
        res.json(results);
    });
});


//Server Start
app.listen(port, () => {
    console.log(`Server is running on port: ${port}.`);
});