const mongoFactory = require('../../helper/db-factory');
const mongoose = require('mongoose');
const { Warehouse, ChildCompany } = require('../../model/Company.js')
require('dotenv').config();

// monogoose factory function
const mongoDB = mongoFactory(process.env.MONGO_URI);

/**
 * adds the warehouse object into the correct child company array.  
 * stores the ObjectId into companies storage collection.  
 * 
 * @param {Object} req.body will be passed in here and then we deconstruct it to grab our values.
 * @returns  an object with a success code and message or a reject object with a status code and message
 */
const addWarehouse = async ({ owner, warehouse: {locationStr: location, typeOfItems: items, maxFloorSpace: floorSpace} }) => {
    // request needs to have which childCompany to add warehouse to.  
    try {
        await mongoDB.connect();
        // find childCompany. 
        const cc = await ChildCompany.findOne({name: owner});
        console.log(cc)
        console.log("CC object", cc);

        
        // create warehouse 
        const warehouse = new Warehouse({ownerOfWarehouse: cc._id,locationStr: location, typeOfItems: items, maxFloorSpace: floorSpace})
        const id = new mongoose.Types.ObjectId();
    
        // save warehouse to its collection. keep _id 
        warehouse._id = id;
        console.log(warehouse._id);
        let childCompanyName = null;

        // add warehouse._id to correct childCompany storage
        cc.storage.push(id);
        childCompanyName = cc.name;

        // save the document and return 201
        await warehouse.save();
        await cc.save();
        mongoDB.disconnect();
        return {status: 201, message: `Successfully added a new warehouse to ${childCompanyName}` }
    } catch(err) {
        console.log("error properties", err.errors);
        mongoose.disconnect();
        return {status: 500, message: `Could not add warehouse to our database because of an error.`};
    }
} 


/**
 * adds a single item into the warehouse. 
 * 
 * @param {Object} req.body passes in the request body and we destructure it to create an item and then add it to our database
 * @returns a warehouse that matches the locationStr passed in from the requestbody
 */
const addInventory = async ({locationStr: location, itemName: item, briefDescription: desc, price, quantity}) => {
    try {
        await mongoDB.connect();
        const warehouse = await Warehouse.findOne({locationStr: location});
        warehouse.inventory.push({itemName: item, briefDescription: desc, price, quantity});
        console.log(warehouse.inventory)
        await warehouse.save();
        mongoDB.disconnect();
        return {status: 201, message: `Successfully added ${item} into the warehouse located in ${location}`};
    } catch(err) {
        mongoDB.disconnect();
        throw {status: 500, message: `Could not add your item because it would exceed maxFloorSpace avaiable in warehouse`};
    }
}

module.exports = {
    addWarehouse,  
    addInventory, 
}


