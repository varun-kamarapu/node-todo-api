var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/Todo');
var {User} = require('./model/User');

var port = process.env.PORT || 3000;

var app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Started on port ${port}`);
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
  Todo.find().then((todos)=>{res.send({todos});}, (err)=>{res.status(400).send(err);});
});

app.get('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }

  Todo.findById(req.params.id).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo})}, (err) =>{res.status(400).send(err);});

})

app.delete('/todos/:id', (req, res) => {
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }
  Todo.findByIdAndRemove(req.params.id).then((todo) =>{
      if(!todo){
        res.status(404).send();
      }
      res.send(todo);
  }, (err) => {res.status(404).send(err)});
});

module.exports.app ={app}
