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
//ROUTE HANDLER for form submission
app.post('/add-tech', (req, res) => {
    const { name, type, brand, price, supplier_name, location_type } = req.body;

    // Check if any required field is empty
    if (!name || !type || !brand || !price || !supplier_name || !location_type) {
        console.error('Fields cannot be empty');
        res.status(400).send('No field can be empty');
        return;
    }

    // First, insert data into the inventory table
    const sqlInventory = 'INSERT INTO inventory (Name, Type, Brand, Price) VALUES (?, ?, ?, ?)';
    connection.query(sqlInventory, [name, type, brand, price], (error, results) => {
        if (error) {
            console.error('Error adding item', error.message);
            res.status(500).send('Error adding item');
            return;
        }

        // Get the last inserted serialID from the inventory table
        const serialID = results.insertId;

        // Insert data into the supplier table
        const sqlSupplier = 'INSERT INTO supplier (serialID, supplier_name) VALUES (?, ?)';
        connection.query(sqlSupplier, [serialID, supplier_name], (error, results) => {
            if (error) {
                console.error('Error adding supplier', error.message);
                res.status(500).send('Error adding supplier');
                return;
            }
            console.log('Supplier added successfully:', results);
        });

        // Insert data into the location table
        const sqlLocation = 'INSERT INTO location (serialID, location_type) VALUES (?, ?)';
        connection.query(sqlLocation, [serialID, location_type], (error, results) => {
            if (error) {
                console.error('Error adding location', error.message);
                res.status(500).send('Error adding location');
                return;
            }
            console.log('Location added successfully:', results);
        });

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


// Update Tech
app.put('/update-tech/:serialID', (req, res) => {
    const serialID = req.params.serialID;
    const { name, type, brand, price, supplier_name, location_type } = req.body;
    const sql = 'UPDATE inventory SET Name = ?, Type = ?, Brand = ?, Price = ? WHERE serialID = ?';

    const sql2= 'UPDATE supplier SET supplier_name = ? WHERE serialID = ?';
    const sql3 = 'UPDATE location SET location_type = ? WHERE serialID = ?';

    // Check if any required field is missing
    if (!name || !type || !brand || !price) {
        console.error('Fields cannot be empty');
        res.status(400).send('No field can be empty');
        return;
    }

    connection.query(sql, [name, type, brand, price, serialID], (error, results) => {
        if (error) {
            console.error('Error updating item:', error.message);
            res.status(500).send('Error updating item');
            return;
        }
        console.log('Item updated successfully:', results);
        res.send('Item updated successfully');
    });



    
});


    //Delete Tech
    app.delete('/delete-tech/:serialID', (req, res) => {
    const serialID = req.params.serialID;
    const sql = 'DELETE FROM inventory WHERE serialID = ?';


        connection.query(sql, [serialID], (error, results) =>{
        if (error) {
            console.error('Error deleting Item:', error.message);
            res.status(500).send('Error Deleting Item');
            return;
        }
        console.log('Item deleted successfully:', results);
        res.send('Item deleted successfully');
        });
    });

//Server Start
app.listen(port, () => {
    console.log(`Server is running on port: ${port}.`);
});