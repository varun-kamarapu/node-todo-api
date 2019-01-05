var mongoose = require('mongoose');

var Todo = mongoose.model('Todo',{
  text: {
    type: String,
    required: true,
    trim: true,
    minlength:1
  },
  completed:{
    type: Boolean,
    default: false
  },
  completedAt:{
    type: Number,
    default: null
  },
  _creator: mongoose.Schema.Types.ObjectId
})

module.exports = {Todo}
