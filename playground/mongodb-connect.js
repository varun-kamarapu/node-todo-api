const mongoClient = require('mongodb').MongoClient;

mongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return  console.log('Unable to connect to MongoDB server');
  }
  console.log('connected to MongoDB server');

  const db = client.db('TodoApp');
//New collection 'Todos'
  db.collection('Todos').insertOne({
    text: "Somethingelse to do",
    completed: "True"
  }, (err, res) => {
    if(err){
      return  console.log('Unable to insert Todo', err);
    }
    console.log(`${JSON.stringify(res.ops, undefined, 2)} Successfull created Todo`);
  })
//New collection 'Users'
  db.collection('Users').insertOne({
      name: "Varun",
      age: 25,
      location: "Swindon"
    }, (err, res) => {
      if(err){
        return console.log('cannot create the table');
      }
    //  console.log(`${JSON.stringify(res.ops, undefined, 2)}`);
    console.log(`${res.ops[0]._id.getTimestamp()} hello`);
    })

  client.close();

});
