var express = require('express');
var router = express.Router();
const collection = require('../../config/collection')
const db = require('../../config/connection')
const {
    render
} = require('ejs');
const {
    response
} = require('express');
const {
    objectId
} = require('bson');
const objId = require('mongodb').ObjectId


exports.deleteCategoryOffer_post = (req, res) => {
    try{
    let offerId = new objId(req.query.id)
    deleteCategoryOffer(offerId).then((response) => {
        res.json(response)
    })
}catch{
    res.redirect('/404')
}
}


function deleteCategoryOffer(offerId) {
    return new Promise((resolve, reject) => {
    db.get().collection(collection.OFFER_COLLECTION).deleteOne({
        _id: offerId
    }).then(() => {
        resolve({
            offerDeleted: true
        })
    })
})
}