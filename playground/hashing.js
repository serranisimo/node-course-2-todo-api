const {SHA256} = require('crypto-js');
const bcrypt = require('bcryptjs');

/**
 * Trying password hashing with bcryptjs
 */
var password = '123abc';
// bcrypt.genSalt(10);
bcrypt.genSalt(10, (err, salt) => {
    bcrypt.hash(password, salt, (err, hash) => {
        console.log("\n")
        console.log(hash);        
    });
});
var hashedPsw = '$2a$10$MIP0Qw3.rawa4NFgDPg5Oem4BAxWNt8c4WwFBn1fxPqqOa.cf.f/m';
bcrypt.compare(password, hashedPsw)
    .then((result) => console.log("hash truthful?",result))
    .catch((e) => console(e));
/**
 * ------------------------------------------------------------------------------
 * Trying standard hashing with SHA256
 * ------------------------------------------------------------------------------
 */
var message = "I am user number 3";
var hash = SHA256(message).toString();

console.log(`Message: ${message}`);
console.log(`Hash: ${hash}`);

var data = {
    id: 4
};

/**
 * salting a hash means adding something to a hash, that is unique and changes the value
 * e.g.: a text is always going to get the same hash. I can add some random chanracter combination
 * in order to change its value (this is salting). This way the hash does not only depend on the input 
 * data, which could be changed by a 'man in the middle'
 */
var token = {
    data,
    hash: SHA256(JSON.stringify(data) + "salty salt").toString()
};

/**
 * Man in the middle attack!!!
 */
// token.data = 5;

var resultHash = SHA256(JSON.stringify(token.data) + "salty salt").toString();

/**
 * This principle is what is knwon as the json web token
 * WE DON'T NEED TO IMPLEMENT THIS OURSELVES: THERE ARE LIBRARIES THAT MAKE ITS IMPLEMENTATION
 * VERY EASY
 */
if(resultHash === token.hash){
    console.log('data was not chaged');
}else{
    console.log('Data was changed!!!')
}
