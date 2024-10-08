const mongoose = require("mongoose");
const Schema = mongoose.Schema

const TaskSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String },
    senderName: { type: String, required: true },
    intendedFor: [{ type: Schema.Types.ObjectId, required: true, ref: 'User' }],
    createdAt: { type: Date, required: true, default: Date.now },
    completedAt: { type: Date },
    deadline: { type: Date, required: true },
    isCompleted: { type: Boolean, default: false },
    priority: { type: String, enum: ['low', 'medium', 'high'], default: 'low' }
});

const Task = mongoose.model("Task", TaskSchema);

module.exports = Task;