const { findChildOrg } = require('../../controllers/find-companies.js');
const router = require('express').Router();
const mongoFactory  = require('../../helper/db-factory.js');

const mongoDB = mongoFactory(process.env.MONGO_URI);

router.get('/:childName', async (req, res) => {
    try {
        mongoDB.connect();
        console.log(req.params);
        const childCompany = await findChildOrg(req.params);
        console.log(childCompany);
        mongoDB.disconnect();
        res.status(200).json(childCompany);
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        res.status(500).json(err);
    }
})

module.exports = router;





