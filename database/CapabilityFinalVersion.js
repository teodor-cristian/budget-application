
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model
var CapabilityFinalVersionSchema = new Schema({
    adminId: String,
    name: {
        type: String,
        required: true
    },
    budget: {
        type: Number
    },
    list_of_expenses: [{
        name: String,
        description: String,
        sum: Number,
        category_id: String,
        date: {
            type: Date, 
            default: Date.now}
    }],
    categories: [{ 
        name: String,
        description: String,
        budget: Number,
        date: {
            type: Date, 
            default: Date.now},
        requests:[{
            body: String,
            hashtags: [String],
            authorName: String,
            date: {
                type: Date, 
                default: Date.now},
            comments: [{
                        name: String,
                        body: String,
                        managerResponse:{
                            name: String,
                            body: String,
                            grantPermission: Boolean,
                            postponed: Boolean,
                            date: {
                                type: Date}
                        },
                        messageRead: {
                            type: Boolean, 
                            default: false
                        },
                        date: {
                            type: Date, 
                            default: Date.now}
                    }]
    }]
    }],
    date : {
        type: Date, 
        default: Date.now 
    }
});


const CapabilityFinalVersion = mongoose.model('capabilities', CapabilityFinalVersionSchema);

module.exports = CapabilityFinalVersion;
