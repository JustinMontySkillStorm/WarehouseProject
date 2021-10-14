const params = new URLSearchParams(window.location.search);

const getChildWarehouses = async () => {
    const wholeChild = await((await fetch(`/${params.get('corg')}/storage`))).json();
    console.log(wholeChild)
    const mainDiv = document.getElementById('main-container');
    
    const currentlyViewing = document.createElement('h3');
    currentlyViewing.classList.add('text-center', 'pt-4');
    currentlyViewing.innerHTML = `${wholeChild.name} Warehouses'`;

    const businessSector = document.createElement('h4');
    businessSector.classList.add('text-center', 'pb-4');
    businessSector.innerHTML = `${wholeChild.businessSector}`;

    mainDiv.appendChild(currentlyViewing);
    mainDiv.appendChild(businessSector);

    const {storage} = wholeChild;

    const warehouseDiv = document.getElementById('root-node');


    storage.forEach(warehouse => {
        const div = document.createElement('div');
        div.classList.add('card','main-c');

        const cardBody = document.createElement('div');
        cardBody.classList.add('card-body');

        div.appendChild(cardBody);

        console.log(storage);
        const aTag = document.createElement('a');
        console.log(warehouse.locationStr);
        aTag.href = `/warehouse?location=${warehouse.locationStr}&owner=${wholeChild.name}`;
        aTag.innerHTML = `<span>Display Inventory</span>`;
        aTag.classList.add('btn','btn-col', 'btn-sm', 'text-light');

        const locationTag = document.createElement('h5');
        locationTag.innerHTML = `Warehouse location: ${warehouse.locationStr}`;
        locationTag.classList.add('card-title');

        const warehouseCapacity = document.createElement('h6');
        warehouseCapacity.innerHTML = `Capacity: ${warehouse.maxFloorSpace.toLocaleString()} units`;
        warehouseCapacity.classList.add('card-subtitle', 'mb-2', 'text-muted');


        const spaceUsed = warehouse.inventory.reduce((sum, { quantity })=> sum += quantity, 0)
        const floorSpaceLeft = document.createElement('h6');
        floorSpaceLeft.classList.add('card-subtitle','mb-2', 'text-muted');
        floorSpaceLeft.innerHTML = `Warehouse Space left: ${(warehouse.maxFloorSpace - spaceUsed).toLocaleString()}`

        cardBody.appendChild(locationTag);
        cardBody.appendChild(floorSpaceLeft);
        cardBody.appendChild(warehouseCapacity);
        cardBody.appendChild(aTag);
        div.appendChild(cardBody);
        warehouseDiv.appendChild(div);
    })

    mainDiv.appendChild(warehouseDiv);
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
