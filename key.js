// const jwt = require("jsonwebtoken");
// const cookieParser = require("cookie-parser");
// const express = require("express");
// const app = express();
// const port = 3002;
// const SECRET_KEY = `HangHae99`;

// app.use(cookieParser()); // 미들웨어

// // 쿠키 : 브라우저에 내장된 저장소
// // ------------------------------------------------------------------------------------------------------------------------

// // refreshToken을 관리하기 위해 전역변수를 사용하고 있지만, 나중엔 전역변수가 아니라
// // 서버가 종료되어도 계속 인증가능하도록 데이터베이스 또는 redis같은 캐시DB안에 저장하는 방식으로 진행
// let tokenObject = {}; // Refresh Token을 저장할 Object이자 전역객체(전역변수)


// // SET-TOKEN API // localhost:3002/set-token/ID(랜덤)
// // set Token은 access token과 refresh token을 발급받는 부분
// app.get("/set-token/:id", (req, res) => {
//   const id = req.params.id;
//   const accessToken = createAccessToken(id); //사용자가 서버접근할때 확인하기위한 데이터
//   const refreshToken = createRefreshToken(); //실제 사용자가 서버에서 인증받은 사용자가 맞는지 검증하기위해 토큰 발급


//   // 실제로 refresh token 발급받은것이 refreshToken변수 할당되었다면
//   // 위 let tokenObject = {}; 전역변수에 refreshToken을 key값으로 갖고 id를 value값으로 갖는 하나의 프로퍼티를 정의한다.
//   // accessToken에 대한 cookie와 refreshToken에 대한 cookie를 발급해서 사용자 전달

//   tokenObject[refreshToken] = id; // Refresh Token을 가지고 해당 유저의 정보를 서버에 저장합니다.
//   res.cookie('accessToken', accessToken); // Access Token을 Cookie에 전달한다. (응답하는 쿠키에는 accessToken만 있음)
//   res.cookie('refreshToken', refreshToken); // Refresh Token을 Cookie에 전달한다.

//   return res.status(200).send({ "message": "Token이 정상적으로 발급되었습니다." });
// })

// // Access Token을 생성합니다.
// function createAccessToken(id) { // id라는 인자값을 받아 jwt.sign을 통해서 jwt token생성
//   const accessToken = jwt.sign(
//     { id: id }, // JWT 데이터
//     SECRET_KEY, // 비밀키 (10번째줄 전역변수로 설정한 비밀키를 통해 암호화)
//     { expiresIn: '10s' }) // Access Token이 10초 뒤에 만료되도록 설정합니다.

//   return accessToken;
// }

// // Refresh Token을 생성합니다.
// function createRefreshToken() {
//   const refreshToken = jwt.sign(
//     {}, // JWT 데이터가 아무것도 존재하지 않음. 
//     // 해당하는 refresh token을 갖고있을 경우 원래 refresh token이 갖고있는 정보를 사용할것이기 때문.

//     SECRET_KEY, // 비밀키
//     { expiresIn: '7d' }) // Refresh Token이 7일 뒤에 만료되도록 설정합니다.
//     // refresh token은 계속 재발급하면서 access token을 재발급하기 위한 용도로 사용하기 때문. 만료기간 길어도 상관없다. 7일정도 적당
//   return refreshToken;
// }

// // ------------------------------------------------------------------------------------------------------------------------

// // GET-TOKEN API // localhost:3002/get-token
// // accessToken과 refreshToken에 해당하는 쿠키를 변수에 할당
// app.get("/get-token", (req, res) => {
//     const accessToken = req.cookies.accessToken;
//     const refreshToken = req.cookies.refreshToken;
//     console.log(req.cookies, accessToken, refreshToken);
  
//     if (!refreshToken) return res.status(400).json({ "message": "Refresh Token이 존재하지 않습니다." });
//     if (!accessToken) return res.status(400).json({ "message": "Access Token이 존재하지 않습니다." });
  

//     // 20-21번째줄 createAccessToken과 createRefreshToken과 마찬가지로
//     // validateAccessToken과 validateRefreshToken은 함수로 분리해서 관리한다

//     const isAccessTokenValidate = validateAccessToken(accessToken); // AccessToken이 정상적으로 검증되었는지
//     const isRefreshTokenValidate = validateRefreshToken(refreshToken); //refreshToken이 정상적으로 검증되었는지
  
//     if (!isRefreshTokenValidate) return res.status(419).json({ "message": "Refresh Token이 만료되었습니다." });
  
//   // refreshToken은 accessToken이 만료되었을때 다시 발급하기위한 용도. 아래는 accessToken을 재발급하기위한 절차

//     if (!isAccessTokenValidate) {
//       const accessTokenId = tokenObject[refreshToken];
//       //tokenObject(전역객체)에 refreshToken을 할당해서 token이 처음 지정한 아이디값을 가져온다.

//       if (!accessTokenId) return res.status(419).json({ "message": "Refresh Token의 정보가 서버에 존재하지 않습니다." });
//         // refreshToken이 서버인증되고 비밀키,만료시간 정상적인데, 서버에 해당하는 id값이 존재하지 않는경우
//         // 만약 accessToken이나 refreshToken이 탈취당했을때 refreshToken은 서버에서 자동적으로 고의적으로 만료시킬수있다.
//         // 서버가 고의적으로 해당하는 토큰을 만료시키거나, 저장소에 갖고있던 토큰이 유실될때 이 조건이 해당한다


//         // 실제로 AccessToken을 발급한다.
//       const newAccessToken = createAccessToken(accessTokenId);
//       res.cookie('accessToken', newAccessToken);   // res 응답
//       return res.json({ "message": "Access Token을 새롭게 발급하였습니다." });
//     }
  
//     // getAccessTokenPayload라는 함수를 통해서 AccessToken이 갖고있는 Id값을 갖고와서 response로 출력
//     // 맨 아랫부분 Access Token의 Payload를 가져옵니다. (getAccessTokenPayload)
//     // 그렇게 해서 가져온 payload값을 객체구조분해할당으로 id를 변수지정하고 아래와같이 response함.
//     const { id } = getAccessTokenPayload(accessToken);
//           return res.json({ "message": `${id}의 Payload를 가진 Token이 성공적으로 인증되었습니다.` });
//   })
  
  
//   // Access Token을 검증합니다.
//   function validateAccessToken(accessToken) {
//     try {
//       jwt.verify(accessToken, SECRET_KEY); // JWT를 검증합니다. AccessToken과 시크릿키를 같이 묶은 다음 검색
//       return true;                // jwt검증 통과시 true반환, 아닐시 false 반환. 아래도 마찬가지
//     } catch (error) {
//       return false;
//     }
//   }
  
//   // Refresh Token을 검증합니다.
//   function validateRefreshToken(refreshToken) {
//     try {
//       jwt.verify(refreshToken, SECRET_KEY); // JWT를 검증합니다.
//       return true;
//     } catch (error) {
//       return false;
//     }
//   }
  
//   // Access Token의 Payload를 가져옵니다. 
//   function getAccessTokenPayload(accessToken) {
//     try {
//       const payload = jwt.verify(accessToken, SECRET_KEY); //  jwt.verify에서 가져온 결괏값을 payload변수에 할당.  JWT에서 Payload를 가져옵니다.
//       return payload;    // 할당된 값이 존재할경우 payload 반환
//     } catch (error) {
//       return null;
//     }
//   }


// // ------------------------------------------------------------------------------------------------------------------------
// app.get("/", (req, res) => {
//   res.status(200).send("Hello Token!");
// })

// app.listen(port, () => {
//   console.log(port, '포트로 서버가 열렸어요!');
// })


