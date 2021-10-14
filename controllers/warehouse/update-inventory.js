/**
 * helper function to abstract away what is going on behind the scenes. I'm checking to see if we have that item
 * and then removing it from the array and returning an updated array with the .filter method.
 *  
 * @param {Warehouse} warehouse Warehouse object that matches my mongoose Schema
 * @param {String} itemName  itemName that we want to update
 * @returns an object with the updatedInventory
 */
const updateInventory = (warehouse, itemName) => {
    const itemToUpdate =  warehouse.inventory.find((obj) => {
        return itemName === obj.itemName;
    })

    const updatedInventory = warehouse.inventory.filter((obj)=> {
        return itemName !== obj.itemName;
    })

    return {
        itemToUpdate,
        updatedInventory,
    }
}

module.exports = updateInventory