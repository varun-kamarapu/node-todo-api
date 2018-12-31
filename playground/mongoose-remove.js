const {ObjectID} = require('mongodb');

const {mongoose} = require('./../server/db/mongoose')
const {Todo} = require('./../server/model/Todo');
const {User} = require('./../server/model/User');

// Todo.remove({}).then((res) => {
//   console.log(res);
// });
//
// Todo.findOneAndRemove().then((docs) => {
//
// });

Todo.findByIdAndRemove('5c2a58c89375111efc7450f6').then((todo) => {
  console.log(todo);
});
