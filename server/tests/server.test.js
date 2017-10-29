var expect = require('expect');
var request = require('supertest');
var { app } = require('../server');
var { TodoModel } = require('../models/todo');

beforeEach((done) => {
    TodoModel.remove({}).then(() => done());
});
describe('Todos api', () => {
    text_test1 = "this is a mocha test";
    it('should create a new todo', (done) => {
        request(app)
            .post('/todos')
            .send({text: text_test1})
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text_test1);
            })
            .end((err, res) => {
                if (err){
                    return done(err);
                }
                TodoModel.find().then((todos) => {
                    expect(todos.length).toBe(1);
                    expect(todos[0].text).toEqual(text_test1);
                    done();
                }).catch((err) => console.log(err));
            });
    });

    it('should not create todo', (done) => {
        text = "";
        request(app)
            .post('/todos')
            .send({ text: text })
            .expect(400)
        .end((err, res) => {
            if (err) {
                return done(err);
            }
            TodoModel.find().then((todos) => {
                expect(todos.length).toBe(0);
                done();
            }).catch((err) => console.log(err));
        });
    })
});

