var env = process.env.NODE_ENV || 'development'

if(env === 'development'){
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if(env === 'test'){
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoAppTest'
}

var express = require('express');
var bodyParser = require('body-parser');
var {ObjectID} = require('mongodb');
var _ = require('lodash');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/Todo');
var {User} = require('./model/User');

var port = process.env.PORT;

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

app.patch('/todos/:id', (req, res) => {
  var id = req.params.id;
  var body = _.pick(req.body, ['text', 'completed'])

  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }
  if(_.isBoolean(body.completed) && body.completed){
    body.completedAt = new Date().getTime();
  }else {
    body.completed = false;
    body.completedAt = null;
  }

  Todo.findByIdAndUpdate(id, {$set: body}, {new: true}).then((todo) => {
    res.send({todo})}).catch((err) => {
      res.status(404).send(err)
    });

});

app.post('/users', (req, res) => {
  var body = _.pick(req.body, ['email', 'password'])
  var newUser = new User(body);

  newUser.save().then((newUser) => {
    return newUser.generateAuthToken();
  }).then((token) => {
    res.header('x-auth', token).send(newUser);
  }).catch((err) =>{
      res.status(400).send(`Cannot create the document ${err}`);
  });

});

module.exports.app ={app}
