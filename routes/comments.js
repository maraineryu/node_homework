const express = require('express');
const router = express.Router();
const Comments = require("../schemas/comment");

//댓글이 없을 때 처리방식
router.get("/comments/:_postId", async (req, res) => {
    const {_postId} = req.params;
    const existsPosts = await Comments.find({_postId: _postId}).sort({createdAt: -1});
    const mapComments = existsPosts.map((x) => {
        return {
            commetId: x._id,
            writer: x.writerName,
            contents: x.contents,
            createdAt : x.createdAt,
            updatedAt : x.updatedAt
        }
    })
    res.json({mapComments});
});


router.post("/comments/:_postId", async (req, res) => {
    const {_postId} = req.params;
    const {writerName, password, contents} = req.body;
    if (!writerName||!password||!contents) {
        return res.status(400).json({success:false, errorMessage: "데이터형식이 올바르지 않습니다."})
    }
    if (contents === "") {
        return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
    } else {
        const createdComments = await Comments.create({_postId, writerName, password, contents});
        res.json({comments: createdComments});
    }
})

router.put("/comments/:commentId", async (req, res) => {
    const {commentId} = req.params;
    const {password, contents} = req.body;
    if (!password||!contents) {
        return res.status(400).json({success:false, errorMessage: "데이터형식이 올바르지 않습니다."})
    }
    try{
        const existsComments = await Comments.findOne({_id: commentId});
       
        if (password === existsComments.password) {
            if (contents === "") {
                return res.status(400).json({success: false, errorMessage: "댓글 내용을 입력해주세요."});
            } else {
                await Comments.updateOne({_id: commentId}, {$set: {contents}});
                return res.status(200).send({result: "수정완료"})
            }
        } else {
        return res.status(400).json({success: false, errorMessage: "패스워드를 다시 입력해주세요."});
        }
    } catch (err) {
        return res.status(404).json({success: false, errorMessage: "게시글 조회에 실패하였습니다."});
    }
 
    })


router.delete("/comments/:commentId", async (req, res) => {
    const {commentId} = req.params;
    const {password} = req.body;
    const existsComments = await Comments.findOne({_id: commentId});
    if (password === existsComments.password) {
        await Comments.deleteOne({_id: commentId});
    } else {
        return res.status(400).json({success: false, errorMessage: "패스워드를 다시 입력해주세요."});
    }
    res.json({result: "success"});
})

module.exports = router;