//포스트 모델 작성. 데이터 관리하기 위해 모듈을 작성.
const mongoose = require("mongoose");
const postsSchema = new mongoose.Schema({
        title: {
            type: String,
            required: true,
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

module.exports = mongoose.model("Posts", postsSchema);