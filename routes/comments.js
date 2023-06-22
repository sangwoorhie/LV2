const express = require("express");
const router = express.Router();
const Comment = require("../schemas/comment.js");
const Post = require("../schemas/post.js");
const User = require("../schemas/user.js")
const authMiddleware = require("../middlewares/auth-middleware.js")
const { v4: uuidv4 } = require("uuid"); 


// 6. 댓글 목록 조회 API (GET : localhost:3000/api/comments/:postId) (성공)
router.get("/comments/:postId", async (req, res) => {
  const { postId } = req.params;
  const comments = await Comment.find(
    {'postId': postId}, 
    { //1 = true, 0 = false
      nickname: 1,
      userId: 1,
      postId: 0,
      password: 0,
      _id: 0,
      __v: 0
    })
    .sort({createdAt: -1})
    .catch(console.error); 

    if (!postId) {
      return res.status(400).json({
        success: false,
        errorMessage: "데이터 형식이 올바르지 않습니다."
      })
    } else {
       return res.status(200).json({
        "comments" : comments}
        )}
    });



// 7. 댓글 작성 API (POST : localhost:3000/api/comments/:postId) (성공)
router.post("/comments/:postId", authMiddleware, async (req, res) => { 
  const postId = req.params.postId;
  const {content} = req.body;
  const {userId, nickname} = res.locals.user;

  console.log('-'.repeat(40));
  console.log("res.local.user =>", res.locals.user);
  console.log('-'.repeat(40));
 
  const createdAt = new Date().toLocaleString();
  const commentId = uuidv4();

  if (!postId || !userId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다."
    });
  } else if (!content.length) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 내용을 입력해주세요."
    });
  } else {
      await Comment.create({ 
      postId : postId,
      userId: userId,        //create에 위에서 변수선언한 postId를 넣음으로써 postId를 해당 댓글에 생성한다
      commentId : commentId,  // 여기서 모든 key값들은 db컬럼(Studio 3T와 일치해야 한다)
      nickname : nickname,
      content: content,  
      createdAt: createdAt,
    }); 

    return res.status(201).json({ 
      success: true,
      message: "댓글이 작성되었습니다." 
  });
}});



// 8. 댓글 수정 API (PUT : localhost:3000/api/posts/:postId/comments/:commentId) (성공)
router.put("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => { 
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const { content } = req.body;
  const {userId} = res.locals.user;

  const data = await Comment.find({userId, commentId}).catch(console.error); 
 
  if (!commentId || !postId || !userId) {
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
  } else {
    await Post.updateOne(
      { userId, commentId: commentId }, 
      { $set: { content: content } }
      );
  };
    return res.status(200).json({ 
      success: true,
      message: "댓글을 수정하였습니다." 
  });
});



// 9. 댓글 삭제 API (DELETE : localhost:3000/api/posts/:postId/comments/:commentId) (성공)
router.delete("/posts/:postId/comments/:commentId", authMiddleware, async (req, res) => {
  const commentId = req.params.commentId;
  const postId = req.params.postId;
  const {userId} = res.locals.user;
 
  const data = await Comment.find({userId, commentId}).catch(console.error);

  if (!commentId || !postId || !userId) {
    return res.status(400).json({
      success: false,
      errorMessage: "데이터 형식이 올바르지 않습니다.",
    });
  } else if (!data) {
    return res.status(400).json({
      success: false,
      errorMessage: "댓글 조회에 실패하였습니다.",
    });
  } else {
    await Post.deleteOne({ userId, commentId });
  };
    return res.status(200).json({ 
      success: true,
      message: "댓글을 삭제하였습니다." 
  });
});

module.exports = router;
