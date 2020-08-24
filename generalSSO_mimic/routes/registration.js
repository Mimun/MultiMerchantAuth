var express = require('express');
var router = express.Router();
var fs = require('fs')


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
