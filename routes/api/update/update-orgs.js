const mongoDB = require('../../../helper/db-factory.js');
const router = require('express').Router();
const mongoose = require('mongoose');
const {ParentCompany, ChildCompany } = require('../../../model/Company.js');



// oldName to update is going to be passed in through req.params
// newName to set it to will be passed in the req.body
router.put('/api/parent/:parentName', async(req, res) => {
    try {
        console.log(req.body);
        console.log(req.params);
        await mongoDB.connect();
        await ParentCompany.findOneAndUpdate({name: req.params.parentName}, {name: req.body.newName});
        // do i need to save the updated document? Maybe? 
        res.status(200).json({message: `Successfully update ${req.params.parentName} to ${req.body.newName}`});
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }

})

// old childName to update will be passed though req.params
// newName to set it will be passed in the req.body
router.put('/api/child/:childName', async(req,res)=> {
    try {
        console.log(req.body);
        await mongoDB.connect();
        // this isn't throwing an error if the item is not in our database.  
        await ChildCompany.findOneAndUpdate({name: req.params.childName}, {name: req.body.newName});
        res.status(200).json({message: `Successfully updated ${req.params.childName} to ${req.body.newName}`});
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
})



module.exports = router;
