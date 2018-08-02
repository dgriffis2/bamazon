var itemID;
var item;
var numItems;
var newQuantity;

var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
  host: "localhost",

  // Your port; if not 3306
  port: 3306,

  // Your username
  user: "root",

  // Your password
  password: "root",
  database: "bamazon_db"
});

connection.connect(function(err) {
  if (err) throw err;
//   console.log("connected as id " + connection.threadId);
  displayAllItems();
});

function displayAllItems() {
  connection.query("SELECT * FROM products", function(err, res) {
    if (err) throw err;
    for(var i=0;i<res.length; i++){
        console.log("Item Id: " + res[i].item_id + "| " + "Product: " + res[i].product_name + "|" + "Department: " + res[i].department_name + "|" + "Price: " + res[i].price + "|" + "Quantity: " + res[i].stock_quantity)
        console.log("----------------")
    }
    start()
  });
}


function start(){
    inquirer
    .prompt([{
        name: "item",
        type: "input",
        message: "What is the ID of the item you would like to purchase?"
    }]).then(function(answer){
        var answerPar = parseInt(answer.item)
        if(answerPar===1 || answerPar==2 || answerPar==3 || answerPar==4 || answerPar==5 || answerPar==6 || answerPar==7 || answerPar==8 || answerPar==9 || answerPar==10){

            itemID=parseInt(answer.item)
            // console.log(itemID)
            howMany();
        }else{
            console.log("I'm sorry that is not a valid response")
            start();
        }
    })
}

function howMany(){
    inquirer
    .prompt([{
        name: "number",
        type: "input",
        message: "How many would you like to purchase?"
    }]).then(function(answer){
        numItems = parseInt(answer.number)
        whichItem()
    })
}


function whichItem(){
    connection.query("SELECT * FROM products", function(err, response) {
        if (err) throw err;
        for(var i=0; i<response.length;i++){
            if(response[i].item_id===itemID){
                item=response[i]
            }
        }
        inStock();
      });
}


function inStock(){
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
            var price = numItems*item.price
            if(numItems>item.stock_quantity){
                console.log("I'm Sorry there is not enough in stock for that.")
                howMany()
            }else{
                console.log("Thank you for your purchase. Your total is $" + price)
                newQuantity=item.stock_quantity-numItems
                updateQuantity()
            }
      });
}


function updateQuantity(){
    connection.query(
      "UPDATE products SET ? WHERE ?",
      [
        {
          stock_quantity: newQuantity
        },
        {
          item_id: itemID
        }
      ],
      function(err, res) {
        keepShopping()
      }
    );
}

function check(){
    console.log("Item ID: " + itemID)
    console.log("Number to buy: " + numItems)
    console.log(item)
    connection.end();
}

function keepShopping(){
    inquirer
    .prompt([{
        name: "name",
        type: "input",
        message: "Would you like to keep shopping?(enter y or n)"
    }]).then(function(foo){
        if(foo.name==="y"){
            displayAllItems()
        }
        if(foo.name==="n"){
            doneShopping()
        }
    })
}

function doneShopping(){
    console.log("Thank you for shopping with us. Goodbye!")
    connection.end()
}