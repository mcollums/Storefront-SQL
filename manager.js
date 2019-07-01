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
                lowInventory();
                console.log(chalk.green("You chose to View Low Inventory"));
                break;
            case "Add to Inventory":
                addInventory();
                console.log(chalk.green("You chose to Add to Inventory"));
                break;
            case "Add New Product":
                addProduct();
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
function viewProducts() {
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
function lowInventory() {
    //Starts query to DB for all products
    connection.query("SELECT * FROM products", function (err, res) {
        if (err) throw err;

        //Empty array that will be used by console.table
        var displayArr = [];

        //ForEach goes through each result from the DB
        res.forEach(function (obj) {
            if (obj.stock_quantity <= 5) {
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
            }
        })

        //Display product table in console
        console.log("\n");
        if (displayArr.length === 0) {
            console.table(chalk.blue("There are no products with low inventory.\n"));

        } else {
            console.table(displayArr);
        }

        //Calls prompt function
        inquirer.prompt([
            {
                type: "list",
                name: "next_action",
                message: "Would you like to add more inventory for an item?",
                choices: ["Yes", "No", "Exit"]
            }
        ]).then(function (res) {
            var action = res.next_action;

            switch (action) {
                case "Yes":
                    addInventory();
                    console.log(chalk.green("You chose to Add Inventory"));
                    break;
                case "No":
                    whatAction();
                    break;
                case "Exit":
                    console.log(chalk.green("You chose to Exit the Manager Program"));
                    process.exit();
                    break;
            }
        })
    })
}

// validateInput makes sure that the user is supplying only positive integers for their inputs
function validateInput(value) {
    var integer = Number.isInteger(parseFloat(value));
    var sign = Math.sign(value);

    //If the user selects q, the program stops.
    if (value == "q") {
        process.exit();

    //Else, if the input is an integer, program continues
    } else if (integer && (sign === 1)) {
        return true;

    //Else, asks for an integer
    } else {
        return 'Please enter a whole non-zero number.';
    }
}

//Add to Inventory
// Prompt user to chooose which item they'd like to add inventory for
// Prompt user for how many they'd like to restock
// If item-id isn't in DB, let user know that's not a valid response
//Ask user what they'd like to do next
function addInventory() {
    inquirer.prompt([
        {
            type: "input",
            name: "selected_item",
            message: "Which item would you like to order more stock for? Press Q to quit.",
            validate: validateInput
        },
        {
            type: "input",
            name: "order_amt",
            message: "How much stock would you like to order? Press Q to quit.",
            validate: validateInput
        }
    ]).then(function (res) {
        // console.log(res);
        var item = res.selected_item;
        var quantity = res.order_amt;

        // Query db to confirm that the given item ID exists in the desired quantity
        var queryStr = 'SELECT * FROM products WHERE ?';

        //Connection quert where the item id is equal to the chosen #
        connection.query(queryStr, { item_id: item }, function (err, data) {
            if (err) throw (err);

            //If there's no reponse for the selected # rerun the program
            if (data.length === 0) {
                console.log(chalk.red("\n Please enter a valid item id."));
                addInventory();
            } else {
                //Var to grab the info for the first result
                var productData = data[0];
                var newQuantity = parseFloat(quantity) + parseFloat(productData.stock_quantity);

                //Query string that will update the DB with the new quantity
                var updateQueryString = 'UPDATE products SET stock_quantity=\"' + newQuantity + '\" WHERE item_id= \"' + item + "\"";
                connection.query(updateQueryString, function (err, res) {
                    if (err) throw err;
                    console.log(chalk.blue("\n============================================================"));
                    console.log(chalk.blue("The new Stock Quantity for '" + productData.product_name + "' is " + newQuantity + "."));
                    console.log(chalk.blue("============================================================\n"));
                    whatAction();
                })

            }
        })
    })
}

//Add New Product
// Prompt user for the product...
//Name
//Price
//Quantity
//Select a Department from List
//Then use connection query to add those values to DB
//Ask user if they'd like to add another product..
//if no, ask what they'd like to do next
function addProduct() {
   
    var deptQueryString = "SELECT dept_name FROM products";
    connection.query(deptQueryString, function (err, res) {
        if (err) throw err;

        // Empty array to push dept titles to
        var deptArr = [];

        // ForEach function only adds the deptname to array if it's unique
        res.forEach(function (data) {
            // console.log(data.dept_name);
            if(deptArr.indexOf(data.dept_name) === -1) {
                deptArr.push(data.dept_name);
                console.log(deptArr);
              }
            // deptArr.push(data.dept_name);
        })
        // console.log("Department Array" + deptArr);

        inquirer.prompt([
            {
                type: "input",
                name: "new_name",
                message: "What is the product called? Press Q to quit."
            },
            {
                type: "input",
                name: "new_price",
                message: "What is the price of the product? Press Q to quit.",
                validate: validateInput
            },
            {
                type: "input",
                name: "new_quantity",
                message: "What quantity would you like to order?",
                validate: validateInput
            },
            {
                type: "list",
                name: "new_dept",
                message: "What department is this item listed?",
                choices: deptArr
            }
        ]).then(function (res) {
            console.log(res);
    
        })
    })

    
}

whatAction();