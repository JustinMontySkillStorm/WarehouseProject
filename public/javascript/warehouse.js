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
    h2.innerHTML = `${params.get('owner')}'s ${params.get('location')} warehouse`;
    const inventoryDiv = document.createElement('div');

    
    inventory.forEach(({itemName, briefDescription, price, quantity}) => {
        const itemDiv = document.createElement('div');
        const name = document.createElement('p');
        const desc = document.createElement('p');
        const p = document.createElement('p');
        const q = document.createElement('p');

        const deleteBtn = document.createElement('button');
        deleteBtn.value = itemName;
        deleteBtn.onclick = deleteItem;
        deleteBtn.innerText= "Delete"

        name.innerHTML = `${itemName}<br>`;
        desc.innerHTML = `${briefDescription}<br>`;
        p.innerHTML = `${price}<br>`;
        q.innerHTML = `${quantity}<br>`;

        itemDiv.appendChild(name);
        itemDiv.appendChild(desc);
        itemDiv.appendChild(p);
        itemDiv.appendChild(q);
        itemDiv.appendChild(deleteBtn);
        inventoryDiv.appendChild(itemDiv);
    })

    
    rootDiv.appendChild(h2);
    rootDiv.appendChild(inventoryDiv);
}

const deleteItem = async (e) => {
    const serverResponse = await fetch(`/api/warehouse/${params.get('location')}/${e.target.value}`, {
        method: 'DELETE',
    })
    const resp = await serverResponse.json();
    console.log(resp);
    // how Sean removed it in the movie example.
    // console.log(e.target.parentNode.parentNode.parentNode);
    // console.log(e.target.parentNode); 
    e.target.parentNode.parentNode.removeChild(e.target.parentNode);
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