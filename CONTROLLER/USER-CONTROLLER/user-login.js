var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const config=require('../../config/config');
const { ObjectId } = require('bson');
const bcrypt=require('bcrypt')



var loggedUser
var loginError
var blockedStatus
var validate
var noEmail
var findEmail
var userSession


exports.userLogin_get=(req,res)=>{
  try{
    if(req.session.user){
        res.redirect('/')
      }
      else{
        res.render('login',{loginError,noEmail,blockedStatus,validate})
        loginError=false
        blockedStatus=false
        noEmail=false
      } 
    }catch(err){
      res.redirect('/404')
    } 
}


exports.userLogin_post=(req,res)=>{
  try{
    doLogin(req.body).then((response)=>{
    
        if(response.status){
          if(response.user.signupStatus == true){
            userSession=response.user
            req.session.loggedIn=true
            findEmail=response.user.email
            loggedUser=response.user.name
            blockUser=response.user.signupStatus
            req.session.user=response.user
            
            if(req.session.returnTo){
              res.redirect(req.session.returnTo)
            }else{
              res.redirect('/')
            }
          }else{
            blockedStatus=true
            res.redirect('/login')
          }
        }
        else{
          loginError=true
          res.redirect('/login')
        } 
      }) 
    }catch(err){
      res.redirect('/404')
    }
}


function doLogin(loginData){
    console.log(loginData);
    return new Promise(async(resolve,reject)=>{
     let loginStatus=true
     let response={}
     
     let user=await db.get().collection(collection.USER_COLLECTION).findOne({email:loginData.email})
     if(user){
        bcrypt.compare(loginData.password,user.password).then((status)=>{
              
            if(status){
               response.status=true
               response.user=user
                resolve(response)
            }
            else{
                resolve(response)
            }
        })
     }
     else{
       
        resolve(response)
     }
    })
}