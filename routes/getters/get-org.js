const {ParentCompany, ChildCompany} = require('../../model/Company.js');
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

router.get('/parent/:pName', async(req, res)=> {
    try {
        await mongoDB.connect();
        console.log(req.params);
        const parentOrg = await ParentCompany.findOne({"name": req.params.pName});
        res.status(200).json(parentOrg);
        mongoDB.disconnect();
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})



module.exports = router;





