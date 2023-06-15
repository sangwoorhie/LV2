const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
const { v4: uuidv4 } = require("uuid");

// 6. 댓글 목록 조회 GET   (성공)

router.get("/comments/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const comments = await Comment.find({'postId': postId}).catch(console.error);  
  
  const filteredComment = comments.map( post => {
  const {password, ...rest} = post
  return rest;
})

res.json({"comments" : filteredComment})
});

// 7. 댓글 작성 POST   /comments/:_postId (틀 완성, postId 코딩에 넣고 실행해야함)

router.post("/comments/:postId", async (req, res) => {
  const postId = req.params._postId;
  const { user, password, content } = req.body;
  // var comments = await Comment.find({'postId': postId}).catch(console.error);  
  // var comments = postId
  // 해당게시물과 일치하는 postId를 가진 코멘트스키마의 게시물id

  const createdAt = new Date().toLocaleString();
  const commentId = uuidv4();

  if (!user || !postId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다."
    });
  } else if (!password.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요."
    });
  } else if (!content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 내용을 입력해주세요."
    });
  } else {
  await Comment.create({ 
    commentId : commentId,
    user :user, 
    password: password,
    content: content,  
    date: createdAt });

  res.status(200).json({ 
    success: true,
    comment: "댓글을 생성하였습니다." 
  });
}});


// 8. 댓글 수정 PUT   /comments/:_commentId (틀 완성, postId 코딩에 넣고 실행해야함)

router.put("/comments/:commentId", async (req, res) => {
  const commentId = req.params._commentId;
  const newPw = req.body.password;
  const content = req.body.content;
   const postId = await Comment.find({'postId': postId}) // 해당게시물과 일치하는 id를 가진 코멘트스키마의 게시물id

  const data = await Comment.find({commentId:commentId}).catch(console.error); 
  const existPw = data.password 

  if (!commentId || !newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다."
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 조회에 실패하였습니다."
    });
  } else if (!content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 내용을 입력해주세요."
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다."
    });
  } else if (existPw === newPw) {
    await Post.updateOne(
      { postId: goodsId }, 
      { $set: { content: content } }
      );
  };
  res.status(200).json({ 
    success: true,
    message: "게시글을 수정하였습니다." 
  });
});


// 9. 댓글 삭제 DELETE   /comments/:_commentId (틀 완성, postId 코딩에 넣고 실행해야함)

router.delete("/comments/:commentId", async (req, res) => {
  const commentId = req.params._commentId;
  const newPw = req.body.password;
  const postId = await Comment.find({'postId': postId}) // 해당게시물과 일치하는 id를 가진 코멘트스키마의 게시물id

  const data = await Comment.find({commentId: commentId}).catch(console.error);
  const existPw = data.password

  if (!commentId || !newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 조회에 실패하였습니다.",
    });
  } else if (existPw !== newPw) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호가 일치하지 않습니다."
    });
  } else if (existPw === newPw) {
    await Post.deleteOne({commentId});
  };
  res.status(200).json({ 
    success: true,
    message: "댓글을 삭제하였습니다." 
  });
});

module.exports = router;
