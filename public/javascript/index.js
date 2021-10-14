/**
 * function that is called when the domcontent is loaded.  Only grabbing 2 of the parentCompanies in our database 
 * dynamically creating our Active Organizations columns for interacting with on our home page.
 * @param {*} parentName the parentName of an organization to display to the screen.  
 * 
 */
const getParent = async (parentName) => {
    try {
        // a get to this route will also cause the childCompanies array of Object Ids to be populated to the screen
        const parentToDisplay = await fetch(`/parent/${parentName}`);
        const parentJson = await parentToDisplay.json();

        const rootNode = document.getElementById('root-node');
        const parentDiv = document.createElement('div');
        parentDiv.classList.add('col-md');
        const parentOrg = document.createElement('h3');
        parentOrg.classList.add('py-sm-3');
        parentOrg.innerText = parentJson.name;

        parentDiv.appendChild(parentOrg);
        rootNode.appendChild(parentDiv);

        parentJson.childCompanies.forEach((child) => {
            const div = document.createElement('div');
            div.classList.add('card', 'main-c');

            const cardBody = document.createElement('div');
            cardBody.classList.add('card-body');

            const a = document.createElement('a');
            a.href = `/child?corg=${child.name}`;
            a.innerHTML = `<span> Show Warehouses </span>`
            a.classList.add('btn', 'btn-col', 'btn-sm', 'text-light');
            
        
            const childName = document.createElement('h5');
            childName.classList.add('card-title');
            const childBusinessSector = document.createElement('h6');
            childBusinessSector.classList.add('card-subtitle', 'mb-2', 'text-muted');
    
            childName.innerText = child.name;
            childBusinessSector.innerText = child.businessSector;
    
            cardBody.appendChild(childName);
            cardBody.appendChild(childBusinessSector);
            cardBody.appendChild(a);
            div.appendChild(cardBody);
            parentDiv.appendChild(div);
            rootNode.appendChild(parentDiv);
        })
    } catch(err) {
        console.log(err);
    }
}

/**
 * if unsuccessful a modal will be displayed to the user with some information to help them out
 * if successful then the form will reset and the location will reload so you can see the child added to the parent company.
 * 
 * @param {*} e eventListener object that is passed in from the button onClick. 
 * @returns nothing. 
 */
const handleAddChild = async (e) => {
    e.preventDefault();

    const form = document.querySelector('#child-form');
    const data = new FormData(form);

    const parentName = data.get('pName');
    const childName = data.get('cName');
    const bizSector = data.get('businessSector');

    if(!parentName || !childName || !bizSector) {
            addErrorMessageToModal('All inputs are required');
            return;
    }

    const apiData = {
        pName: parentName,
        child: {
            cName: childName,
            businessSector: bizSector
        }
    }

    const response = await fetch('/api/child', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(apiData),
    })

    const apiFeedback = await response.json();

    if(apiFeedback.status === 404) {
        addErrorMessageToModal(apiFeedback.message);
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

// adding eventListener to our button with an id of add-child
const addBtn = document.querySelector('#add-child');
addBtn.addEventListener('click', handleAddChild);

// will load our parent content when the DOM content is loaded
document.addEventListener('DOMContentLoaded', async ()=> {
    // for some reason promise.all was causing a bug with mongoose. 
    // Promise.all([  getParent('Huggies Inc'), getParent('Respawn Entertainment')])
    // .then(promise => {
    //     console.log("Printing parent orgs to screen");
    // }).catch(err => {
    //     console.log(err);
    // });

    await getParent("Kraft Foods Inc");
    await getParent('PepsiCo');
})
