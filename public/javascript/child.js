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


const handleAddStorage = async (e) => {
    e.preventDefault();

    const form = document.querySelector('#warehouse-form');
    const data = new FormData(form);

    const owner = params.get('corg');
    const value = Object.fromEntries(data.entries());

    // console.log(owner, value);

    const apiData = {
        owner: owner,
        warehouse: value,
    }

    const response = await fetch('/api/storage', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(apiData),
    })

    const apiFeedback = await response.json();
    console.log(apiFeedback);

    form.reset();
    location.reload();
}

const addStorage = document.getElementById('add-storage');
addStorage.addEventListener('click', handleAddStorage);

document.addEventListener('DOMContentLoaded', (req,res) => {
    getChildWarehouses();
})
