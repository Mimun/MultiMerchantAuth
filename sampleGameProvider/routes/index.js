var express = require('express');
var router = express.Router();
const request = require('request')
const path = require('path')
const fs = require('fs')
var crypto = require("crypto");

var AUTHEN_BASE_URL = (process.env.AUTHEN_BASE_URL||"http://localhost:3001")

// Helper function libs

// This function will be used in Game Provider
function RSA_PrivateKey_Decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
  const privateKey = fs.readFileSync(absolutePath, 'utf8')
  const buffer = Buffer.from(toDecrypt, 'base64')
  const decrypted = crypto.privateDecrypt(
    {
      key: privateKey.toString(),
      passphrase: 'this is some secret of system',
    },
    buffer,
  )
  return decrypted.toString('utf8')
}

/* GET home page. */
router.get('/', function (req, res, next) {
  console.log('from Index Endpoint "/"')
  res.render('index', { title: 'Express' });
});

router.get('/game', (req, res, next) => {
  res.render('gamePage', { title: 'GamePage' });
})

router.post('/aliasjwt', (req, res, next) => {
  let alias = req.body['aliasJWT'];
  console.log('-------------------AliasJWT from 3002 ', alias)
  // 1. Encrypt alias with privateKey - implement later since August 27 2020
  // let path_to_Priv = "./bin/GamePriv_1.pem"
  encryptedAlias = alias;
  // 2. Build JSON with encrypted alias and mercha,ntID
  sendObj = {
    encryptedAlias: encryptedAlias,
    merchantID: "0001"
  }
  // 3. Send back to SSO to get user Information
  const options = {
    url: `${AUTHEN_BASE_URL}/aliasjwt`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
      'User-Agent': 'from 3002 sample game provider'
    },
    // form or body are ukie for both
    body: { "aliasjwt": alias },
    json: true

  };
  request(`${AUTHEN_BASE_URL}/aliasjwt`, options, (err, resp, body) => {
    if (err) {
      return console.log(err);
    }
    console.log('body', body)
    res.send(body)
  })

  // res.send("Iam  not here " + JSON.stringify(req.body))
})

router.post('/updateToken', (req,res,next)=>{
  console.log(req.body);
    // 3. Send back to SSO to get user Information
    const options = {
      url: `${AUTHEN_BASE_URL}/updatetoken`,
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Accept-Charset': 'utf-8',
        'User-Agent': 'from 3002 sample game provider'
      },
      // form or body are ukie for both
      body: req.body,
      json: true
  
    };
    request(`${AUTHEN_BASE_URL}/updatetoken`, options, (err, resp, body) => {
      if (err) {
        return console.log(err);
      }
      console.log('body', body)
      res.send(body)
    })
  // res.send("I am fine");
})




router.post('/verify_jwt1', function (req, res, next) {
  // 1. Decrypt JWT_1 to be EE_JWT_0
  const body = req.body;
  console.log(body);

  // console.log(body.explanation);
  JWT1 = body['accessToken']
  if (!JWT1) {
    res.status(400).send('Bad request, request without JWT1');
    return;
  }

  let path_to_Priv = "./bin/GamePriv_1.pem"

  let EE_JWT0 = JSON.parse(RSA_PrivateKey_Decrypt(JWT1, path_to_Priv))['accessToken']

  if (!EE_JWT0) {
    res.status(400).send('Bad request, request within invalid EE_JWT_0');
    return;
  }
  // 2. Send EE_JWT_0 to gameAuthenticationModule
  console.log('EE_JWT_0', EE_JWT0)

  const options = {
    url: `${AUTHEN_BASE_URL}/verify_eejwt0`,
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Accept-Charset': 'utf-8',
      'User-Agent': 'my-reddit-client'
    },
    // form or body are ukie for both
    body: { "accessToken": EE_JWT0 },
    json: true

  };
  request(`${AUTHEN_BASE_URL}/verify_eejwt0`, options, (err, resp, body) => {
    if (err) {
      return console.log(err);
    }
    console.log('body', body)
    res.send(body)
  })

})

module.exports = router;
