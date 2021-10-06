const { ParentCompany, ChildCompany } = require('../../model/Company.js');
const mongoose = require('mongoose');
const { findParentOrg, findChildOrg } = require('../../controllers/company/find-companies.js');
const mongoFactory = require('../../helper/db-factory.js');
require('dotenv').config();

const mongoDB = mongoFactory(process.env.MONGO_URI);

/**
 * adding a child company that falls underneath the parent company as a whole. 
 * see Company.js in model folder
 * 
 * will return a successful object with 200+ code or 
 * an unsuccessful object with 500 (server error).
 * 
 * @param req.body destructuring req.body.  taking the name and the rest of the data
 * will be array of objects of the child companies 
 */
const addChildCompany = async ({pName, child: {cName, businessSector}}) => {
    try {
        // needed to add this hack here because I was destructure alson in findParentOrg method.
        await mongoDB.connect();
        let parentObj = {pName: pName};

        const parentOrg = await findParentOrg(parentObj);
        const childCompany = new ChildCompany({parentID: parentOrg._id, name: cName, businessSector: businessSector});

        console.log(parentOrg);
        childCompany._id = new mongoose.Types.ObjectId();
        parentOrg.childCompanies.push(childCompany._id);

        await childCompany.save();
        await parentOrg.save();
        mongoDB.disconnect();

        return { status: 201, message: `Successfull added child company with name of ${cName}` };
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        return {status: 500, message: `Unable to add child company with name of ${cName}`};
    }
}

/**
 * creates a parent organization document in our collection.
 * 
 * @param {String} name of the parent company we would like to add to our database  
 * @returns an object with an HTTP status code and a message.
 */
const createParentCompany = async({ pName }) => {
    try {
        await mongoDB.connect();
        console.log(pName);
        const parentCompany = new ParentCompany({ name: pName });
        await parentCompany.save();
        mongoDB.disconnect();
        return {status: 201, message: `Created parent company with a name of ${pName}`};
    } catch(err) {
        console.log(err);
        mongoDB.disconnect();
        return {status: 500, message: `Unable to add parent company with a name of ${pName}`};
    }
}




module.exports = {
    addChildCompany,
    createParentCompany,
}


