var fs = require('fs');
const wallet = require("./wallet");

// var path_to_PublicKey = '../GamePublicKeys/GamePub_1.pem'
// pubKey = fs.readFileSync(path_to_PublicKey,'utf8')
// console.log('publicKey', pubKey)

wallet.updateWallet(123,456,890)
wallet.getAmount(12356)
