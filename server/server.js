var express = require('express');
var bodyParser = require('body-parser');

var {mongoose} = require('./db/mongoose');
var {Todo} = require('./model/Todo')
var {User} = require('./model/User')

var app = express();

app.use(bodyParser.json());

app.listen(3000, () => {
  console.log("Started on port 3000");
});


app.post('/todos', (req, res) => {
    var newTodo = new Todo({
    text:req.body.text
  });

  newTodo.save().then((doc) =>{
    res.send(`Document was successfully created ${doc}`);
  }, (err) =>{
      res.send(`cannot create the document ${err}`);
    })

});

  // var varun = new User({
  //   email: "  varun.kamarapu  "
  // });
  // varun.save().then((doc) => {
  //   console.log(doc);
  // },(err) =>{
  //   console.log(err);
  // })
