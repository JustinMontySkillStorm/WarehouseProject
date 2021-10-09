const params = new URLSearchParams(window.location.search);

const getChildWarehouses = async () => {
    const wholeChild = await((await fetch(`/${params.get('corg')}/storage`))).json();
    console.log(wholeChild)
    const rootDiv = document.getElementById('root-node');
    
    const currentlyViewing = document.createElement('h3');
    currentlyViewing.innerHTML = `${wholeChild.name} Warehouses'`;

    const businessSector = document.createElement('h4');
    businessSector.innerHTML = `${wholeChild.businessSector}`;

    rootDiv.appendChild(currentlyViewing);
    rootDiv.appendChild(businessSector);

    const {storage} = wholeChild 

    const itemDiv = document.createElement('div');
    const location = document.createElement('h4');



    storage.forEach(warehouse => {
        location.innerHTML = `Warehouse Location: ${warehouse.locationStr}<br> Max Floor Space: ${warehouse.maxFloorSpace.toLocaleString()} units`;

        warehouse.inventory.forEach(item => {
            const itemPTag = document.createElement('p');
            itemPTag.innerText = `
            Item Name: ${item.itemName}\n
            Description: ${item.briefDescription}\n
            Price: $${item.price.toLocaleString()}\n
            Stock: ${item.quantity.toLocaleString()}\n
            `
            itemDiv.appendChild(itemPTag);
        })
    })

    rootDiv.appendChild(location);
    rootDiv.appendChild(itemDiv);
}


// POST New Items
// PUT Existing ITEMS

// DELETE Single item
// DELETE All items 

document.addEventListener('DOMContentLoaded', (req,res) => {
    getChildWarehouses();
})
