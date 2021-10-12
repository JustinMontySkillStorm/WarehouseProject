console.log('working');
const params = new URLSearchParams(window.location.search);

console.log(params.get('location'));
// console.log(params.get('owner'));


const displayItems = async () => {
    const specificWarehouse = await fetch(`/${params.get('location')}/inventory`);
    const jsonData = await specificWarehouse.json();

    const {inventory} = jsonData;


    const rootDiv = document.querySelector('#root-node');
    const h2 = document.createElement('h2');
    h2.innerHTML = `${params.get('location')} warehouse`;

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
}

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

// add an item to our database.
const addItem = async (e) => {
    e.preventDefault();
    console.log('hitting this');

    const form = document.querySelector('#inventory-form');
    const data = new FormData(form);

    const locationStr = params.get('location');
    value = Object.fromEntries(data.entries());
    value.locationStr = locationStr;

    console.log(JSON.stringify(value));

    const response = await fetch('/api/inventory', {
        method: "POST",
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(value),
    })

    const apiFeedback = await response.json();
    console.log(apiFeedback);

    form.reset();
    location.reload();
}

const updateItem = async (e) =>{
    e.preventDefault();
    console.log('going to update this item');

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

    form.reset();
    location.reload();
}

const postItem = document.querySelector('#add-item');
postItem.addEventListener('click', addItem);

const updateBtn = document.querySelector('#update-item');
updateBtn.addEventListener('click', updateItem);

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

document.addEventListener('DOMContentLoaded', async ()=> {
    await displayItems();
})