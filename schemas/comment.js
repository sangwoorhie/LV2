const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({ 
    postId: {
      type: String,
      required: true, 
   },
    commentId: {
      type: String,
      required: true, 
    },
    user: {
      type: String
    },
    password: {
      type:String 
    },
    content: {
      type:String 
    },
    createdAt: {
      type:String
      // type: Date,
      // required: true,
      // unique: true,
      // default: Date.now,
    }},
    // {
    //   timestamp: true,
    //   }
);

module.exports = mongoose.model("Comments", commentSchema);  //model에 담으면 양식이 정해짐(스키마로 이뤄진 양식)
