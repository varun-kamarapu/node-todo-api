const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/model/Todo');
const {User} = require('./../server/model/User');

var id = '5c2544657aab321488b714d2';

Todo.find().then((Todos) => {
  console.log(Todos);
  }, (err) =>{
    console.log(err);
  });

Todo.findOne({_id:id}).then((Todo) => {
  console.log(Todo);
  }, (err) =>{
    console.log(err);
  });

Todo.findById(id).then((Todo) => {
  console.log(Todo);
  }, (err) =>{
    console.log(err);
  });
