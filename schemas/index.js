const mongoose = require("mongoose");
mongoose.set("strictQuery", false); 

const connect = () => { 
    mongoose 
        .connect("mongodb://127.0.0.1:27017/post", { 
        // .set("strictQuery", true)     
        // useNewUrlParser: true,
        // useUnifiedTopology: true,
        })
        .then(() => console.log("MongoDB 연결 완료"))
        .catch(err => console.log(err));
        };

mongoose.connection.on("error", err => {
    console.error("MongoDB 연결 에러", err);
});


module.exports = connect; 
