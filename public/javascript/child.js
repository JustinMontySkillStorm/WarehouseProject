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

    const locationDiv = document.createElement('div')
    const location = document.createElement('h4');

    locationDiv.appendChild(location);


    storage.forEach(warehouse => {
        console.log(storage);
        const aTag = document.createElement('a');
        console.log(warehouse.locationStr);
        aTag.href = `/warehouse?location=${warehouse.locationStr}&owner=${wholeChild.name}`;
        aTag.innerHTML = `<span>${warehouse.locationStr}</span>`;
        console.log(aTag);

        const locationPTag = document.createElement('p');
        locationPTag.innerHTML = `Warehouse location: `;
        locationPTag.appendChild(aTag);
        locationPTag.appendChild(document.createElement('br'));

        const warehouseCapacity = document.createElement('p');
        warehouseCapacity.innerHTML = `Capacity: ${warehouse.maxFloorSpace.toLocaleString()} units`;


        locationDiv.appendChild(locationPTag);
        locationDiv.appendChild(warehouseCapacity);

        const spaceUsed = warehouse.inventory.reduce((sum, { quantity })=> sum += quantity, 0)
        const floorSpaceLeft = document.createElement('p');
        floorSpaceLeft.innerHTML = `Warehouse Space left: ${(warehouse.maxFloorSpace - spaceUsed).toLocaleString()}`
        locationDiv.appendChild(floorSpaceLeft);
    })

    rootDiv.appendChild(locationDiv);
}

document.addEventListener('DOMContentLoaded', (req,res) => {
    getChildWarehouses();
})
