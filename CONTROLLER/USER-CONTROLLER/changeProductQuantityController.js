var express = require('express');
var router = express.Router();
const db=require('../../config/connection')
const collection=require('../../config/collection')
const config=require('../../config/config');
const { ObjectId } = require('bson');
const objId=require('mongodb').ObjectId

exports.chanageProductQuantity_post=(req,res)=>{
    try{
    changeProductQuantity(req.body).then((response)=>{
        response.total= getTotalPrice(req.body.user)
        res.json(response)
      })
    }catch(err){
        res.redirect('/404')
    }
}


function changeProductQuantity(details){
    count=parseInt(details.count)
    quantity=parseInt(details.quantity)
   
    return new Promise((resolve,reject)=>{
        if(count == -1 && quantity == 1){
            
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({_id:objId(details.cart)},
             {
                $pull:{products:{item:objId(details.product)}}
             }
            ).then((response)=>{
                resolve({removeProduct:true})
            })
        }else{
        db.get().collection(collection.CART_COLLECTION)
        .updateOne({_id:objId(details.cart),'products.item':objId(details.product)},
          {
            $inc:{'products.$.quantity':count}
          }
        ).then(()=>{
            resolve({status:true})
        })
    }
    })
}

