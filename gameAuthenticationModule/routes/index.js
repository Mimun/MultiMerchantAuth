var express = require('express');
var router = express.Router();
global.atob = require("atob");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const request = require('request');
const { response } = require('express');
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const algorithm = 'aes-192-cbc';
const ENC_KEY = Buffer.from("bf3c199c2470cb477d907b1e0917c17bbf3c199c2470cb477d907b1e0917c17b", "hex"); // set random encryption key
const IV = Buffer.from("5183666c72eec9e45183666c72eec9e4", "hex"); // set random initialisation vector
// ENC_KEY and IV can be generated as crypto.randomBytes(32).toString('hex');



var encrypt = ((val) => {
  let cipher = crypto.createCipheriv('aes-256-cbc', ENC_KEY, IV);
  let encrypted = cipher.update(val, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
});

var decrypt = ((encrypted) => {
  let decipher = crypto.createDecipheriv('aes-256-cbc', ENC_KEY, IV);
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  return (decrypted + decipher.final('utf8'));
});

/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Authentication Module' });
});

router.post('/verify', function (req, res, next) {
  // 1. Get Extra-Encrypted JWT-0
  extraToken = req.token;
  if (!extraToken) {
    return;
  }
  //2. Verify Extra JWT-0 by GameProvider Public Key
  //3. Decryp the Extra JWT-0 by AES System Key to get real JWT-0
  // https://gist.github.com/siwalikm/8311cf0a287b98ef67c73c1b03b47154

  //4. Forward JWT-0 to System SSO to get User Information

});


router.get('/login',function(req,res,next){
  res.render('dynamic', { title: 'Express' });
  // res.render('index', { title: 'Express' });
})

router.post('/login', function (req, res, next) {
  // Require Return JWT1
  // 1. Get username/password/Merchant ID from request
  const { username, password, merchantID } = req.body
  // 2. Forward username/password to SSO to get JWT-0
  const options = {
    url: 'https://localhost:3000/login',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
      'User-Agent': 'my-reddit-client'
    },
    // form or body are both ukie
    form: {
      username: username,
      password: password
    },
    json: true

  };

  // const jwt = require('jsonwebtoken');

  request('https://localhost:3000/login', options, (err, resp, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(body);
    // console.log(body.explanation);
    JWT_0 = body['accessToken']

    // const accessTokenSecret = 'somerandomaccesstoken';
    // jwt.verify(JWT_0, accessTokenSecret, (err, user)=>{
    //   if (err){
    //     console.log (err);
    //     return;
    //   }
    //   console.log('from lognin 3000 user:', user)
    // })

    if (!JWT_0) {
      console.log('Invalid username and password')
      res.send('Invalid username and password')
      return;
    }
    // 3. Encrypt JWT-0 by AES System Key 
    // const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted_JWT_0 = encrypt(JWT_0)

    console.log("Extra JWT 0: ", encrypted_JWT_0, '\n', 'length:', encrypted_JWT_0.length);
    // 4. Appending Merchant ID to Encrypted JWT-0 to make Extra-Encrypted JWT-0
    EE_JWT0 = {
      accessToken: encrypted_JWT_0,
      merchantID: merchantID
    }
    console.log("EE_JWT0:", EE_JWT0, "\n")
    // 5. Encrypt Extra-Encrypted JWT-0 by Merchant Public Key to get JWT-1
    // Need to adding function to find the PublicKey of Merchant in Folder base on MerchantID
    var path_to_PublicKey = './GamePublicKeys/GamePub_1.pem'
    let JWT_1 = RSA_PublicKey_Encrypt(JSON.stringify(EE_JWT0), path_to_PublicKey)


    res.send(JWT_1)

  })

})

router.post('/verify_eejwt0', function (req, res, next) {
  console.log("req", req.body)
  let eejwt0 = req.body["accessToken"];
  // JWT_0 += decipher.final('hex');
  console.log("eejwt0", eejwt0)
  let JWT_0 = decrypt(eejwt0)

  const options = {
    url: 'https://localhost:3000/verify',
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
      'User-Agent': 'my-reddit-client'
    },
    // form or body are both ukie
    form: {
      accessToken: JWT_0
    },
    json: true
  };

  request('https://localhost:3000/verify', options, (err, resp, body) => {
    if (err) {
      return console.log(err);
      res.sendStatus(400)
    }
    res.send(body)
    console.log('return body', body)
  })
  // Reading JWT_0


  // let jwt = parseJwt(JWT_0)


  // res.send(jwt)
  // const accessTokenSecret = 'somerandomaccesstoken';
  // const jwt = require('jsonwebtoken');

  // jwt.verify(JWT_0, accessTokenSecret, (err, user) => {
  //   if (err) {
  //     return res.status(403).send(err);
  //   }
  //   return res.status(200).send('Confirm verification')
  // })

})

// Helper functions

function RSA_PublicKey_Encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
  const publicKey = fs.readFileSync(absolutePath, 'utf8')
  const buffer = Buffer.from(toEncrypt, 'utf8')
  const encrypted = crypto.publicEncrypt(publicKey, buffer)
  return encrypted.toString('base64')
}

function parseJwt(token) {
  var base64Url = token.split('.')[1];
  var base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  var jsonPayload = decodeURIComponent(atob(base64).split('').map(function (c) {
    return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
  }).join(''));

  return JSON.parse(jsonPayload);
};



module.exports = router;






