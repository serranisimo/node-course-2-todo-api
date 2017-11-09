const jwt = require('jsonwebtoken');

var data = {
    id : 10
};

var secret = '123abc';
var token = jwt.sign(data, secret,{expiresIn: 3600/3});
console.log(token);

console.log(jwt.verify(token, secret));
