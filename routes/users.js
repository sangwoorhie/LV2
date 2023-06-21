const express = require("express");
const router = express.Router();
const User = require("../schemas/user.js");
const authMiddleware = require("../middlewares/auth-middleware.js")
const cookieParser = require('cookie-parser');
router.use(cookieParser());




// ID PW 정규식
const nicknameCheck =  /^[a-zA-Z0-9]{3,}$/;
const passwordCheck = /^(?=.*[a-zA-Z])(?=.*\d)[a-zA-Z\d]{4,}$/;


// 1. 회원 가입 POST : localhost:3000/api/signup (성공)
// {
//     "nickname" : "NickName123", 
//     "password" : "password123", 
//     "confirmPassword" : "password123"
//     }

router.post('/signup', async(req, res) => {
    const { nickname, password, confirmPassword } = req.body;
    
    try {const existNickname = await User.findOne(nickname).nickname

    if (!nicknameCheck.test(nickname)) {
        res.status(412).json({
            "errorMessage": "닉네임의 형식이 일치하지 않습니다. 닉네임은 최소 3자 이상이어야 하며, 알파벳 대소문자 및 숫자로 작성되어야 합니다.",
        });
    } else if (password !== confirmPassword){
        res.status(412).json({
            "errorMessage": "패스워드와 확인 패스워드가 일치하지 않습니다.",
        });
    } else if (!passwordCheck.test(password) || password.includes(nickname)) {
        res.status(412).json({
            "errorMessage": "패스워드 형식이 일치하지 않습니다. 패스워드는 최소 4자 이상이어야 하며, 패스워드에 닉네임이 포함되어 있어서는 안 됩니다.",
        });
    } else if (nickname === existNickname){
        res.status(412).json({
            "errorMessage": "중복된 닉네임이 이미 존재합니다.",
        });
    } else if (nicknameCheck.test(nickname) && 
                passwordCheck.test(password) && 
                existNickname !== nickname && 
                password === confirmPassword)
        {
        const user = new User({ nickname, password });
        await user.save();
        return res.status(200).json({
            success: true,
            "message": "회원 가입에 성공하였습니다.",
        });
    }}
    catch (error) {
        res.status(400).json({
            success: false,
            "errorMessage": "요청한 데이터 형식이 올바르지 않습니다.",
        })
    }
});




module.exports = router;



// // 닉네임, 비밀번호 정규식 (joi)
// // npm install joi
// const signUpSchema = function (inputNickname){
//     return Joi.object({
//         nickname: Joi.string()
//         .min(3) //최소3자
//         .max(30) //최대30자
//         .pattern(new RegExp(`[a-z|A-Z|0-9]$`)) //대소문자,숫자
//         .required(),

//         password: Joi.string()
//         .min(4)
//         .pattern(new RegExp("^((?!" + inputNickname + ").)*$"))
//         .required(),

//         confirm: Joi.string().valid(Joi.ref('password')).required(),
//     })
// }