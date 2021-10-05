const { Company } = require('../model/Company');
require('dotenv').config();


/**
 * 
 * @param {String} name of the parent organization we are trying to find
 * @returns parentOrganization wrapped in a Promise
 */
const findParentOrg = async (name) => {
    try {
        const parentOrg = await Company.findOne({name: name})
        return parentOrg;
    } catch(err) {
        throw err;
    }
}

/**
 * 
 * @param {String} childName 
 * @returns the childOrg wrapped in a promise
 */
const findChildOrg = async ({ childName }) => {
    try{
        console.log(childName);
        const childOrg = await Company.findOne({"childCompanies.name": childName});
        return childOrg;
    } catch(err) {
        throw err;
    }
}


module.exports = {
    findParentOrg,
    findChildOrg,
}

