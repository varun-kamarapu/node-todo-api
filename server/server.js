var env = process.env.NODE_ENV || 'development'

if(env === 'development'){
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://localhost:27017/TodoApp'
} else if(env === 'test'){
  process.env.port = 3000;
  process.env.MONGODB_URI = 'mongodb://127.0.0.1:27017/TodoAppTest'
}

const express = require('express');
const bodyParser = require('body-parser');
const {ObjectID} = require('mongodb');
const _ = require('lodash');
const bcrypt = require('bcryptjs')

const {mongoose} = require('./db/mongoose');
const {Todo} = require('./model/Todo');
const {User} = require('./model/User');
const {authenticate} = require('./middleware/authenticate');

var port = process.env.PORT;

var app = express();

app.use(bodyParser.json());

app.listen(port, () => {
  console.log(`Started on port ${port}`);
});

app.post('/todos', authenticate, (req, res) => {
    var newTodo = new Todo({
    text:req.body.text,
    _creator: req.user._id
  });
  newTodo.save().then((doc) =>{
    res.send(doc);
    }, (err) =>{
      res.status(400).send(`Cannot create the document ${err}`);
    });
});

app.get('/todos', authenticate, (req, res) => {
  Todo.find({_creator: req.user._id}).then((todos)=>{res.send({todos});}, (err)=>{res.status(400).send(err);});
});

app.get('/todos/:id', authenticate, (req, res) => {

  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }

  Todo.findOne({_id:req.params.id, _creator: req.user._id}).then((todo) => {
    if(!todo){
      return res.status(404).send();
    }
    res.send({todo})}, (err) =>{res.status(400).send(err);});

})

app.delete('/todos/:id', authenticate, (req, res) => {
  if(!ObjectID.isValid(req.params.id)){
    return res.status(404).send();
  }
  Todo.findOneAndRemove({_id: req.params.id, _creator: req.user._id}).then((todo) =>{
      if(!todo){
        res.status(404).send();
      }
      res.send(todo);
  }, (err) => {res.status(404).send(err)});
});

app.patch('/todos/:id', authenticate, (req, res) => {
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

  Todo.findOneAndUpdate({_id: id, _creator: req.user._id}, {$set: body}, {new: true}).then((todo) => {
    res.send({todo});
  }).catch((err) => {
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

app.get('/users/me', authenticate, (req, res) => {
  res.send(req.user);
});

app.post('/users/login', (req, res) => {

  var body = _.pick(req.body, ['email', 'password']);

  // User.findOne({req.body.email}).then((user) => {
  //
  // bcrypt.compare(body.password, user.password, (err, compareResult) => {
  //   if(compareResult){
  //     res.send(user)
  //   }
  //   res.status(400).send();
  // })
  // });
  User.findByCredentials(body.email, body.password).then((user) => {
    return user.generateAuthToken().then((token) => {
      res.header('x-auth', token).send(user);
    });
  }).catch((e)=> {
      res.status(400).send();
  })
});

app.delete('/users/me/token',authenticate, (req, res) => {
  req.user.removeToken(req.token).then(() => {
    res.status(200).send()
  }).catch((err) => {res.status(400).send()})

});

module.exports.app ={app}
