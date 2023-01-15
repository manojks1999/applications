const mongoose = require('mongoose');
const { Schema, Types } = mongoose;

const jobApplication = new Schema({
    applicationId: Types.ObjectId,
    name: String,
    email: String,
    filePath: String,
    jobId: Types.ObjectId,
});

module.exports = mongoose.model('jobApplication', jobApplication);