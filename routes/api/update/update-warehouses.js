const mongoDB = require('../../../helper/db-factory.js');
const router = require('express').Router();
const mongoose = require('mongoose');
const updatedInventory = require('../../../controllers/warehouse/update-inventory.js');
const { Warehouse } = require('../../../model/Company.js');

// updating the maxFloorSpace in a warehouse
router.put('/api/warehouse/updateSpace/:location', async(req, res) => {
    try {
        await mongoDB.connect();
        console.log(req.params);
        console.log(req.body);
        // regex expression to find something that matches if the location is slightly off for the warehouse
        await Warehouse.findOneAndUpdate({"locationStr": {$regex: req.params.location, $options: 'i'}}, {"maxFloorSpace": req.body.newFloorSpace});
        res.status(200).json({messsage: `Successfully changed updated warehouse floor space to ${req.body.newFloorSpace}`});
    } catch(err) {
        console.log(err);
        re.status(500).json(err);
    }
})

// updating a specifc item in a warehouse location
router.put('/api/warehouse/updateInventory/:location/:itemName', async(req,res)=> {
    try {
        await mongoDB.connect();
        const warehouse = await Warehouse.findOne({locationStr: {$regex: req.params.location, $options: 'i'}});

        const inventoryObj = updatedInventory(warehouse, req.params.itemName);

        console.log(warehouse.inventory);

        if(!inventoryObj.itemToUpdate) {
             res.status(404).json({status: 404, message: `Cannot find ${req.params.itemName} in the warehouse located in ${warehouse.locationStr}`})
             return;
        }

        let totalValuesUpdated = 0;
        for(let k in req.body) {
            totalValuesUpdated++;
            inventoryObj.itemToUpdate[k] = req.body[k];
        }

        warehouse.inventory = inventoryObj.updatedInventory;
        warehouse.inventory.push(inventoryObj.itemToUpdate);

        await warehouse.save();
        mongoDB.disconnect();
        res.status(200).json({status: 200, message: `We updated ${totalValuesUpdated} field on the old item name of ${req.params.itemName}`});
    } catch(err) {
        console.log(err);
        res.status(500).json({message: `There was an error trying to update item name of ${req.params.itemName}`});
    }
})

module.exports = router;