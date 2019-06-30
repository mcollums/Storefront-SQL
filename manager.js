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

//Show list of options
    // View Products for sale
    // View Low Inventory
    // Add to Inventory
    // Add New Product
    // When user selects one of these options, run the cooresponding function.

//View Products Function
    // Connection query for all DB Columns
    // Make the response a table using console.table
    //Ask user what they'd like to do next
//View Low Inventory
    //Connection Query for all DB Columns
        //Display items only if the quantity is less than 5
        //Make the response a table using console.table
        //Ask user what they'd like to do next

//Add to Inventory
    // Prompt user to chooose which item they'd like to add inventory for
    // Prompt user for how many they'd like to restock
    // If item-id isn't in DB, let user know that's not a valid response
    //Ask user what they'd like to do next

//Add New Product
    // Prompt user for the product...
        //Name
        //Price
        //Quantity
        //Select a Department from List
        //Then use connection query to add those values to DB
    //Ask user if they'd like to add another product..
        //if no, ask what they'd like to do next
