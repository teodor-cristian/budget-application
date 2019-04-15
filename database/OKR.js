
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var bcrypt = require('bcryptjs');


// set up a mongoose model
var OKRSchema = new Schema({
  okr_name: {
        type: String,
        required: true
    },
    okr_description : {
        type: String
    },
    okr_price: {
        type: Number
    },
    okr_owner: {
        type: String
    },
    date : {
        type: Date, 
        default: Date.now 
    },
    okr_comments: [{ 
        body: String,
        date: {
            type: Date, 
            default: Date.now},
        user_name: String
    }]
});


const OKR = mongoose.model('okrs', OKRSchema);

module.exports = OKR;
