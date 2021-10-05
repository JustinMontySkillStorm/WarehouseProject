const { Schema } = require('mongoose');


const WarehouseSchema = new Schema({
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
        }],
        validate: {
            validator: () => this.inventory === this.maxFloorSpace
        },
        message: 'Cannot exceed maxFloorSpace available in this warehouse',
    }
})

module.exports = WarehouseSchema;