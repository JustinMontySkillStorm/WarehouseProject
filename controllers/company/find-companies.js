const { ParentCompany, ChildCompany } = require('../../model/Company');
require('dotenv').config();


/**
 * finds the parent document from company db and returns it.
 * 
 * @param {String} name of the parent organization we are trying to find
 * @returns parentOrganization wrapped in a Promise
 */
const findParentOrg = async ({pName}) => {
    try {
        // console.log(pName);
        const parentOrg = await ParentCompany.findOne({name: pName})
        return parentOrg;
    } catch(err) {
        return {status: 404, message: `The parent organization with the name of ${pName} cannot be found in our database.`};
    }
}

/**
 * might delete this one later doesn't do what I thought it would do. 
 * 
 * @param {String} childName 
 * @returns the childOrg wrapped in a promise
 */
const findChildOrg = async ({ childName }) => {
    try{
        const childOrg = await ChildCompany.findOne({"name": childName});
        return childOrg;
    } catch(err) {
        return{status: 404, message: `We cannot locate the child organization with the name of ${childName} in our database`};
    }
}


module.exports = {
    findParentOrg,
    findChildOrg,
}

