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

// removes a specific item from a warehouse location
router.delete('/api/warehouse/:location/:itemName', async (req,res) => {
    try {
        console.log(req.params.location, req.params.itemName);
        await mongoDB.connect();
        const warehouseToUpdate = await Warehouse.findOne({"locationStr": {$regex: req.params.location, $options: 'i'}});
        console.log(warehouseToUpdate);
        res.status(200).json(warehouseToUpdate);
    } catch(err) {
        console.log(err);
    }
})

// removes all items from a warehouse location
router.delete('/api/warehouse/:location/all', (req,res) => {

})


module.exports = router;
