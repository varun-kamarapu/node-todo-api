var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/Todo');
var {User} = require('./model/User');

var app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Started on port 3000");
});

app.get('/',(req, res) => {
  res.send("hello");
});

app.post('/todos', (req, res) => {
    var newTodo = new Todo({
    text:req.body.text
  });
  newTodo.save().then((doc) =>{
    res.send(`Document was successfully created ${doc}`);
    }, (err) =>{
      res.status(400).send(`Cannot create the document ${err}`);
    });

});

app.get('/todos', (req, res) => {
  Todo.find().then((todos)=>{res.send(todos);}, (err)=>{res.send(err);});
});

module.exports.app ={app}
