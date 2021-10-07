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