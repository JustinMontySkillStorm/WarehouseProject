const mongoDB = require('../../../helper/db-factory.js');
const router = require('express').Router();
const { Warehouse, ChildCompany } = require('../../../model/Company.js');

// remove a whole warehouse
router.delete('/api/warehouse/:location', async (req,res)=> {
    // find the warehouse by location
    // get the warehouse _id
    // find the id in childCompanies.storage and remove that item.  

    // could abstract this away into controllers.  
    try {
        await mongoDB.connect();
        const warehouseToDelete = await Warehouse.findOneAndDelete({"locationStr": {$regex: req.params.location, $options: 'i'}});
        console.log(warehouseToDelete);
        const ownerOfWarehouse = await ChildCompany.findOne({"storage": warehouseToDelete._id});
        console.log(ownerOfWarehouse);
        ownerOfWarehouse.storage = ownerOfWarehouse.storage.filter((id)=> {
            // need to do String(objectId) === String(objectId);
            // to make sure they are equal and removed from the storage array.  
            return String(id) !== String(warehouseToDelete._id);
        })
        await ownerOfWarehouse.save();
        res.status(200).json({message: `Successfully deleted warehouse with an id of ${warehouseToDelete._id}`});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: "Unable to delete warehouse from our database"});
    }
})

// __v in mongo is how many revisions the document has been through. 

// removes a specific item from a warehouse location
router.delete('/api/warehouse/:location/:itemName', async (req,res) => {
    try {
        console.log(req.params.location, req.params.itemName);
        await mongoDB.connect();
        const warehouseToUpdate = await Warehouse.findOne({"locationStr": {$regex: req.params.location, $options: 'i'}});
        console.log(warehouseToUpdate);
        const updatedArray = warehouseToUpdate.inventory.filter(({itemName})=> itemName != req.params.itemName);
        warehouseToUpdate.inventory = updatedArray;
        await warehouseToUpdate.save();
        mongoDB.disconnect();
        res.status(200).json({status: 200, message: `Successfully deleted ${req.params.itemName} from warehouse in ${warehouseToUpdate.locationStr}`});
    } catch(err) {
        console.log(err);
        res.status(500).json({status: 500, message: `Could not delete ${req.params.itemName} from the warehouse.`});
    }
})

// removes all items from a warehouse location
router.delete('/api/warehouse/:location/all', async (req,res) => {
    try {
        console.log(req.params.location);
        await mongoDB.connect();
        const warehouseToUpdate = await Warehouse.findOne({"locationStr": {$regex: req.params.location, $options: 'i'}});
        const inventorySz = warehouseToUpdate.inventory.length;
        warehouseToUpdate.inventory.splice(0, inventorySz);
        console.log(warehouseToUpdate.inventory);
        await warehouseToUpdate.save();
        mongoDB.disconnect();
        res.status(200).json({status: 200, message: `Successfully removed all items from warehouse in ${warehouseToUpdate.locationStr}`});
    } catch(err) {
        console.log(err);
        res.status(500).json({status: 500, message: `There was an issue attempting to remove all items from the warehouse`});
    }
})


module.exports = router;
