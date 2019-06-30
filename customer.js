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

function goAgain() {
    inquirer.prompt([
        {
            type: "list",
            name: "confirm",
            message: "Would you like to make another purchase?",
            choices: ["Yes", "No"]
        }
    ]).then(function (res){
        if(res === "yes"){
            displayDB();
        } else {
            process.exit();
        }
    })
}

function askCustomer() {
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
        var item = UserRes.selectItem;
        var quantity = UserRes.selectQuantity;

        // Query db to confirm that the given item ID exists in the desired quantity
        var queryStr = 'SELECT * FROM products WHERE ?';

        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw (err);

            if (data.length === 0) {
                console.log("Please enter a valid item id");
                displayDB();
            } else {
                console.log('data = ' + JSON.stringify(data));
                var productData = data[0];
                if (quantity <= productData.stock_quantity) {
                    console.log("Great, there are enough " + productData.product_name + " to purchase. Placing your order...");
                    var newQuantity = parseFloat(productData.stock_quantity) - parseFloat(quantity);
                    var updateQueryString = 'UPDATE products SET stock_quantity=\"' + newQuantity + '\" WHERE item_id= \"' + item + "\"";
                    connection.query(updateQueryString, function (err, data) {
                        if (err) throw err;
                        var total = parseFloat(productData.price) * parseFloat(quantity);
                        console.log("Your order has been placed! Your total is $" + total + ".");
                        console.log("\n============================================================");
                        connection.end(); 
                        goAgain();
                    })
                } else {
                    console.log("Sorry, there is not enough product in stock. Please modify your order.");
                    console.log("\n============================================================");
                    displayDB();
                }
            }
        })
    })
}

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