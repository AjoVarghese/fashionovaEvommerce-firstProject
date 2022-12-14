var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId
const multer=require('multer')
const fs=require('fs')
const path=require('path');
const { log } = require('console');
const bcrypt=require('bcrypt')


var loginError


//-----------------------AdminLoginGet-------------------------------------------------------//
exports.admin_login_get=(req,res)=>{
    try{
    if(req.session.admin){
        res.redirect('/admin')
    }
    else{
        res.render('admin-login',{loginError})
        loginError=false
    }
}catch{
    res.redirect('/404')
}
}



//-------------------------------AdminLoginPost----------------------------------
exports.admin_login_post=(req,res)=>{
    try{
   doLogin(req.body).then((data)=>{
        if(data.status){
            req.session.adminLoggedIn=true
            req.session.admin=true
            res.redirect('/admin')
        }
        else{
            loginError=true
            res.redirect('/admin-login')
        }   
    })
}catch{
    res.redirect('/404')
}
}


function doLogin(loginData){
    return new Promise(async(resolve,reject)=>{
        let response={}
        let admin=await db.get().collection(collection.ADMIN_COLLECTION).findOne({email:loginData.email})
        if(admin){
          bcrypt.compare(loginData.password,admin.password).then((result)=>{
           
                if(result){
                   response.status=true
                   response.admin=admin
                   console.log('Login Success');
                   resolve(response)
                }
                else{ 
                    response.status=false
                    console.log("Login Failed");
                    resolve({status:false})
                }
            })

        }
        else{
            
            resolve(response)
            
        }
    })
}