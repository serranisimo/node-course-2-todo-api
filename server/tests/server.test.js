require('./../../config/config');
var {
    User
} = require('./../models/user');
var {
    Todos
} = require('./../models/todo');
var expect = require('expect');
var request = require('supertest');
var {
    app
} = require('../server');
var {
    Todo
} = require('../models/todo');
var {
    ObjectID
} = require('mongodb');

const {
    todos,
    populateTodos,
    users,
    populateUsers
} = require('./seed/seed');

beforeEach(populateUsers);
beforeEach(populateTodos);

describe('POST /todos', () => {
    text_test1 = "this is a mocha test";
    it('should create a new todo', (done) => {
        request(app)
            .post('/todos')
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text: text_test1
            })
            .expect(200)
            .expect((res) => {
                expect(res.body.text).toBe(text_test1);
            })
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find({
                    text: text_test1
                }).then((todos) => {
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
            .set('x-auth', users[0].tokens[0].token)
            .send({
                text: text
            })
            .expect(400)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                Todo.find().then((todos) => {
                    expect(todos.length).toBe(2);
                    done();
                }).catch((err) => done(err));
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
            .set('x-auth', users[0].tokens[0].token)
            .end((err, res) => {
                expect(res.body.todos.length).toBe(1);
                done();
            });
    });
});

describe('GET /todos/:id', () => {
    it('should return todo doc', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body.todo.text).toBe(todos[0].text);
                done();
            });
    });

    it('should not return todo doc', (done) => {
        let id = todos[0]._id.toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err, res) => {
                if (err) {
                    return done(err);
                }
                expect(res.body.todo).toBeUndefined();
                done();
            });
    });

    it('should return 404 if resource not found', (done) => {
        let id = "5123321321564a";
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });

    it('should return 404 if for non-object ids', (done) => {
        let id = new ObjectID().toHexString();
        request(app)
            .get(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(404)
            .end(done);
    });
});

