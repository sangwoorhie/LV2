const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const { v4: uuidv4 } = require("uuid");


// 1. 게시글 작성 POST API  /posts (완성)

router.post("/posts", async (req, res) => {
  const { title, user, password, content } = req.body;
  const createdAt = new Date().toLocaleString();
  const postId = uuidv4();
  if (!title.length || !user.length || !password.length || !content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else {
  await Post.create({ 
    postId : postId,
    title: title, 
    user :user, 
    content: content, 
    password: password, 
    date: createdAt });
  res.status(200).json({ comment: "게시글이 작성되었습니다." });
}});


// 2. 전체 게시글 목록 조회 GET API  (완성)

router.get("/posts", async (req, res) => {
  const allPosts = await Post.find({
      postId: postId,
      title: title, 
      user: user, 
      date: createdAt,
  }).sort({ date: -1 });
  
  const filteredPosts = allPosts.map( post => {
    const {password, ...rest} = post
    return rest;
  });

  res.json({"posts" : filteredPosts});
});



// 3. 단일 게시글 조회 GET API    /posts/:_postId
// - 제목, 작성자명, 작성 날짜, 작성 내용을 조회하기

router.get('/posts/:_postId', async (req, res) => {
  const postId = req.params._postId;
  const data = await Post.find({postId:postId}).catch(console.error);
  if(!data){
    res.status(400).json({message: "존재하지 않는 게시물입니다."})
  } else {
    res.json(data);
  };
});


// 4. 게시글 수정 PUT API /posts/:_postId - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 수정되게 하기

router.put("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const newPw = req.body.password;

  const data = await Post.find({postId:postId}).catch(console.error); 
  const existPw = data.password;

  if (!postId || !newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다."
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다."
    });    
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다."
    });
  } else if (existPw === newPw) {
    await Post.updateOne(
      { postId: goodsId }, 
      { $set: { content: content }}
      )};

  res.status(200).json({ 
    success: true,
    message: "게시글을 수정하였습니다." 
  });
});



// 5. 게시글 삭제 DELETE API  /posts/:_postId - API를 호출할 때 입력된 비밀번호를 비교하여 동일할 때만 글이 삭제되게 하기

router.delete("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const newPw = req.body.password;

  const data = await Post.find({postId:postId}).catch(console.error);
  const existPw = data.password

  if (!postId || !newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다."
    });
  } else if (existPw === newPw) {
    await Post.deleteOne({postId});
  };
  res.status(200).json({ 
    success: true,
    message: "게시글을 삭제하였습니다." 
  });
});

module.exports = router;

