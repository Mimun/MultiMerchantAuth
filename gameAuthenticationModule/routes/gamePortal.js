var express = require('express');
var router = express.Router();
global.atob = require("atob");
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';


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
    res.render("GamePortal/gamePortal")
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
