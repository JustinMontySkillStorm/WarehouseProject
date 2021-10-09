// gets the parent organization and displays them to the screen.
const getParent = async (parentName) => {
    try {
        const parentToDisplay = await fetch(`/parent/${parentName}`);
        const parentJson = await parentToDisplay.json();

        console.log(parentJson);
    
        const rootNode = document.getElementById('root-node');
        const parentOrg = document.createElement('h2');
        parentOrg.innerText = parentJson.name;
        rootNode.appendChild(parentOrg);
        parentJson.childCompanies.forEach((child) => {
            const div = document.createElement('div');
            const a = document.createElement('a');
            a.href = `/child?corg=${child.name}`;
            a.innerHTML = `<span> Show Warehouses </span>`
        
            
            const childName = document.createElement('h5');
            const childBusinessSector = document.createElement('h6');
    
            childName.innerText = child.name;
            childBusinessSector.innerText = child.businessSector;
    
            div.appendChild(childName);
            div.appendChild(childBusinessSector);
            div.appendChild(a);
            rootNode.appendChild(div);
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
    await getParent('Respawn Entertainment');
    await getParent('Huggies Inc');
})

