var express = require('express');
var router = express.Router();
global.atob = require("atob");

require('dotenv').config()


process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

GAME_ADDRESS = (process.env.GAME_ADRESS||'http://localhost:3002/realgame.html')
console.log('GameAddress', GAME_ADDRESS)


const crypto = require('crypto')
const path = require('path')
const fs = require('fs')

const request = require('request');
const { response } = require('express');

function checkAuthentication(req,res,next){
    console.log('from checkAuthentication')
    next();
}


router.get('/', checkAuthentication, (req,res,next)=>{
    res.render("GamePortal/gamePortal", {GAME_ADDRESS: GAME_ADRESS})
})



router.get('/real', checkAuthentication, (req,res,next)=>{
    res.render("GamePortal/realgamePortal",{GAME_ADDRESS: GAME_ADRESS})
})
// Checking only
router.get('/changeJWT', (req,res,next)=>{
    res.sendStatus(200).send("Good")
})


router.post('/changeJWT', (req,res,next)=>{
    
})

router.get('/main',checkAuthentication, (req,res,next)=>{
    res.send("Good from main Page")

})


module.exports = router;
