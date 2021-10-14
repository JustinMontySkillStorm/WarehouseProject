const params = new URLSearchParams(window.location.search);

/**
 * displays all the inventory in the warehouse.storage array into a table 
 * for the users to be able to interact with.
 */
const displayItems = async () => {
    const specificWarehouse = await fetch(`/${params.get('location')}/inventory`);
    const jsonData = await specificWarehouse.json();
    console.log(jsonData);

    const {inventory} = jsonData;


    const rootDiv = document.querySelector('#root-node');
    const h2 = document.createElement('h2');
    h2.innerHTML = `${params.get('location')} warehouse`;

    const h5 = document.createElement('h5');
    h5.innerHTML = `Max Floorspace: ${jsonData.maxFloorSpace.toLocaleString()}`;
    h5.classList.add('text-muted');

    const removeAllBtn = document.createElement('button');
    removeAllBtn.setAttribute('id','remove-all');
    removeAllBtn.classList.add('btn-col','text-light');
    removeAllBtn.innerText = 'Remove All Items'
    removeAllBtn.onclick = removeAll

    const tableBody = document.querySelector('#table-body');

    inventory.forEach(({itemName, briefDescription, price, quantity}) => {
        const itemRow = document.createElement('tr');
        const thRow = document.createElement('th');
        thRow.setAttribute('scope', "row");
        const name = document.createElement('td');
        const desc = document.createElement('td');
        const p = document.createElement('td');
        const q = document.createElement('td');

        const deleteBtn = document.createElement('button');
        deleteBtn.value = itemName;
        deleteBtn.onclick = deleteItem;
        deleteBtn.innerHTML= `<span> <img src=./images/trash.svg> </span>`;

        thRow.appendChild(deleteBtn);

        name.innerHTML = `${itemName}`;
        desc.innerHTML = `${briefDescription}`;
        p.innerHTML = `$${price.toLocaleString()}`;
        q.innerHTML = `${quantity.toLocaleString()}`;

        itemRow.appendChild(thRow);
        itemRow.appendChild(name);
        itemRow.appendChild(desc);
        itemRow.appendChild(p);
        itemRow.appendChild(q);

        tableBody.appendChild(itemRow);
    })
    rootDiv.appendChild(h2);
    rootDiv.appendChild(h5);
    rootDiv.appendChild(removeAllBtn);
}

/**
 * event handler to delete the current row item on the screen and in our database
 * 
 * @param {*} e event that we are using to find the value of the button click and fire off 
 * a DELETE request to. 
 */
const deleteItem = async (e) => {
    const value = e.target.parentNode.parentNode.value;
    console.log(value);
    const serverResponse = await fetch(`/api/warehouse/${params.get('location')}/${value}`, {
        method: 'DELETE',
    })

    const resp = await serverResponse.json();
    console.log(resp);

    // remove the row from the table body when the delete button is pressed
    // how Sean removed it in the movie example.
    e.target.parentNode.parentNode.parentNode.parentNode.parentNode.removeChild(e.target.parentNode.parentNode.parentNode.parentNode);
}

/**
 * fires off a post request to add the data from our HTML form.
 * will reset the form and reload the page displaying new item in the table. 
 * 
 * @param {*} e event thats passed in from our HTML elements
 */
const addItem = async (e) => {
    e.preventDefault();

    // no validation for user inputs over here.

    const form = document.querySelector('#inventory-form');
    const data = new FormData(form);

    const locationStr = params.get('location');
    value = Object.fromEntries(data.entries());
    value.locationStr = locationStr;

    const response = await fetch('/api/inventory', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(value),
    })

    const apiFeedback = await response.json();

    if(apiFeedback.status === 500) {
        // grab the modal I have and show it to user with the error message
        // if the inventory is maxed out
        addErrorMessageToModal(apiFeedback.message);
    } else {
        form.reset();
        location.reload();
    }

    
}

/**
 * fires off a PUT request and updates the item in our warehouse.inventory.  
 * 
 * @param {*} e eventHandler passed in from the onClick event
 */
const updateItem = async (e) =>{
    e.preventDefault();

    const form = document.querySelector('#inventory-form');
    const data = new FormData(form);

    const value = Object.fromEntries(data.entries());

    /**
     * if input was left empty. Will be removed before we send request body
     */
    for(let prop in value) {
        if(!value[prop]) {
            delete value[prop]
        }
    }
    console.log(value);

    const serverResponse = await fetch(`/api/warehouse/updateInventory/${params.get('location')}/${value.itemName}`, {
        method: "PUT",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(value)
    })

    const apiFeedback = await serverResponse.json();
    console.log(apiFeedback);
    if(apiFeedback.status === 404) {
        addErrorMessageToModal(apiFeedback.message);
    } else {
        form.reset();
        location.reload();
    }
}

/**
 * Fires off a DELETE request that will remove all the items currently in the warehouse
 */
const removeAll = async () => {
    console.log('remove all');

    const response = await fetch(`/api/removeAll/${params.get('location')}`, {
        method: "DELETE"
    })

    const jsonRes = await response.json();

    console.log(jsonRes);

    location.reload();
}

/**
 * event listener section for this page
 */
const postItem = document.querySelector('#add-item');
postItem.addEventListener('click', addItem);

const updateBtn = document.querySelector('#update-item');
updateBtn.addEventListener('click', updateItem);

document.addEventListener('DOMContentLoaded', async ()=> {
    await displayItems();
})

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
 * Data needs to be sent in this shape to the backend
 * 
 * {
 *  locationStr: "Rock Hill, SC",
 *  itemName: "devs",
 *  briefDescription: "dogshit devs",
 *  price: "0",
 *  quantity: "2"
 * }
 */

