const {MongoClient, ObjectID} = require('mongodb');

MongoClient.connect('mongodb://localhost:27017/TodoApp', (err, client) => {
  if(err){
    return  console.log('Unable to connect to MongoDB server');
  }
  console.log('connected to MongoDB server');

  const db = client.db('TodoApp');

  // //Delete Many function
  // db.collection('Users').deleteMany({name: "Varun"}).then((res) =>{
  //     console.log(res);
  //   }, (err) =>{
  //       console.log('cannot delete the document');
  //     });
  //
  // //Delete One function
  // db.collection('Users').deleteOne({name: "Varun"}).then((res) =>{
  //   console.log(res);
  // }, (err) =>{
  //   console.log('cannot delete the document');
  // });

  db.collection('Users').findOneAndDelete({_id: new ObjectID("5c244008faaea630d0c8378e")}).then((res) =>{
    console.log(JSON.stringify(res, undefined, 2));
  }, (err) =>{
    console.log('cannot delete the document');
  });
  //client.close();

});
