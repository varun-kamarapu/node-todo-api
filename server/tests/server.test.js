const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server').app;
const {Todo} = require('./../model/Todo');
const {User} = require('./../model/User');
const {todos, populateTodos, users, populateUsers} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('Post /todos', () => {

  it('Should create a new Todo', (done) => {
    var text = 'Eat Nothing for Dinner tomorrow';
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      // .expect((res) => {
      //   expect(res.body.text).toBe(text);
      // })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find({text}).then((todos) => {
          expect(todos.length).toBe(1);
          expect(todos[0].text).toBe(text);
          done();
        }).catch((e) => done(e));
      })
  });

  it('Shouldnot create a Todo when a bad request is sent', (done) => {
    request(app)
      .post('/todos')
      .send({})
      .expect(400)
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) => {
          expect(todos.length).toBe(2);
          done();
        }).catch((err) => done(err))
      });
  });
});

describe('GET /Todos', ()=> {

  it('Should get all the Todos', (done) => {

      request(app)
        .get('/todos')
        .expect(200)
        .expect((res) => {
          expect(res.body.todos.length).toBe(2)
        })
        .end(done);
  });

});

describe('GET /todos/:id', () =>{

  it('Should return todo doc', (done) => {
    request(app)
      .get(`/todos/${todos[0]._id.toHexString()}`)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(todos[0].text)
      })
      .end(done)
  });

  it('Should return 404 if todo not found', (done) => {
    var test_id = new ObjectID();
    request(app)
      .get(`/todos/${test_id.toHexString()}`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 for non-object ids', (done) => {
    request(app)
      .get('/todos/123')
      .expect(404)
      .end(done)
  });
});

// describe('DELETE /todos/:id', () => {
//   it('Should remove a todo', (done) => {
//     request(app)
//     .delete(`/todos/${todos[0]._id.toHexString()}`)
//     .expect(200)
//     // .expect((res) => {
//     //   expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
//     // })
//     .end((err, res) => {
//       if(err){
//         return done(err)
//       }
//       Todo.findById(todos[0]._id.toHexString()).then((todo) => {
//         expect(todo).toNotExist();
//         done();
//       }).catch((err) => done(err));
//     })
//   });
//
//   it('Should return 404 if todo not found', (done) => {
//     var test_id = new ObjectID();
//     request(app)
//       .delete(`/todos/${test_id.toHexString()}`)
//       .expect(404)
//       .end(done)
//   });
//
//   it('Should return 404 if ObjectID is invaild', (done) => {
//     request(app)
//       .delete('/todos/123')
//       .expect(404)
//       .end(done)
//   });
// });

describe('PATCH /todos/:id', () => {
  it('Should update the Todo', (done) => {
    var hexId = todos[0]._id.toHexString();
    var body = {
      text: "See if this appears in the document",
      completed: true
    }
    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text+1);
        expect(res.body.todo.completed).toBe(true);
        expect(res.body.todo.completedAt).toBeA('number');
      })
      .end((err, res) => {
          Todo.findById(hexId).then((todo) => {
              expect(todo.completed).toBe(true);
              done();
          }).catch((err) => done(err))
      })
  });

  it('Should clear completedAt when todo is not completed', (done) =>{
    var hexId = todos[1]._id.toHexString();
    var body = {
      text: "See if this appears in the document2",
      completed: false
    }
    request(app)
      .patch(`/todos/${hexId}`)
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.todo.text).toBe(body.text);
        expect(res.body.todo.completed).toBe(false);
        expect(res.body.todo.completedAt).toNotExist();
      })
      .end((err, res) => {
          Todo.findById(hexId).then((todo) => {
              expect(todo.completed).toBe(false);
              done();
          }).catch((err) => done(err))
      })

  });
});

describe('GET /users/me', () => {

  it('Should return user if authenticated', (done) =>{
    request(app)
      .get('/users/me')
      .set('x-auth', users[0].tokens[0].token)
      .expect(200)
      .expect((res) => {
        expect(res.body._id).toBe(users[0]._id.toHexString())
        expect(res.body.email).toBe(users[0].email)
      })
      .end(done);
  });

  it('Should return 401 if not authenticated', (done) =>{
    request(app)
      .get('/users/me')
      .expect(401)
      .expect((res) => {
        expect(res.body).toEqual({})
      })
      .end(done)

  });

});

describe('POST /users', () => {

  it('Should create a user',(done) => {
    var body = {
      email: 'cherry@gmail.com',
      password: 'abc123'
    }

    request(app)
      .post('/users')
      .send(body)
      .expect(200)
      .expect((res) =>{
        expect(res.headers['x-auth']).toExist();
        expect(res.body._id).toExist();
        expect(res.body.email).toBe(body.email)
      })
      .end((err) => {
        if(err){
          return done();
        }
        User.findOne({email: body.email}).then((user) => {
          expect(user).toExist();
          expect(user.password).toNotBe(body.password);
          done();
        });
      });

  });

  it('Should return validation errors if request is invalid',(done) => {

    var body = {
      email: 'cherrycom',
      password: 'abc123'
    }
    request(app)
      .post('/users')
      .send(body)
      .expect(400)
      .end(done);
  });

  it('Should not create a user if email in use',(done) => {

    var body = {
      email: users[0].email,
      password: 'abc123'
    }

    request(app)
      .post('/users')
      .send(body)
      .expect(400)
      .expect((res) =>{
        expect(res.body).toEqual({});
      })
      .end(done);
  });

});

describe('POST /users/login', () => {
  it('Should login user and return auth token', (done) => {
    var body = {
      email: 'varun.kamarapu@gmail.com',
      password: 'userOnePass'
    }
    request(app)
      .post('/users/login')
      .send(body)
      .expect(200)
      .expect((res) => {
        expect(res.body.email).toBe(body.email)
        expect(res.headers['x-auth']).toExist()
      })
      .end(done)

  });

  it('Should return invaild login', (done) => {
    var body = {
      email: 'varun.kamarapu1@gmail.com',
      password: 'userOnePass'
    }

    request(app)
      .post('/users/login')
      .send(body)
      .expect(400)
      .expect((res) => {
        expect(res.body.email).toBe(undefined)
        expect(res.headers['x-auth']).toNotExist()
      })
      .end(done)



  });
});
