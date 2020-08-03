const fs = require('fs')

var path_to_PublicKey = '../GamePublicKeys/GamePub_1.pem'
pubKey = fs.readFileSync(path_to_PublicKey,'utf8')
console.log('publicKey', pubKey)