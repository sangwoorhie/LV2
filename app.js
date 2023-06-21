const cookieParser = require('cookie-parser');
const express = require('express');
const app = express();
const port = 3000;

const commentsRouter = require('./routes/comments.js')  // ★★ require ('./폴더명')
const postsRouter = require('./routes/posts.js')   // ★★ require ('./폴더명')
const authRouter = require('./routes/auth.js')   // ★★ require ('./폴더명')
const usersRouter = require('./routes/users.js')   // ★★ require ('./폴더명')

const connect = require('./schemas');   // ★★ require ('./폴더명')
connect(); 

app.use(express.json()); // 전역 미들웨어 body-parser
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static("assets"));

// localhost:3000
app.use("/api", [postsRouter, commentsRouter, authRouter, usersRouter]); 

app.get('/', (req, res) => {
    res.send('Hello World!');
});

app.listen(port, () => {
    console.log(port, "포트로 서버가 열렸어요!");
});

// ★★ require ('./폴더명')
// ★★ 폴더를 require하면, models 폴더 안의 index.js 파일에서 module.exports하는 객체를 가져오게 된다.
