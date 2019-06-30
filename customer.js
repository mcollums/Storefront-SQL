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

    //If the user selects q, the program stops.
    if (value === "q") {
        process.exit();

    //Else, if the input is an integer, program continues
    } else if (integer && (sign === 1)) {
        return true;

    //Else, asks for an integer
    } else {
        return 'Please enter a whole non-zero number.';
    }
}

//This function displays the products available from the DB
function displayDB() {
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

        //Calls next function
        askCustomer();
    })
}

//This function asks the user if they'd like to make another purchase
function goAgain() {
    inquirer.prompt([
        {
            type: "list",
            name: "confirm",
            message: "Would you like to make another purchase?",
            choices: ["Yes", "No"]
        }
    ]).then(function (res) {
        //If yes, run the displayDB function
        if (res === "yes") {
            displayDB();

        //Else, exit the program
        } else {
            process.exit();
        }
    })
}

//This function asks the customer what they'd like to purchase.
function askCustomer() {
    inquirer.prompt([
        {
            type: "input",
            name: "selectItem",
            message: "Which item would you like to purchase? Press Q to exit.",
            validate: validateInput, //This is validated with a function that checks if the value is a 'q' or integer
        },
        {
            type: "input",
            name: "selectQuantity",
            message: "How many would you like to purchase? Press Q to exit.",
            validate: validateInput, //This is validated with a function that checks if the value is a 'q' or integer
        }
    ]).then(function (UserRes) {

        // console.log(UserRes);
        var item = UserRes.selectItem;
        var quantity = UserRes.selectQuantity;

        // Query db to confirm that the given item ID exists in the desired quantity
        var queryStr = 'SELECT * FROM products WHERE ?';

        //Connection quert where the item id is equal to the chosen #
        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw (err);

            //If there's no reponse for the selected # rerun the program
            if (data.length === 0) {
                console.log(chalk.red("\n Please enter a valid item id."));
                displayDB();
            } else {
                // console.log('data = ' + JSON.stringify(data));

                //Var to grab the info for the first result
                var productData = data[0];

                //If the requested quantity is less or equal to the stock quantity...
                if (quantity <= productData.stock_quantity) {

                    //Sees if the user ordered one item or multiple
                    if (quantity <= 1) {
                        console.log(chalk.blue("\n Great, there's a " + productData.product_name + " to purchase. Placing your order..."));
                    } else { 
                        console.log(chalk.blue("\n Great, there are enough " + productData.product_name + "s to purchase. Placing your order..."));
                    }

                    //Calculates the new quantity for the DB
                    var newQuantity = parseFloat(productData.stock_quantity) - parseFloat(quantity);

                    //Query string that will update the DB with the new quantity
                    var updateQueryString = 'UPDATE products SET stock_quantity=\"' + newQuantity + '\" WHERE item_id= \"' + item + "\"";
                    
                    //Connection query to update the stock quantity 
                    connection.query(updateQueryString, function (err, data) {
                        if (err) throw err;

                        //Getting the total cost of the purchase and logging to the console
                        var total = parseFloat(productData.price) * parseFloat(quantity);
                        console.log(chalk.blue("Your order has been placed! Your total is $" + total + "."));
                        console.log(chalk.blue("============================================================\n"));

                        //End connection when finished
                        connection.end();

                        //Ask user if they'd like to make a new purchase
                        goAgain();
                    })
                } else {
                    //If user requests more quantity than is available log out to the console...
                    console.log(chalk.red("\n Sorry, there is not enough product in stock. Please modify your order."));
                    console.log(chalk.red("============================================================\n"));

                    //Restart the program
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