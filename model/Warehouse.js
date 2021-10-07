const { Schema } = require('mongoose');


const WarehouseSchema = new Schema({
    ownerOfWarehouse: {type: Schema.Types.ObjectID, ref: "ChildCompany"},
    locationStr: {
        type: String,
        required: [true, "Must provide where the warehouse is located"],
    },
    typeOfItems: String,
    maxFloorSpace: {
        type: Number,
        required: [true, 'Must provide how large warehouse is'],
        validate: {
            validator: (v) => v > 0
        },
        message: 'maxFloorSpace cannot be lower than 0'
    },
    inventory: {
        type: [{
            itemName: String,
            briefDescription: String,
            price: Number,
            quantity: Number, 
        }],
        validate: {
            // have to use a regular function here because of the weird behavior with the arrow 
            // func and this keyword to compare against other keys in the schema
            validator: function(v) {
                if(v === undefined) {
                    return true;
                } else {
                   const total = v.reduce((sum, { quantity })=> sum += quantity, 0);
                   return total <= this.maxFloorSpace;
                }     
            },
            message: () => `Cannot add item because it would exceed maxFloorSpace available in warehouse.`,
        },
        
    }
})

module.exports = WarehouseSchema;