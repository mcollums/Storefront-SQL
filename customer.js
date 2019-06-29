require("dotenv").config();
var chalk = require("chalk");
var mysql = require("mysql");
var inquirer = require("inquirer");
var table = require("console.table")


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

function displayDB(err, res) {
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;
        
        var displayArr = [];
        
        res.forEach(function(obj){
            var product = {};
            product.ID = obj.item_id;
            product.Name = obj.product_name;
            product.Department = obj.dept_name;
            product.Price = obj.price;
            product.Quantity = obj.stock_quantity;
        
            displayArr.push(product);
        })
        console.log("\n");
        console.table(displayArr);
    })
}

function connectDB() {
    connection.connect(function (err) {
        if (err) throw err;
        console.log("connected as id " + connection.threadId);
        displayDB();
        connection.end();
    });
}

connectDB();

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