describe('DELETE /todos/:id', () => {
    it('should remove a todo', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body.deleted_todo._id).toEqual(id);
            })
            .end((err) => {
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((result) => {
                    expect(result).toBeFalsy();
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should not remove a todo of another user', (done) => {
        var id = todos[0]._id.toHexString();
        request(app).delete(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .expect(404)
            .end((err) => {
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((result) => {
                    expect(result).toBeTruthy();
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should return 404 if object not found', (done) => {
        var id = new ObjectID;
        request(app)
            .delete(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
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
            .set('x-auth', users[0].tokens[0].token)
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

describe('PATCH /todos/:id', () => {
    it('should update a todo', (done) => {
        var id = todos[0]._id.toHexString();
        var update = {
            text: "Update test",
            completed: true
        };
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
            .send(update)
            .expect(200)
            .expect((res) => { //check response
                expect(res.body.todo._id).toEqual(id);
                expect(res.body.todo).toEqual(expect.objectContaining(update));
                expect(typeof res.body.todo.completedAt).toBe("number");
            })
            .end((err) => {
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((result) => {
                    // //check DB against changes            
                    // expect(result.text).toBe(update.text);
                    // expect(result.completed).toBe(update.completed);
                    // expect(typeof result.completedAt).toBe("number");
                    expect(result).toEqual(expect.objectContaining(update));
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should not update a todo', (done) => {
        var id = todos[0]._id.toHexString();
        var update = {
            text: "Update test",
            completed: true
        };
        request(app)
            .patch(`/todos/${id}`)
            .set('x-auth', users[1].tokens[0].token)
            .send(update)
            .expect(404)
            .expect((res) => { //check response
                expect(res.body.todo).toBeUndefined();
            })
            .end((err) => {
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((result) => {
                    expect(result).not.toEqual(expect.objectContaining(update));
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });
    it('should clear completedAt if todo is not completed', (done) => {
        var id = todos[0]._id.toHexString();
        var update = {
            text: "Second text update",
            completed: !todos[1].completed
        }
        request(app).patch(`/todos/${id}`)            
            .set('x-auth', users[0].tokens[0].token)
            .send(update)
            .expect(200)
            .expect((res) => {
                expect(res.body.todo._id).toEqual(id);
                expect(res.body.todo).toEqual(expect.objectContaining(update));
            })
            .end((err) => {
                if (err) {
                    done(err);
                }
                Todo.findById(id).then((result) => {
                    // expect(result).toMatchObject(update);  
                    expect(result).toEqual(expect.objectContaining(update));
                    expect(result.completedAt).toBeFalsy();
                    done();
                }).catch((error) => {
                    done(error);
                });
            });
    });

    it('should return 404 if object not found', (done) => {
        var id = new ObjectID;
        request(app).patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
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
        request(app).patch(`/todos/${id}`)
            .set('x-auth', users[0].tokens[0].token)
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

describe('GET /users/me', () => {
    it('should return user if authenticated', (done) => {
        request(app)
            .get('/users/me')
            .set('x-auth', users[0].tokens[0].token)
            .expect(200)
            .expect((res) => {
                expect(res.body._id).toBe(users[0]._id.toHexString());
                expect(res.body.email).toBe(users[0].email);
            })
            .end(done);
    });

    it('should retun a 401 if not authenticated', (done) => {
        request(app).get('/users/me')
            .expect(401)
            .expect((res) => {
                expect(res.body).toEqual({})
            })
            .end(done);
    });
});

describe('POST /users', () => {
    it('should create a user', (done) => {
        var email = "derBeste@allerBesten.de";
        var password = "einfachDerBeste";

        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers['x-auth']).toBeTruthy();
                expect(res.body._id).toBeTruthy();
                expect(res.body.email).toBe(email);
            }).end((err) => {
                if (err) {
                    done(err);
                }

                User.find({
                    email
                }).then((user) => {
                    expect(user).toBeTruthy();
                    expect(user.password).not.toBe(password);
                    done();
                }).catch((err) => done(err));
            })
    });

    it('should return validation errors if request invalid', (done) => {
        var email = "derBesteallerBesten.de";
        var password = "abcd3";
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done)

    });

    it('should not create a user if email in use', (done) => {
        var email = users[0].email;
        var password = "einfachDerBeste";
        request(app)
            .post('/users')
            .send({
                email,
                password
            })
            .expect(400)
            .end(done)
    });
});

describe('POST /users/login', () => {
    it('should login user and return token', (done) => {
        request(app)
            .post('/users/login')
            .send({
                email: users[1].email,
                password: users[1].password
            })
            .expect(200)
            .expect((res) => {
                expect(res.headers["x-auth"]).toBeTruthy();
                expect(res.headers["x-auth"]).toBeTruthy();
                /**
                 * The second user of the seeded users has no tokens
                 * THis line of code would make the test case fail
                 */
                // expect(res.headers["x-auth"]).not.toEqual(users[1].tokens[1].token);
            }).end((err, res) => {
                if (err) {
                    done(err);
                }
                User.findById(users[1]._id).then((user) => {
                    /**
                     * The new version of expect cannot parse all the information out of
                     * the mongoose object. By calling the method "toObject()" all the raw user data
                     * of the object are selected but without the mongoose specific methods and properties
                     */console.log(user); console.log(user.toObject())
                    expect(user.tokens[user.tokens.length -1].toObject())
                        .toMatchObject(
                            {
                                access: "auth",
                                token: res.headers["x-auth"]
                            }
                        );
                        done();
                }).catch((err) => done(err));    
                // done();            
            });           
    });

    it('should reject invalid login', (done) => {
        var beforeTokenLength = users[1].tokens.length;
        request(app)
        .post('/users/login')
        .send({
            email: users[1].email,
            password: users[1].password+"A"
        })
        .expect(400)
        .expect((res) => {
            expect(res.headers["x-auth"]).toBeFalsy();
            /**
             * The second user of the seeded users has no tokens
             * THis line of code would make the test case fail
             */
            // expect(res.headers["x-auth"]).not.toEqual(users[1].tokens[1].token);
        }).end((err, res) => {
            if (err) {
                done(err);
            }
            User.findById(users[1]._id).then((user) => {
                expect(user.tokens.length).toBe(beforeTokenLength);
                done();
            }).catch((err) => done(err));    
            // done();            
        });
    });
});

describe('DELETE /users/me/token', () => {
    it('should remove auth token and log out', (done) => {
        var token = users[0].tokens[0].token;
        //DELETE request
        request(app)
            .delete('/users/me/token')
            //set x-auth = token
            .set('x-auth', token)
            //200
            .expect(200)
            // find user and verify tokens.length === 0
            /**
             * Alternative: 
             * .end((err, res)=>{
             *      if(err) done(err);
             *      User.findById(......
             * });
             * */
            .expect(()=>{
                User.findById(users[0]._id).then((user)=>{
                    if(!user){
                        Promise.reject();
                    }
                    expect(user.tokens.length).toBe(0);
                }).catch((err) => done(err));    
            }).end(done);

    });
});