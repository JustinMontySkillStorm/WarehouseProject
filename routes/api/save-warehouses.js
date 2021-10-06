const router = require('express').Router();
const { cpSync, copyFileSync } = require('fs');
const {resolve} = require('path');
const { addWarehouse, addInventory } = require('../../controllers/warehouse/save-warehouses.js');


// post route to listen to when we are trying to add a warehouse to a child company.
router.post('/api/save/storage', async (req,res) => {
    try {
        const dbFeedback = await addWarehouse(req.body);
        console.log(dbFeedback);
        res.status(201).json(dbFeedback);
    } catch(err) {
        console.log(err);
        res.status(500).json(err);
    }
    
})

// post route to listen to when we are trying to save an item to a warehouse.
router.post('/api/save/inventory', async (req, res) => {
    try {
        // find correct warehouse.  
        // build the item and push it into the warehouse's inventory array. 
        const dbFeedback = await addInventory(req.body);
        console.log(dbFeedback);
        res.status(201).json(dbFeedback);
    } catch(err) {
        /**
         * custom error object with 
         * status of 500 
         * and a message detailing that we can't add ite, because inventory is full. 
         */
        res.status(500).json(err);
    }
})

module.exports = router;