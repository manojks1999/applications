const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const jobList = new Schema({
    jobId: Types.ObjectId,
    title: String,
    description: String,
    email: String,
    skills: [{
        type: String
    }],
    experience: String,
    createdBy: String
});

module.exports = mongoose.model('jobList', jobList);