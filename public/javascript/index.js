// gets the parent organization and displays them to the screen.
const getParent = async (parentName) => {
    try {
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
            div.appendChild(cardBody);

            // still fine here. 
            const a = document.createElement('a');
            a.href = `/child?corg=${child.name}`;
            a.innerHTML = `<span> Show Warehouses </span>`
            a.classList.add('btn', 'btn-primary', 'btn-sm');
            
        
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

// POST new child companies 
const handleAddChild = async (e) => {
    e.preventDefault();

    const form = document.querySelector('#child-form');
    const data = new FormData(form);

    const parentName = data.get('pName');
    const childName = data.get('cName');
    const bizSector = data.get('businessSector');

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
    console.log(apiFeedback);

    form.reset();
    location.reload();
}

const addBtn = document.querySelector('#add-child');
addBtn.addEventListener('click', handleAddChild);

document.addEventListener('DOMContentLoaded', async ()=> {
    Promise.all([ getParent('Respawn Entertainment'), getParent('Huggies Inc')])
    .then(()=> {
        console.log('Printing parent orgs to the screen.');
    }).catch(err => {
        console.log(err);
    })
})
