const { findChildOrg, findParentOrg } = require('../../controllers/company/find-companies.js');
const router = require('express').Router();
const mongoFactory  = require('../../helper/db-factory.js');

const mongoDB = mongoFactory(process.env.MONGO_URI);

// not sure I'll need this as a route maybe just findChildOrg as a helper to add a warehouse and push to that organization.
router.get('/child/:childName', async (req, res) => {
    try {
        /**
         * doesn't work how I thought it would.
         * I thought it would grab just the child object and return it
         * grabs the whole document though no big deal.
         */
        mongoDB.connect();
        console.log(req.params);
        const childCompany = await findChildOrg(req.params);
        mongoDB.disconnect();
        res.status(200).json(childCompany);
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})

router.get('/parent/:pName', async(req, res)=> {
    try {
        mongoDB.connect();
        console.log(req.params);
        const parentOrg = await findParentOrg(req.params);
        mongoDB.disconnect();
        res.status(200).json(parentOrg);
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})

module.exports = router;





