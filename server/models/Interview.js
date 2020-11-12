const mongoose = require('mongoose');

const interviewSchema = mongoose.Schema({
    name:{
        type: String
    },
    email:{
        type: String
    },
    startTime:{
        type: Date
    },
    endTime:{
        type: Date
    }
});

module.exports = Interview = mongoose.model('Interview',interviewSchema);