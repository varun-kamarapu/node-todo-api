const request = require('supertest');
const expect = require('expect');
const {ObjectID} = require('mongodb');

const {app} = require('./../server').app;
const {Todo} = require('./../model/Todo');

const todos = [{
  _id: new ObjectID(),
  text: 'First test Todo'
  },
  {
  _id: new ObjectID(),
  text: 'Second test Todo'
  }]

beforeEach((done) => {
  Todo.remove({}).then(() => {
    return Todo.insertMany(todos)
  }).then(() => {done()})
});

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

describe('DELETE /todos/:id', () => {
  it('Should remove a todo', (done) => {
    request(app)
    .delete(`/todos/${todos[0]._id.toHexString()}`)
    .expect(200)
    // .expect((res) => {
    //   expect(res.body.todo._id).toBe(todos[0]._id.toHexString())
    // })
    .end((err, res) => {
      if(err){
        return done(err)
      }
      Todo.findById(todos[0]._id.toHexString()).then((todo) => {
        expect(todo).toNotExist();
        done();
      }).catch((err) => done(err));
    })
  });

  it('Should return 404 if todo not found', (done) => {
    var test_id = new ObjectID();
    request(app)
      .delete(`/todos/${test_id.toHexString()}`)
      .expect(404)
      .end(done)
  });

  it('Should return 404 if ObjectID is invaild', (done) => {
    request(app)
      .delete('/todos/123')
      .expect(404)
      .end(done)
  });
});
