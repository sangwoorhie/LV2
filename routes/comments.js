const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
const { v4: uuidv4 } = require("uuid"); // comments에 자동생성되는 commentId


// 6. 댓글 목록 조회 GET   (성공)
router.get("/comments/:_postId", async (req, res) => {
  const postId = req.params._postId;
  const comments = await Comment.find({'postId': postId}, {password: 0}, {_id: 0}).catch(console.error);  
  
  return res.json({"comments" : comments})
});



// 7. 댓글 작성 POST   (성공)
router.post("/comments/:postId", async (req, res) => {
  const postId = req.params.postId;
  const { user, password, content } = req.body;

  const createdAt = new Date().toLocaleString();
  const commentId = uuidv4();

  if (!postId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다."
    });
  } else if (!user) {
    return res.status(400).json({
      success: false,
      errorMessage: "유저명을 입력해주세요."
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
    postId : postId,        //create에 위에서 변수선언한 postId를 넣음으로써 postId를 해당 댓글에 생성한다
    commentId : commentId,
    user :user, 
    password: password,
    content: content,  
    date: createdAt });

    return res.status(200).json({ 
    success: true,
    comment: "댓글을 생성하였습니다." 
  });
}});



// 8. 댓글 수정 PUT  (성공)
router.put("/posts/:postId/comments/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const newPw = req.body.password;
  const content = req.body.content;

  const data = await Comment.find({commentId:commentId}).catch(console.error); 
  const existPw = data[0].password 

  if (!commentId || !postId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다."
    });
  } else if (!newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요."
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
      { commentId: commentId }, 
      { $set: { content: content } }
      );
  };
    return res.status(200).json({ 
    success: true,
    message: "댓글을 수정하였습니다." 
  });
});



// 9. 댓글 삭제 DELETE  (성공)
router.delete("/posts/:postId/comments/:commentId", async (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const newPw = req.body.password;
 
  const data = await Comment.find({commentId: commentId}).catch(console.error);
  const existPw = data[0].password 

  if (!commentId || !postId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!newPw.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "비밀번호를 입력해주세요."
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
    return res.status(200).json({ 
    success: true,
    message: "댓글을 삭제하였습니다." 
  });
});

module.exports = router;
