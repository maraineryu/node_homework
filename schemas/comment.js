const mongoose = require("mongoose");

const commentsSchema = new mongoose.Schema({
        _postId: {
            type: String
        },
        writerName: {
            type: String,
            required: true,
        },
        password: {
            type: String,
            required: true,
        },
        contents: {
            type: String,
            required: true,
        },
    },
    {
        timestamps: true
    });

module.exports = mongoose.model("Comments", commentsSchema);