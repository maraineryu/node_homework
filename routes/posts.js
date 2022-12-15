const express = require('express'); 
const router = express.Router();  
const Posts = require("../schemas/post");  

router.get("/posts", async (req, res) => { 
    const data = await Posts.find().sort({updatedAt: -1})

    const mapData = data.map((data) => {
        return {
            postId : data._id,
            writer : data.writerName,
            title : data.title,
            content : data.contents,
            createdAt : data.createdAt
        }
    })
    res.json({data: mapData}); 
});

//없는 아이디로 하면 {"mapPosts": []} 뜸///없는 게시물이라는 오류가 뜨게 하고싶다.
router.get("/posts/:_postId", async (req, res) => {
    const {_postId} = req.params;   
    const data = await Posts.find(); 

    const filteredPosts = data.filter((x) => {  
        return x["_id"].toString() === _postId;  
    });  
    const mapPosts = filteredPosts.map((data) => {
        return {  
            postId : data["_id"],
            writer : data.writerName,
            title : data.title,
            content : data.contents,
            createdAt : data.createdAt
        }  
    })
    res.json({mapPosts});
})

router.post("/posts", async (req, res) => {
    const {title, writerName, password, contents} = req.body;
    if (!title||!writerName||!password||!contents) {
        return res.status(400).json({success:false, errorMessage: "데이터형식이 올바르지 않습니다."})
    }
    const createdPosts = await Posts.create([{title, writerName, password, contents}]);
    if (contents === "") {
        return res.status(400).json({success: false, errorMessage: "내용을 입력해주세요."});
    }
    if (title === "") {
        return res.status(400).json({success: false, errorMessage: "제목을 입력해주세요."});
    }
    const mapData = createdPosts.map((data) => {
        return {
            postId : data._id,
            writer : data.writerName,
            title : data.title,
            content : data.contents,
            createdAt : data.createdAt
        }
    })
    res.json({posts: mapData});
})

router.put("/posts/:_postId", async (req, res) => {
    const {_postId} = req.params;
    const {password, contents, title} = req.body;

    if (!_postId||!password||!contents||!title) {
        return res.status(400).json({success:false, errorMessage: "데이터형식이 올바르지 않습니다."})
    }
    try{
        const existsPost = await Posts.findOne({_id: _postId});

        if (password === existsPost.password) {
            await Posts.updateOne({_id: _postId}, {$set: {contents, title}});
        } else {
            return res.status(400).json({success: false, errorMessage: "패스워드를 다시 입력해주세요."});
        }

        res.json({success: true});
    } catch (err) {
        return res.status(404).json({success: false, errorMessage: "게시글 조회에 실패하였습니다."});
    }
})

router.delete("/posts/:_postId", async (req, res) => {
    const {_postId} = req.params;
    const [existsPosts] = await Posts.find({_id: _postId});
    const {password} = req.body;

    if (existsPosts.length) {
        if (password === existsPosts.password) {
            await Posts.deleteOne({_id: _postId});
        } else {
            return res.status(400).json({success: false, errorMessage: "패스워드를 다시 입력해주세요."});
        }
    } else {
        return res.status(400).json({success: false, errorMessage: "게시글 조회에 실패하였습니다."});
    }

    res.json({result: "success"});
})


module.exports = router;