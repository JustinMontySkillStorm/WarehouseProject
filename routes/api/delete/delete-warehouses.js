const mongoDB = require('../../../helper/db-factory.js');
const router = require('express').Router();
const { Warehouse, ChildCompany } = require('../../../model/Company.js');

// removes a specific item from a warehouse location
router.delete('/api/warehouse/:location/:itemName', async (req,res) => {
    try {
        console.log(req.params.location, req.params.itemName);
        await mongoDB.connect();
        const warehouseToUpdate = await Warehouse.findOneAndUpdate({"locationStr": {$regex: req.params.location, $options: 'i'}}, {$pull: {"inventory": {"itemName": req.params.itemName}}}, {new:true});
        console.log(warehouseToUpdate);
        await warehouseToUpdate.save();
        mongoDB.disconnect();
        res.status(200).json({status: 200, message: `Successfully deleted ${req.params.itemName} from warehouse in ${warehouseToUpdate.locationStr}`});
    } catch(err) {
        console.log(err);
        res.status(500).json({status: 500, message: `Could not delete ${req.params.itemName} from the warehouse.`});
    }
})

// removes all items from a warehouse location
router.delete('/api/removeAll/:location', async (req,res) => {
    try {
        console.log(req.params.location);
        await mongoDB.connect();
        const warehouseToUpdate = await Warehouse.findOneAndUpdate({"locationStr": {$regex: req.params.location, $options: 'i'}}, {$set: {"inventory": []}}, {new: true});
        console.log(warehouseToUpdate);
        mongoDB.disconnect();
        res.status(200).json({status: 200, message: `Successfully removed all items from warehouse in ${warehouseToUpdate.locationStr}`});
    } catch(err) {
        console.log(err);
        res.status(500).json({status: 500, message: `There was an issue attempting to remove all items from the warehouse`});
    }
})


module.exports = router;
