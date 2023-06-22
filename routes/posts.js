const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const User = require("../schemas/user.js");
const authMiddleware = require("../middlewares/auth-middleware.js")
const { v4: uuidv4 } = require("uuid"); // posts에 자동생성되는 postsId



// 1. 게시글 작성 API  (POST : localhost:3000/api/posts) (성공)
router.post("/posts", authMiddleware, async (req, res) => {
  console.log('-'.repeat(40));
  console.log("res.local.user =>", res.locals.user);
  console.log('-'.repeat(40));

  const { title, content } = req.body;
  const { userId, nickname } = res.locals.user; 
  const createdAt = new Date().toLocaleString();
  const postId = uuidv4();

   if (!title.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "제목을 입력해주세요.",
    });
  } else if (!authMiddleware || !res.locals.user) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 내용을 입력해주세요.", 
    });
  } else {
    await Post.create({
      postId: postId, // 여기서 모든 key값들은 db컬럼(Studio 3T와 일치해야 한다)
      userId: userId,
      nickname: nickname, 
      title: title,
      content: content,
      createdAt: createdAt 
    });
    return res.status(201).json({ 
      success: true,
      message: "게시글이 작성되었습니다.", 
    });
  }
});



// 2. 전체 게시글 목록 조회 API (GET : localhost:3000/api/posts) (성공)
router.get("/posts", async (req, res) => {
  const allPosts = await Post.find()
    .select({ //1 = true, 0 = false
      postId: 1,
      userId: 1,
      nickname: 1,
      title: 1,  
      createdAt: 1,
      _id: 0,
    })
    .sort({ createdAt: -1 })
    .exec();
    return res.status(200).json({ allPosts }); //
});


// 3. 단일 게시글 조회 API (GET : localhost:3000/api/posts/:postId) (성공)
router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const data = await Post.findOne(
    {postId: postId}, 
    { //1 = true, 0 = false
      nickname: 1,
      postId: 0,
      password: 0,
      _id: 0,
      __v: 0
    })
   .catch(console.error);
  if (!data) {
  return res.status(400).json({
     success: false,
     errorMessage: "존재하지 않는 게시물입니다." 
    });
  }
  return res.status(200).json({ singlePost: data });
  });



// 4. 게시글 수정 API (PUT : localhost:3000/api/posts/:postId) (성공)
router.put("/posts/:postId", authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const {title, content} = req.body;
  const { userId } = res.locals.user; 

  const data = await Post.find({ userId, postId }).catch(console.error);

  if (!postId || !userId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  } else if (!content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 내용을 입력해주세요.",
    });    
  } else if (!title.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "제목을 입력해주세요.",
    });    
  } else {
    await Post.updateOne(
      { userId, postId: postId }, 
      { $set: { title: title, content: content} }
      )
  };
    return res.status(200).json({
      success: true,
      message: "게시글을 수정하였습니다.",
  });
});



// 5. 게시글 삭제 API (DELETE : localhost:3000/api/posts/:postId) (성공)
router.delete("/posts/:postId", authMiddleware, async (req, res) => {
  const postId = req.params.postId;
  const { userId } = res.locals.user;

  const data = await Post.find({ userId, postId }).catch(console.error);

  if (!postId || !userId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  } else {
    await Post.deleteOne({ userId, postId });
  }
    return res.status(200).json({
      success: true,
      message: "게시글을 삭제하였습니다.",
  });
});

module.exports = router;
