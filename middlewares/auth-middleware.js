// 사용자 인증 미들웨어 : 실제 로그인한 사용자를 구분하도록 함.

const jwt = require("jsonwebtoken");
const User = require("../schemas/user.js")

module.exports = async (req, res, next) => {
    const {Authorization} = req.cookies;
    // console.log(Authorization);

    // Authorization이 나오는 형태는 다음과 같음. => Bearer (띄어쓰기) jwt토큰 (header.payload.signature)
    // 쿠키가 없다면 Authorization은 undefined 상태, 이 상태에서는 null 병합 연산자로 빈 문자열을 줘서 에러나지 않도록 함
    // Authorization이 null 또는 undefined인 경우에는 에러나지 않기 위해 빈 문자열 ""을 반환하고, 그렇지 않은 경우에는 Authorization 값을 반환
    // 그 뒤에 split함수를 쓰고 " "하는 이유는 Bearer와 jwt토큰을 구분하기 위함. 따라서 따옴표 안에 띄어쓰기를 해야 함
    // .split(" ") => 띄어쓰기를 기준으로 나눔 .split("") => 모든 문자열마다 나눔


    // 1.authType === Bearer인지 확인
    // 2.autoToken 검증

    // authType에는 Authorization이, authToken에는 jwt토큰이 담긴다. 
    // Authorization: 'Bearer (한칸 띄어쓰기) eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODczNDIwMzMsImV4cCI6MTY4NzM0NTYzM30.MpU53n7r3NaIBfVirdFHDUi1RW6Up0-KkEl46IyunME'
    
    const [authType, authToken] = (Authorization ?? "").split(" ")  // null병합 연산자 + split함수

    // console.log("authType =>", authType); // Bearer
    // console.log("authToken=>", authToken); // eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpYXQiOjE2ODczNDIwMzMsImV4cCI6MTY4NzM0NTYzM30.MpU53n7r3NaIBfVirdFHDUi1RW6Up0-KkEl46IyunME

    if(authType !== "Bearer" || !authToken){
        res.status(400).json({
            errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
        })
        return;
    }

    // 1.authToken이 만료되었는지 확인
    // 2.autoToken이 서버가 발급한 토큰이 맞는지 확인 
    // 3.authToken에 있는 userId에 해당하는 사용자가 실제 DB에 존재하는지 확인
   
    // 서버가 멈추지 말아야 하므로 try catch문 사용
    // auth.js에서 생성한 JWT정보를 가져옴

    // authToken는 jwt토큰 객체, 거기서 userId만 가져와야함. 그래서 점 찍음. findById(userId.userId)

    try{
        let userId = jwt.verify(authToken, "customized-secret-key"); // userId를 재할당한다. (인증값 성공시) 토큰을 해석한 유저 아이디(복호화)
        const user = await User.findById(userId.userId)  // userId는 User에 저장되는게 아니라 MongoDB에 저장돼있음 (_id) 로그인한 유저의 아이디
        res.locals.user = user; // findById : 해당 아이디의 모든 값을 가져온다
        
        if(!user || !userId){
            res.status(400).json({
                errorMessage: "로그인 후에 이용할 수 있는 기능입니다."
            })
            return;
        };


        next(); 
        
        // 게시글작성시, 어떤 사용자가 작성하는지 확인하기 위해서는 사용자인증 미들웨어에서 해당사용자가 특정이 되면 특정된 사용자를 바탕으로 게시글작성함
        // 다음에 있는 게시글작성이라는 API를 호출할때 어떤사용자가 호출했는지 알기위해서 사용자인증 미들웨어에서 es.locals.user에 유저 데이터를 할당한다

        // 사용자 인증 미들웨어에서 로그인한 사용자정보를 갖고와서 사용자가 맞는지 검증했고 JWT인증도 했을떄
        // 미들웨어 다음으로 넘기기 위해서, locals안에 유저정보 전달
        // res.locals.user에 현재 접속한 사용자에 대한 mongoDB정보를 할당해주기 때문에, res.locals.user를 바탕으로 내 정보조회 API 만들수 있다.

    } 
    catch(error){
        console.error(error); 
        res.status(400).json({errorMessage: "로그인 후 이용할 수 있는 기능입니다."})
        return;
    }
};






// cookie

// npm init -y
// npm install express
// npm install cookie-parser

// JWT
// npm init -y
// npm install jsonwebtoken
// npm install mongoose