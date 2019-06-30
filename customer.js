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

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
	var integer = Number.isInteger(parseFloat(value));
	var sign = Math.sign(value);

	if (integer && (sign === 1)) {
		return true;
	} else {
		return 'Please enter a whole non-zero number.';
	}
}

//Function acts like a "homebase" for the customer, runs functions that 
//display DB items and asks customer what they'd like to do
// function startCustomer() {
//     displayDB();
//     askCustomer();
//     // connection.connect(function (err) {
//     //     if (err) throw err;
//     //     console.log("connected as id " + connection.threadId);
//     //     displayDB();
//     //     askCustomer();
//     //     connection.end();
//     // });
// }

//This function displays the products available from the DB
function displayDB() {
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
    })
    askCustomer();
}

function askCustomer() {
    connection.query("SELECT * FROM products", function (err, DbRes) {
        if (err) throw err;
   
        // console.log(DbRes);
        inquirer.prompt([
            {
                type: "input",
                name: "selectItem",
                message: "Which item would you like to purchase?",
                validate: validateInput,
			    filter: Number
            },
            {
                type: "input",
                name: "selectQuantity",
                message: "How many would you like to purchase?",
                validate: validateInput,
			    filter: Number
            }
        ]).then(function (UserRes) {

            // console.log(UserRes);
            var itemNum = UserRes.selectItem;
            var itemQuan = UserRes.selectQuantity;

            // Query db to confirm that the given item ID exists in the desired quantity
		    var queryStr = 'SELECT * FROM products WHERE ?';

            DbRes.forEach(function (obj) {
                if (itemNum == obj.item_id) {
                    console.log("You've chosen " + obj.product_name);
                    if (itemQuan <= obj.stock_quantity) {
                        // console.log("There are enough of those in stock!");
                        var newQuan = parseFloat(obj.stock_quantity) - parseFloat(itemQuan);
                        var query = connection.query(
                            "UPDATE products SET ? WHERE ?",
                            [
                                {
                                    stock_quantity: newQuan
                                },
                                {
                                    item_id: itemNum
                                }
                            ],
                            function (err, res) {
                                if (err) throw err;
                                //   console.log(res.affectedRows + " products updated!\n");

                            }
                        );
                        // console.log(query.sql);

                        var total = parseFloat(obj.price) * itemQuan;
                        console.log("Your total is $" + total + ".");
                    } else {
                        console.log("Sorry, there aren't enough in stock");
                    }
                }
            })
            displayDB();
        })
    })
}

// startCustomer();
displayDB();

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