var express = require('express');
var router = express.Router();
var fs = require('fs')
const { uuid } = require('uuidv4');


/* GET users listing. */
router.get('/', function (req, res, next) {
    res.render('registration');
});
router.post('/', (req, res, next) => {
    let data = JSON.parse(req.body.data)
    console.log(Object.keys(data));

    let base64data = data.avatar.replace(/^data:image\/png;base64,/, "")
    // console.log('base64', base64data)
    fs.writeFile(`public/images/${data.username}.png`, base64data, 'base64', function (err) {
        if (err) { console.log(err); }
        // console.log(`public/images/${data.username}.png`)
        data.avatar = `/images/${data.username}.png`
        createNewUser(data)
        res.redirect('/reg/users')
        // res.sendStatus(200)

    });

})

router.post('/updateuser', (req, res, next) => {
    let mem = req.body
    console.log()
    if (!mem.userId) {
        res.sendStatus(400)
    }
    const data_path = './routes/users.json'
    let rawdata = fs.readFileSync(data_path)
    let users = JSON.parse(rawdata)
    user = users.find(u => { return u.userId === mem.userId })
    if (user) {
        //checking avatar is base64 or not
        function isBase64(str) {
            if (str ==='' || str.trim() ===''){ return false; }
            try {
                return btoa(atob(str)) == str;
            } catch (err) {
                return false;
            }
        }
        base64data = mem.avatar.replace(/^data:image\/png;base64,/, "")
        console.log('is base64:', isBase64(base64data))
        if(isBase64(base64data)){
            const imageBuffer = new Buffer(base64data, "base64");  
            fs.writeFileSync(`/images/${mem.username}.png`, imageBuffer);
            mem.avatar = `/images/${mem.username}.png`
        }

        users[users.indexOf(user)] = Object.assign({},mem)
        // console.log('users', users)
        fs.writeFile(data_path, JSON.stringify(users), (err, data) => {
            if (err) {
                console.log(err)
            }
        })
        res.send('this is ukie from post')
    } else {
        res.sendStatus(404)
    }

})

router.get('/users', (req, res, next) => {
    const data_path = './routes/users.json'
    let rawdata = fs.readFileSync(data_path)
    let users = JSON.parse(rawdata)
    res.render('userlists', {
        users: JSON.stringify(users)
    })
})


router.get('/change_pass', (req, res, next) => {
    res.send('everything is ok')
})

router.post('/change_pass', (req, res, next) => {

    res.send('everything is ok')
});

createNewUser = (mem) => {
    mem.userId = uuid()
    const data_path = './routes/users.json'
    let rawdata = fs.readFileSync(data_path)
    let users = JSON.parse(rawdata)

    users.push(mem)

    // fs.writeFileSync(data_path, JSON.stringify(users))
    fs.writeFile(data_path, JSON.stringify(users), (err, data) => {
        if (err) {
            console.log(err)
        }
    })
    return users;
}

module.exports = router;
