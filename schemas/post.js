const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    postId: {
      type: String,
      required: true, 
    },
    userId : {
      type: mongoose.Schema.Types.ObjectId,
      required: true,
    },
    nickname : {
      type: String,
    },
    title: {
      type:String  
    },
    content: {
      type:String 
    },
    createdAt: {
      type:String,
    //   // type: Date,
    //   // required: true,
    //   // unique: true,
    //   // default: Date.now,
    },
    // {
    // // timestamp: true, // 시간자동생성(routes에 함수있음)
    // versionKey: false, // __v 없애기
    // }

  });

  // postSchema.set('timestamps', { createdAt: true, updatedAt: false});

  module.exports = mongoose.model("Posts", postSchema); // model

