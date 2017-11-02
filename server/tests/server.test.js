var expect = require('expect');
var request = require('supertest');
var { app } = require('../server');
var { TodoModel } = require('../models/todo');
var { ObjectID } = require('mongodb');
 
const todos = [{
    _id: new ObjectID(),
    text: 'First Todo'
}, {
    _id: new ObjectID(),
    text: 'Second Todo'
}];

beforeEach((done) => {
    TodoModel.remove({}).then(()=>{
        TodoModel.insertMany(todos);
    }).then(() => done());
});
describe('POST /todos', () => {
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
                TodoModel.find({text: text_test1}).then((todos) => {
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
                expect(todos.length).toBe(2);
                done();
            }).catch((err) => console.log(err));
        });
    });
});

describe('GET /todos', (done) => {
    //it('should get all todos', () => {
    //    request(app)
    //    .get('/todos',(err, res)=> {
    //        expect(res.body.todos.length).toBe(2);
    //    })
    //    .end(done);
    //});
    it('should get all todos', (done) => {
        request(app)
            .get('/todos')
            .end((err, res) => {
                expect(res.body.todos.length).toBe(2);
                done();
            });
    });
});

describe('GET /todos/:id',()=>{
    it('should return todo doc', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body.todo.text).toEqual(todos[0].text);
                done();
            });
    });

    it('should return 404 if resource not found', (done) => {
        let id = "5123321321564a";
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });

    it('should return 404 if for non-object ids', (done) => {
        let id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[1]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .expect(200)
            .expect((res) => {
                expect(res.body.deleted_todo._id).toEqual(id);
            })
            .end((err) => { 
                if (err) {
                    done(err);
                }
                TodoModel.findById(id).then((result) => {
                    expect(result).toBeNull();
                    done();
                }).catch((error) => {
                    done(error); 
                });
            });
    });

    it('should return 404 if object not found', (done) => {
        var id = new ObjectID;
        request(app).delete(`/todos/${id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    done(err);
                }
                expect(res.body.error_message)
                    .toEqual("Dataset not found");      
                done();
            });
    });

    it('should return 404 if object invalid', (done) => {
        var id = "654123sss";
        request(app).delete(`/todos/${id}`)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    done(err);
                } 
                expect(res.body.error_message)
                    .toEqual("ID is not valid");   
                done();            
            });
    });
});