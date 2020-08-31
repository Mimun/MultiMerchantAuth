https://shamim8888.wordpress.com/languages-operating-systems-servers-databases-networks/bigdecimal-in-javascript/

var fs = require('fs')
const { v4: uuidv4 } = require('uuid');
const { use } = require('.');

const data_path = "./routes/wallet.json";
let rawdata = fs.readFileSync(data_path)
const accounts = JSON.parse(rawdata)
// console.log("accounts", accounts)

Date.prototype.toUnixTime = function () { return this.getTime() / 1000 | 0 };
Date.time = function () { return new Date().toUnixTime(); }

wallet = {}

wallet.createAccount = (userId, type = 'normal') => {
    if (accounts.find(a => { a.address == userId; return a })) {
        return
    }
    account = {}
    account.address = userId
    account.book = []
    accounts.push(account)
    fs.writeFile(data_path, JSON.stringify(accounts), (err, data) => {
        if (err) {
            console.log(err)
        }
        // console.log('accounts', accounts)
    })
}

wallet.checkAccount = (userId) => {
    return accounts.find(a => { a.address == userId; return a })
}


wallet.updateWallet = (sourceAddress, destAddress, amount) => {
    let tran = {}
    tran.tran_num = uuidv4()
    tran.tran_date = Date.time()
    tran.sourceAddress = sourceAddress
    tran.destAddress = destAddress
    tran.amount = amount
    let sourceAccount = accounts.find(a => { if (a.address == sourceAddress) { return a } })
    let destAccount = accounts.find(a => { if (a.address == sourceAddress) { return a } })
    if (sourceAccount && destAccount) {
        sourceAccount.book.push(Object.assign({}, tran))
        destAccount.book.push(Object.assign({}, tran))
    }
    // 
    // Exception for first time testing
    if (sourceAddress == 0) {
        console.log('Transaction', tran)
        destAccount.book.push(Object.assign({}, tran))
    }
    fs.writeFile(data_path, JSON.stringify(accounts), (err, data) => {
        if (err) {
            console.log(err)
        }
        // console.log('accounts', accounts)
    })

}

wallet.getAmount = (address) => {
    let account = accounts.find(a => {

        if (a.address == address) {
            a.address == address;
            return a
        }

    })

    // console.log("from wallet get Ammount: ",address, account)

    if (!account) {
        return NaN;
    }
    let amount = 0;
    account.book.forEach(tran => {
        if (tran.sourceAddress == address) {
            amount = amount - tran.amount
        } else {
            amount = amount + tran.amount
        }
    });
    return amount;
}

module.exports = wallet