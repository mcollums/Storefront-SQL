require("dotenv").config();
var chalk = require("chalk");
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table")

//Establishing credentials to SQL DB
var connection = mysql.createConnection({
    host: "localhost",
    // Your port; if not 3306
    port: 3306,
    // Your username
    user: "root",
    // Your password
    password: process.env.DB_PASSWORD,
    database: "bamazonDB"
});

//Function acts like a "homebase" for the customer, runs functions that 
//display DB items and asks customer what they'd like to do
function startCustomer() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        displayDB();
        connection.end();
    });
}

//This function displays the products available from the DB
function displayDB(err, res) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        //Empty array that will be used by console.table
        var displayArr = [];
        
        //ForEach goes through each result from the DB
        res.forEach(function(obj){
            //Makes a new empty object
            var product = {};
            //Adds values to the object
            product.ID = obj.item_id;
            product.Name = obj.product_name;
            product.Department = obj.dept_name;
            product.Price = obj.price;
            product.Quantity = obj.stock_quantity;
            
            //Pushes object to the displayArr
            displayArr.push(product);
        })
        //Display product table in console
        console.log("\n");
        console.table(displayArr);
    })
}



startCustomer();

  //The program automatically shows the product database as a table
        //Show ids, name, price, stock, dept
  //Prompt the user with inquirer
        //Ask which product id they'd like to buy
        //How many units of that product?
        //THEN...
        //If there ARE ENOUGH products 
            //Update the DB to reflect the new quantity
            //Show customer total cost of purchase
            //"Go back to Homescreen Functions"
        //If there are NOT ENOUGH products
            //log "Insufficient Quantity"