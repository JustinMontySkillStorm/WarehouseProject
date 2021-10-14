/**
 * using this to search for query parameters on the page.  
 */
const params = new URLSearchParams(window.location.search);

/**
 * Method to dynamically print all of the children and their warehouses' to the screen.
 */
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

/**
 * onClick handler for our button with an id of add-storage
 * 
 * @param {*} e JavaScript event being emitted from an event handler
 * @returns if unsuccessfull a modal will appear to the user.  if successful form will reset and location will reload.
 */
const handleAddStorage = async (e) => {
    e.preventDefault();

    const form = document.querySelector('#warehouse-form');
    const data = new FormData(form);

    const owner = params.get('corg');
    const value = Object.fromEntries(data.entries());

    console.log(value);

    if(!value.floorSpace && !value.locationStr) {
        addErrorMessageToModal('These inputs are required');
        return; 
    }

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
    
    if(apiFeedback.status === 500) {
        addErrorMessageToModal(apiFeedback.message);
        return;
    } else {
        form.reset();
        location.reload();
    }
}

/**
 * function to show the modal with the passed in error message.
 * 
 * @param {*} errMsg to place into the innerHTML of the modal body.
 */
const addErrorMessageToModal = (errMsg) => {
    const errModalBody = document.querySelector('#error-message');
    errModalBody.innerHTML = `<p>${errMsg}</p>`;
        
    const errModal = new bootstrap.Modal(document.querySelector('#error-modal'));
    errModal.show();
}

/**
 * eventListener placed on the button with an id of add-storage in our html
 * to fire off a post request to our backend.
 */
const addStorage = document.getElementById('add-storage');
addStorage.addEventListener('click', handleAddStorage);

// event listener for the DOM when anything loads on the page we will call getChildWarehouses
document.addEventListener('DOMContentLoaded', (req,res) => {
    getChildWarehouses();
})
