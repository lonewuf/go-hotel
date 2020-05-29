var mongoose = require('mongoose');


var hotelSchema = mongoose.Schema({
    name: String,
    detail: String,
    description: String,
    image: String,
    author: {
       id: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'User'
       },
       username: String
    },
    comments: [
        {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Comment'
        }
    ]
});

module.exports = mongoose.model('Hotel', hotelSchema);