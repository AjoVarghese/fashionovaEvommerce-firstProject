var express = require('express');
var router = express.Router();
const collection=require('../../config/collection')
const db=require('../../config/connection')
const { render } = require('ejs');
const { response } = require('express');
const {objectId}=require('bson');
const objId=require('mongodb').ObjectId


exports.admin_deleteProduct_get=(req,res)=>{
    try{
    if(req.session.admin){
        var delId=new objId(req.query.id)
        deleteProduct(delId).then((response)=>{
         res.redirect('/products')
        })
     }else{
        res.redirect('/admin-login')
     }
    }catch{
        res.redirect('/404')
    }
}


function deleteProduct(delId){
    return new Promise((resolve,reject)=>{
        db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({_id:delId}).then((result)=>{
            resolve(result)
        })
    })
}