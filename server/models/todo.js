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
    },
    _creator: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
});
var Todo = mongoose.model('Todo', todoSchema);

module.exports = {Todo};