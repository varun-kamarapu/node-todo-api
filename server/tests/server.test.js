const request = require('supertest');
const expect = require('expect');

const {app} = require('./../server').app;
const {Todo} = require('./../model/Todo');

beforeEach((done) => {
  Todo.remove({}).then(() => done());
});

describe('Post /todos', () => {

  it('Should create a new Todo', (done) => {
    var text = "Eat Nothing for Dinner tomorrow";
    request(app)
      .post('/todos')
      .send({text})
      .expect(200)
      .expect((res) => {
        expect(res.body.text).toBe(text);
      })
      .end((err, res) => {
        if(err){
          return done(err);
        }
        Todo.find().then((todos) => {
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
          expect(todos.length).toBe(0);
          done();
        }).catch((err) => done(err))
      })
  });

});
