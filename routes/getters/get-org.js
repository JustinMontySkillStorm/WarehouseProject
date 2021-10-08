const { ParentCompany, ChildCompany, Warehouse } = require('../../model/Company.js');
const {resolve} = require('path');
const router = require('express').Router();
const mongoDB  = require('../../helper/db-factory.js');

// gets a child company with the provided name from req.params.  
router.get('/child/:childName', async (req, res) => {
    try {
        await mongoDB.connect();
        console.log(req.params);
        const childCompany = await ChildCompany.findOne({"name": req.params.childName});
        res.sendFile(resolve('public', "html", "child.html"));
        console.log(childCompany);
        res.status(200).json(childCompany);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})

// gets a parent company with the name passed in 
router.get('/parent/:pName', async(req, res)=> {
    try {
        await mongoDB.connect();
        console.log(req.params);
        const parentOrg = await ParentCompany.findOne({"name": req.params.pName}).populate('childCompanies', {name: 1, businessSector: 1}).exec();
        res.status(200).json(parentOrg);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})

router.get('/child', (req, res) => {
    res.sendFile(resolve('public','html','child.html'));
})



// get a childcompanies warehouses and show the inventory
router.get('/:childName/storage', async(req, res)=> {
    try {
        console.log(req.query);
        await mongoDB.connect();
        console.log(req.params);
        const childOrgStorage = await ChildCompany.findOne({"name": req.params.childName}).populate('storage').exec();
        res.sendFile(resolve('public','html','child.html'));
        res.status(200).json(childOrgStorage);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})

// show all warehouses and who owns them
router.get('/warehouses', async(req,res) => {
    try {
        await mongoDB.connect();
        const childOrgStorage = await Warehouse.find().populate('ownerOfWarehouse', {name: 1, businessSector:1}).exec();
        res.status(200).json(childOrgStorage);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})


module.exports = router;





