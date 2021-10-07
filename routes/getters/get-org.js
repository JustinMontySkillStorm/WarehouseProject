const { ParentCompany, ChildCompany } = require('../../model/Company.js');
const router = require('express').Router();
const mongoFactory  = require('../../helper/db-factory.js');

const mongoDB = mongoFactory(process.env.MONGO_URI);

// gets a child company with the provided name from req.params.  
router.get('/child/:childName', async (req, res) => {
    try {
        await mongoDB.connect();
        console.log(req.params);
        const childCompany = await ChildCompany.findOne({"name": req.params.childName});
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
        const parentOrg = await ParentCompany.findOne({"name": req.params.pName}).populate('childCompanies').exec();
        res.status(200).json(parentOrg);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})


// get a childcompanies warehouses and show the inventory
router.get('/:childName/storage', async(req, res)=> {
    try {
        await mongoDB.connect();
        console.log(req.params);
        const childOrgStorage = await ChildCompany.findOne({"name": req.params.childName}).populate('storage').exec();
        res.status(200).json(childOrgStorage);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})



module.exports = router;





