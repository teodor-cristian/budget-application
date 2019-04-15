
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


// set up a mongoose model
var CapabilitySchema = new Schema({
    adminId: String,
    name: {
        type: String,
        required: true
    },
    budget: {
        type: Number
    },
    categories: [{ 
        name: String,
        description: String,
        budget: Number,
        date: {
            type: Date, 
            default: Date.now},
        list_of_expenses: [{
            name: String,
            description: String,
            sum: Number,
            authorName: String,
            date: {
                type: Date, 
                default: Date.now}
            }],
        requests:[{
                body: String,
                hashtags: [String],
                authorName: String,
                date: {
                    type: Date, 
                    default: Date.now},
                managerResponse:{
                        type:{name: String,
                            body: String,
                            grantPermission: Boolean,
                            postponed: Boolean,
                            postponed_date: {
                                type: Date},
                            date: {
                                type: Date}},
                        
                        default: null
                    },
                requestRead: {
                        type: Boolean, 
                        default: false
                    },
                comments: [{
                            name: String,
                            body: String,
                            managerResponse:{
                                name: String,
                                body: String,
                                grantPermission: Boolean,
                                postponed: Boolean,
                                postponed_date: {
                                    type: Date},
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


const Capability = mongoose.model('capabilities', CapabilitySchema);

module.exports = Capability;
