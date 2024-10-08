const mongoose = require("mongoose");
const Schema = mongoose.Schema

const EmployeeGroupsSchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
    },
    members: [{
        type: ObjectId,
        ref: 'User',
    }],
});

const EmployeeGroup = mongoose.model("EmployeeGroup", EmployeeGroupsSchema);

module.exports = EmployeeGroup;
