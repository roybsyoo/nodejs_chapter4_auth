// 필요한 모듈들을 불러옵니다.
const express = require('express');
const cors = require('cors');
const jwt = require('jsonwebtoken');
const posts = require('./posts');
const cookieParser = require('cookie-parser')

const app = express();

const secretCode = 'secretCode'
const renewScretCode = 're-ScretCode'

app.use(express.json());
app.use(cookieParser());

app.use(express.static('client'));

app.get('/',(req, res) =>{
    res.sendFile(__dirname + '/client/index.html');
});
let renewTokens = [];

app.post('/login', (req, res)=>{
    const username = req.body.username;
    const user = {name: username};
});

const accessToken = jwt.sign(user, secretCode,{expiresin: '20s'});
const renewToken = jwt.sign(user, renewScretCode,{expiresin: '1d'});
renewTokens.push(renewToken);
res.cookie('jwt', renewToken, {
    httpOnly: true, maxAge: 24*60*60*1000
});
res.json({ accessToken: accessToken })
app.get('/posts', authMiddleware, (req,res) => {
    res.json(posts)
})

function authMiddleware(req, res, next){
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1]
    if(token == null){
        return res.sendStatus(401)
    }
    jwt.verify(token, secretText, (err, user) => {
        if(err) return res.sendStatus(403)
        req.user = user
        next()
    })
}

app.get('/refresh', (req, res) => {
    const cookies = req.cookies
    if(!cookies?.jwt) {
        return res.sendStatus(403)
    }

    const renewToken = cookies.jwt

    if(!renewToken.includes(renewToken)){
        return res.sendStatus(403)
    }

    jwt.verify(renewToken, renewScretCode, (err, user) => {
        if(err) return res.sendStatus(403)

        const accessToken = jwt.sign({name: user.name}, 
        secretText, { expiresIn: '30s' })
        res.json({ accessToken })
    })
})

// 서버가 4000번 포트에서 듣기를 시작합니다. 서버가 시작되면 콘솔에 메시지를 출력합니다.
const port = 4000;
app.listen(port, () => {
    console.log(`listening on port ${port}`);
});
