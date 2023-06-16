const express = require("express");
const router = express.Router();
const Post = require("../schemas/post.js");
const { v4: uuidv4 } = require("uuid");


// 1. 게시글 작성 POST API  /posts (완성)
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
      errorMessage: "내용을 입력해주세요.",
    });
  } else {
    await Post.create({
      postId: postId,
      title: title,
      user: user,
      content: content,
      password: password,
      date: createdAt,
    });
    res.status(200).json({ comment: "게시글이 작성되었습니다." });
  }
});


// 2. 전체 게시글 목록 조회 GET API  (성공)
router.get("/posts", async (req, res) => {
  const allPosts = await Post.find()
    .select({
      //1 = true, 0 = false
      postId: 1,
      user: 1,
      title: 1,
      content: 1,
      createdAt: 1,
      _id: 0,
    })
    .sort({ date: -1 })
    .exec();
  res.json({ allPosts: allPosts });
});
// const filteredPosts = allPosts.map( post => {
//   const {password, ...rest} = post     // ...rest가 스키마정보 틀까지 다 가져옴. 이렇게쓰면 X
//   return rest;
// });


// 3. 단일 게시글 조회 GET API (성공)
router.get("/posts/:postId", async (req, res) => {
  const postId = req.params.postId;
  const data = await Post.findOne({postId: postId}, {password: 0}, {_id: 0}).catch(
  console.error
  );
  if (!data) {
  return res.status(400).json({ message: "존재하지 않는 게시물입니다." });
  }
  res.json({ singlePost: data });
  });


// 4. 게시글 수정 PUT API (성공)
router.put("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const newPw = req.body.password;
  const content = req.body.content;

  const data = await Post.find({ postId: postId }).catch(console.error);
  const existPw = data[0].password;
  console.log(data);
  console.log(existPw);
  console.log(newPw);

  if (!postId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  } else if (existPw === newPw) {
    await Post.updateOne({ postId: postId }, { $set: { content: content } });
  }

  res.status(200).json({
    success: true,
    message: "게시글을 수정하였습니다.",
  });
});


// 5. 게시글 삭제 DELETE API  (성공)
router.delete("/posts/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const newPw = req.body.password;

  const data = await Post.find({ postId: postId }).catch(console.error);
  const existPw = data[0].password;
  console.log(data);
  console.log(existPw);
  console.log(newPw);

  if (!postId || !newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "게시글 조회에 실패하였습니다.",
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다.",
    });
  } else if (existPw === newPw) {
    await Post.deleteOne({ postId });
  }
  res.status(200).json({
    success: true,
    message: "게시글을 삭제하였습니다.",
  });
});

module.exports = router;
