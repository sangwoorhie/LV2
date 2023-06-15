const mongoose = require("mongoose");

const postSchema = new mongoose.Schema({

  postId: {
    type: String,
    required: true, 
  },
  user: {
    type: String
  },
  title: {
    type:String  
  },
  password: {
    type:String    
  },
  content: {
    type:String 
  },
  createdAt: {
    type:String
  //   // type: Date,
  //   // required: true,
  //   // unique: true,
  //   // default: Date.now,
  },
// {
//   timestamp: true,
// }

});

module.exports = mongoose.model("Posts", postSchema); // model
