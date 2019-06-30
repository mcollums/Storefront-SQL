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

// This function asks the user if they'd like to make another purchase
function whatAction() {
    inquirer.prompt([
        {
            type: "list",
            name: "user_action",
            message: "Would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "Exit"]
        }
    ]).then(function (res) {
        // console.log(res.user_action);
        var action = res.user_action;

        switch (action) {
            case "View Products for Sale":
                  viewProducts();
                console.log(chalk.green("You chose to View Products"));
                break;
            case "View Low Inventory":
                //   lowInventory();
                console.log(chalk.green("You chose to View Low Inventory"));
                break;
            case "Add to Inventory":
                //   addInventory();
                console.log(chalk.green("You chose to Add to Inventory"));
                break;
            case "Add New Product":
                //   addProduct();
                console.log(chalk.green("You chose to Add a New Product"));
                break;
            case "Exit":
                console.log(chalk.green("You chose to Exit the Manager Program"));
                process.exit();
                break;
        }
    })
}

//View Products Function
// Connection query for all DB Columns
// Make the response a table using console.table

//Ask user what they'd like to do next
function viewProducts(){
    //Starts query to DB for all products
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        //Empty array that will be used by console.table
        var displayArr = [];

        //ForEach goes through each result from the DB
        res.forEach(function (obj) {
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

        //Calls prompt function
        whatAction();
    })
}

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

whatAction();
// viewProducts();