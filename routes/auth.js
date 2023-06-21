const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js")
const jwt = require("jsonwebtoken")


// 2. 로그인 POST : localhost:3000/api/login
router.post('/login', async (req, res) => {   
    const {nickname, password} = req.body;
    const userdata = await User.findOne({ nickname, password });

    if (!userdata){
        res.status(400).json({
            "errorMessage": "일치하는 회원정보가 없습니다."
        })
    } else if (nickname !== userdata.nickname || password !== userdata.password) {
        res.status(400).json({
            "errorMessage": "닉네임 또는 패스워드를 확인해주세요."
        });
        return;
    }
    const expirationTime = 60 * 60;

    const token = jwt.sign({userId: userdata._Id}, "customized-secret-key", { expiresIn: expirationTime }) // jwt 생성
    res.cookie("Authorization", `Bearer ${token}`, {maxAge : expirationTime * 1000}); // // 토큰을 쿠키로 할당
    res.status(200).json({
        "message": "정상적으로 로그인 되었습니다.",
        token
    });
})




module.exports = router;





    // if(data.length!=0){ // 유저의 데이터길이가 0이아니라면, 즉 있다면 토큰발급
    //     //token
    //     const accessToken = await jwt.sign({
    //         id:data[0]._id.toHexString(), // String타입으로 data의 0번째 인덱스에 아이디생성
    //         nickname: nickname,
    //         password: password,
    //         Key, {expiresIn: '1h'}
    //     });
    //         res.cookie('accessToken', accessToken, {httpOnly:true});
    //         res.status(200).json({
    //             success:true,
    //             "message":"정상적으로 로그인 되었습니다."
    //         })
            
    // }