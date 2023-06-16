const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const { v4: uuidv4 } = require("uuid"); // posts에 자동생성되는 postsId



// 1. 게시글 작성 POST API  (성공)
router.post("/posts", async (req, res) => {
  const { title, user, password, content } = req.body;
  const createdAt = new Date().toLocaleString();
  const postId = uuidv4();

  if (!title.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "제목을 입력해주세요.",
    });
  } else if (!user.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "유저명을 입력해주세요.",
    });
  } else if (!password.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요.",
    });
  } else if (!content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 내용을 입력해주세요.",
    });
  } else {
    await Post.create({
      postId: postId, // 여기서 모든 key값들은 db컬럼(Studio 3T와 일치해야 한다)
      title: title,
      user: user,
      content: content,
      password: password,
      createdAt: createdAt 
    });
    return res.status(201).json({ 
      success: true,
      message: "게시글이 작성되었습니다." 
    });
  }
});



// 2. 전체 게시글 목록 조회 GET API  (성공)
router.get("/posts", async (req, res) => {
  const allPosts = await Post.find()
    .select({ //1 = true, 0 = false
      postId: 1,
      user: 1,
      title: 1,
      content: 1,
      createdAt: 1,
      password: 0,
      _id: 0,
      __v: 0
    })
    .sort({ createdAt: -1 })
    .exec();
    return res.status(200).json({ allPosts: allPosts });
});
// const filteredPosts = allPosts.map( post => {
//   const {password, ...rest} = post     // ...rest가 스키마정보 틀까지 다 가져옴. 이렇게쓰면 X
//   return rest;
// });



// 3. 단일 게시글 조회 GET API (성공)
router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const data = await Post.findOne(
    {postId: postId}, 
    { //1 = true, 0 = false
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



// 4. 게시글 수정 PUT API (성공)
router.put("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const newPw = req.body.password;
  const content = req.body.content;

  const data = await Post.find({ postId: postId }).catch(console.error);
  const existPw = data[0].password; // find함수로 찾은 data는 배열형식이므로 0번째 인덱스의 password를 가져와야함
  // console.log(data); 
  // console.log(existPw);
  // console.log(newPw);

  if (!postId) {
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
  } else if (!newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요.",
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });    
  } else if (existPw === newPw) {
    await Post.updateOne(
      { postId: postId }, 
      { $set: { content: content } }
      )
  };
    return res.status(200).json({
      success: true,
      message: "게시글을 수정하였습니다.",
  });
});



// 5. 게시글 삭제 DELETE API  (성공)
router.delete("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const newPw = req.body.password;

  const data = await Post.find({ postId: postId }).catch(console.error);
  const existPw = data[0].password; // find함수로 찾은 data는 배열형식이므로 0번째 인덱스의 password를 가져와야함
  // console.log(data);
  // console.log(existPw);
  // console.log(newPw);

  if (!postId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  } else if (!newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요.",
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  } else if (existPw === newPw) {
    await Post.deleteOne({ postId });
  }
    return res.status(200).json({
      success: true,
      message: "게시글을 삭제하였습니다.",
  });
});

module.exports = router;
