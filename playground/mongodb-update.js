const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return  console.log('Unable to connect to MongoDB server');
  }
  console.log('connected to MongoDB server');

  const db = client.db('TodoApp');

  db.collection('Users').findOneAndUpdate({
    name: "cherry"},
  {$set: {name: "Cherry"}, $inc: {age: 1}}, {returnOriginal: false}).then((res) =>{
    console.log(res);
  }, (err)=>{
    console.log(err);
  })

  client.close();

});
