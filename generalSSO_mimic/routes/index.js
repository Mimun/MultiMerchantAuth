var express = require('express');
var router = express.Router();
global.atob = require("atob");

const url = require('url')
const querystring = require('querystring')
const fs = require('fs')
// const path = require('path')

/* GET home page. */
router.get('/', function (req, res, next) {
    res.redirect('/login')
    // res.render('index', { title: 'Express' });
})

router.get('/test', function (req, res, next) {
    res.render('dynamic', { title: 'Express' });
    // res.render('index', { title: 'Express' });
})


router.get('/login', function (req, res, next) {
    res.render('index', { title: 'SSO Mimicking' });
});

const jwt = require('jsonwebtoken');

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';
const data_path = './routes/users.json'


const refreshTokens = [];

// router.use(bodyParser.json());


router.post('/login', (req, res) => {
    // read username and password from request body
    // console.log(req.body, req.query,req.body && req.query )
    const { username, password } = req.body;
    console.log('REQUEST', username, password)


    let rawdata = fs.readFileSync(data_path)
    let users = JSON.parse(rawdata)

    // filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshToken);

        res.json({
            accessToken,
            refreshToken
        });
    } else {
        res.send('Username or password incorrect');
    }
});

router.post('/pagelogin', (req, res) => {
    // read username and password from request body
    // console.log(req.body, req.query,req.body && req.query )

    const { username, password } = req.body;

    let rawdata = fs.readFileSync(data_path)
    let users = JSON.parse(rawdata)
    // filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshToken);

        res.render('result', {
            token: JSON.stringify(accessToken),
            refresh: JSON.stringify(refreshToken),
            user:JSON.stringify(user)
        });
    } else {
        res.send('Username or password incorrect');
    }
});


router.post('/token', (req, res) => {
    const { token } = req.body;

    if (!token) {
        return res.sendStatus(401);
    }

    if (!refreshTokens.includes(token)) {
        return res.sendStatus(403);
    }

    jwt.verify(token, refreshTokenSecret, (err, user) => {
        if (err) {
            return res.sendStatus(403);
        }

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20h' });

        res.json({
            accessToken
        });
    });
});

router.post('/verify', (req, res, next) => {
    let token = req.body["accessToken"]
    console.log('from verify 3000: ------------------', token, '\n')
    if (!token) {
        res.status(400).send('Bad request, non of access token')
        return;
    }
    jwt.verify(token, accessTokenSecret, (err) => {
        if (err) {
            return res.status(403).send(err);
        }
        let returnVal = getUserInfo(token)
        return res.status(200).send(returnVal)
    })

})

router.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);
    res.send("Logout successful");
});

function getUserInfo(accessToken){
    //1. Reading Tokien
    tokenValue = parseJwt(accessToken)
    const username = tokenValue.username

    let rawdata = fs.readFileSync(data_path)
    let users = JSON.parse(rawdata)
    const user = users.find(u => { return u.username === username });
    delete user.password

    return user

}

function parseJwt (token) {
    var base64Url = token.split('.')[1];
    var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    var jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
    }).join(''));

    return JSON.parse(jsonPayload);
};


module.exports = router;
