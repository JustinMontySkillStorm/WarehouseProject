const { ParentCompany, ChildCompany, Warehouse } = require('../../model/Company.js');
const router = require('express').Router();
const mongoFactory  = require('../../helper/db-factory.js');

const mongoDB = mongoFactory(process.env.MONGO_URI);


// returns all the child company warehouses 
router.get('/warehouses', async (req,res) => {    
    try {
        console.log("hitting here");
        mongoDB.connect();
        // why doesn't going up work with the referencing. Do i need to drill in to somehwere with the Warehouse? 
        const data = await ParentCompany.find().populate({
            path: "childCompanies",
            populate: {
                path: "storage"
            }
        }).exec();
        console.log(data);
        mongoDB.disconnect();
        res.status(200).json(data);
    } catch(err) {

    }
})

module.exports = router;
