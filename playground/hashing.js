const {SHA256} = require('crypto-js');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');

var password = 'abc12'

bcrypt.genSalt(10, (err, salt) => {
  bcrypt.hash(password, salt, (err, hash) => {

  });
});

var hashPassword = '$2a$10$KHR/Sezd5ZdUFeN03/6u2uKSbvPUCq0pTxrX4qNEFmrc.0QZJY5re'

bcrypt.compare(password, hashPassword, (err, res) => {
  console.log(err);
});

var data = {
  id:10
};

var token = jwt.sign(data, '123abc');

console.log(token);

var decoded = jwt.verify(token, '123abc');

console.log(decoded);
