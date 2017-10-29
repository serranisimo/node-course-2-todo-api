const mongoose = require('mongoose');

var Schema = mongoose.Schema;
//mongoose cast types
var todoSchema = new Schema({
    text: {
        type: String,
        required: true,
        minlength: 5,
        trim: true
    },
    completed: {
        type: Boolean,
        default: false
    }
    , completedAt: {
        type: Number,
        default: null
    }
});
var TodoModel = mongoose.model('Todo', todoSchema);

module.exports = {TodoModel};