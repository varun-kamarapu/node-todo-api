const {MongoClient} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return  console.log('Unable to connect to MongoDB server');
  }
  console.log('connected to MongoDB server');

  const db = client.db('TodoApp');
  db.collection('Todos').find({completed:'false'}).toArray().then((docs) =>{
    console.log(`${JSON.stringify(docs, undefined, 2)}`);
  }, (err) =>{
    console.log('cannot fetch documents');
  });

  client.close();

});
