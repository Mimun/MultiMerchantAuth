https://shamim8888.wordpress.com/languages-operating-systems-servers-databases-networks/bigdecimal-in-javascript/

var fs = require('fs')
const { v4: uuidv4 } = require('uuid');

const data_path = "./wallet.json";
let rawdata = fs.readFileSync(data_path)
const accounts = JSON.parse(rawdata)
console.log("accounts", accounts)

// https://stackoverflow.com/questions/25250551/how-to-generate-timestamp-unix-epoch-format-nodejs
Date.prototype.toUnixTime = function () { return this.getTime() / 1000 | 0 };
Date.time = function () { return new Date().toUnixTime(); }

wallet = {}

wallet.createAccount = (userId)=>{
    account = {}
    account.address = userId
    account.book = []
    acoounts.push(account)
}

wallet.updateWallet = (sourceAddress, destAddress, amount) => {
    tran_num = uuidv4()
    tran_date = Date.time()
    console.log(sourceAddress, destAddress, amount)
    console.log("Current Time: " + Date.time(), typeof(Date.time()))
}

wallet.getAmount = (address) => {
    console.log(address)
    return 0;
}

module.exports = wallet