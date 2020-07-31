var express = require('express');
var router = express.Router();


const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const request = require('request')
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


const crypto = require('crypto');
const algorithm = 'aes-192-cbc';
const password = 'Password used to generate key and has been added more characters to get more real power';
// Use the async `crypto.scrypt()` instead.
const key = crypto.scryptSync(password, 'salt', 24);
// Use `crypto.randomBytes` to generate a random iv instead of the static iv
// shown here.
const iv = Buffer.alloc(16, 0); // Initialization vector.



/* GET home page. */
router.get('/', function (req, res, next) {
  res.render('index', { title: 'Express' });
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

router.get('/login', function (req, res, next) {

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
      username: "chipl",
      password: "123456"
    },
    json: true

  };

  request('https://localhost:3000/login', options, (err, res, body) => {
    if (err) {
      return console.log(err);
    }
    console.log(body);
    // console.log(body.explanation);
    JWT_0 = body['accessToken']
    // 3. Encrypt JWT-0 by AES System Key 
    const cipher = crypto.createCipheriv(algorithm, key, iv);

    let encrypted_JWT_0 = cipher.update(JWT_0, 'utf8', 'hex');

    encrypted_JWT_0 += cipher.final('hex');

    // console.log("Extra JWT 0: ", extra_JWT_0, '\n', 'length:', extra_JWT_0.length);
    // 4. Appending Merchant ID to Encrypted JWT-0 to make Extra-Encrypted JWT-0
    EE_JWT0 = {
      encrypted_JWT_0: encrypted_JWT_0,
      merchantID: merchantID
    }    
    // 5. Encrypt Extra-Encrypted JWT-0 by Merchant Public Key to get JWT-1
    

  })

})

// Helper functions

function RSA_PublicKey_Encrypt(toEncrypt, relativeOrAbsolutePathToPublicKey) {
  const absolutePath = path.resolve(relativeOrAbsolutePathToPublicKey)
  const publicKey = fs.readFileSync(absolutePath, 'utf8')
  const buffer = Buffer.from(toEncrypt, 'utf8')
  const encrypted = crypto.publicEncrypt(publicKey, buffer)
  return encrypted.toString('base64')
}


// This function will be used in Game Provider
// function RSA_PrivateKey_Decrypt(toDecrypt, relativeOrAbsolutePathtoPrivateKey) {
//   const absolutePath = path.resolve(relativeOrAbsolutePathtoPrivateKey)
//   const privateKey = fs.readFileSync(absolutePath, 'utf8')
//   const buffer = Buffer.from(toDecrypt, 'base64')
//   const decrypted = crypto.privateDecrypt(
//     {
//       key: privateKey.toString(),
//       passphrase: 'this is some secret of system',
//     },
//     buffer,
//   )
//   return decrypted.toString('utf8')
// }

// const enc = encrypt("I need to encrypt a string using a public key (pem file), and then sign it using a private key (also a pem).", `public.pem`)
// console.log('enc', enc)

// const dec = decrypt(enc, `private.pem`)
// console.log('dec', dec)

module.exports = router;
