const mongoFactory = require('../../helper/db-factory');
const mongoose = require('mongoose');
const { Warehouse } = require('../../model/Company.js');
const { findChildOrg } = require('../company/find-companies');
require('dotenv').config();


const mongoDB = mongoFactory(process.env.MONGO_URI);

/**
 * adds the warehouse object into the correct child company array.  
 * stores the ObjectId into companies storage collection.  
 * 
 * @param {Object} req.body will be passed in here and then we deconstruct it to grab our values.
 * @returns  an object with a success code and message or a reject object with a status code and message
 */
const addWarehouse = async ({ owner, warehouse: {locationStr: location, typeOfItems: items, maxFloorSpace: floorSpace} }) => {
    try {
        mongoDB.connect();
        // request needs to have which childCompany to add warehouse to.  
        console.log(location, items, floorSpace);
        // create warehouse 
        const warehouse = new Warehouse({locationStr: location, typeOfItems: items, maxFloorSpace: floorSpace})
        const id = new mongoose.Types.ObjectId();
    
        // save warehouse to its collection. keep _id 
        warehouse._id = id;
        console.log(warehouse._id);
        await warehouse.save();
        // find childCompany. 
        const doc = await findChildOrg({childName: owner});
        // add warehouse._id to correct childCompany storage
        let childCompanyName = null;
        doc.childCompanies.forEach(obj => {
            if(obj.name === owner) {
                obj.storage.push(id);
                childCompanyName = obj.name;
            }
        })
        // save the document and return 201
        await doc.save();
        mongoDB.disconnect();
        return {status: 201, message: `Successfully added a new warehouse to ${childCompanyName}` }
    } catch(err) {
        console.log(err);
        mongoose.disconnect();
        return {status: 500, message: `Could not add warehouse to ${childCompanyName}`};
    }
} 


/**
 * 
 * @param {Object} req.body
 */
const addInventory = () => {

}

module.exports = {
    addWarehouse,   
}


