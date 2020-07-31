var express = require('express');
var router = express.Router();
const url = require('url')
const querystring = require('querystring')

/* GET home page. */
router.get('/',function(req,res,next){
    res.redirect('/login')
    // res.render('index', { title: 'Express' });
})

router.get('/test',function(req,res,next){
    res.render('dynamic', { title: 'Express' });
    // res.render('index', { title: 'Express' });
})


router.get('/login', function (req, res, next) {
    res.render('index', { title: 'Express' });
});

const jwt = require('jsonwebtoken');

const accessTokenSecret = 'somerandomaccesstoken';
const refreshTokenSecret = 'somerandomstringforrefreshtoken';

const users = [
    {
        username: 'chipl',
        password: '123456',
        role: 'admin'
    },
    {
        username: 'john',
        password: 'password123admin',
        role: 'admin'
    }, {
        username: 'anna',
        password: 'password123member',
        role: 'member'
    }
]

const refreshTokens = [];

// router.use(bodyParser.json());


router.post('/login', (req, res) => {
    // read username and password from request body
    // console.log(req.body, req.query,req.body && req.query )
    const { username, password } = req.body;
    console.log('REQUEST', username, password)

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

    // filter user from the users array by username and password
    const user = users.find(u => { return u.username === username && u.password === password });

    if (user) {
        // generate an access token
        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });
        const refreshToken = jwt.sign({ username: user.username, role: user.role }, refreshTokenSecret);

        refreshTokens.push(refreshToken);

        res.render('result',{
            token:JSON.stringify(accessToken),
            refresh:JSON.stringify(refreshToken)
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

        const accessToken = jwt.sign({ username: user.username, role: user.role }, accessTokenSecret, { expiresIn: '20m' });

        res.json({
            accessToken
        });
    });
});

router.post('/logout', (req, res) => {
    const { token } = req.body;
    refreshTokens = refreshTokens.filter(token => t !== token);

    res.send("Logout successful");
});




module.exports = router;
