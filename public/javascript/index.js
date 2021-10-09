const getParent = async (parentName) => {
    const parentToDisplay = await (await fetch(`/parent/${parentName}`)).json();
    console.log(parentToDisplay);

    const rootNode = document.getElementById('root-node');
    const parentOrg = document.createElement('h2');
    parentOrg.innerText = parentToDisplay.name;
    rootNode.appendChild(parentOrg);
    parentToDisplay.childCompanies.forEach((child) => {
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
}

// POST new child companies 
// POST new warehouses

// PUT child companies
// PUT warehouses

// DELETE child companies
// DELETE warehouses


// const viewChild = async (e) => {
//     document.getElementById('root-node').innerHTML = '';
//     console.log(e.target.textContent)
//     const childCompany = await (await fetch(`/${e.target.textContent}/storage`)).json();
//     console.log(childCompany);

//     const rootNode = document.getElementById('root-node');
//     const childDiv = document.createElement('div');
    
//     const h2 = document.createElement('h3');
//     h2.innerText = childCompany.name;
//     const h3 = document.createElement('h4');
//     h3.innerText = childCompany.businessSector;

//     childDiv.appendChild(h2);
//     childDiv.appendChild(h3);

//     childCompany.storage.forEach(({locationStr, maxFloorSpace, storage}) => {
//         const location =  document.createElement('p');
//         const maxWarehouseSpace = document.createElement('p');
//         location.innerHTML = `Warehouse Location: ${locationStr}`;
//         maxWarehouseSpace.innerText = `Max Floor Space: ${maxFloorSpace}`;

//         childDiv.appendChild(location);
//         childDiv.appendChild(maxWarehouseSpace);
//     })
    
//     rootNode.appendChild(childDiv);
// }


document.addEventListener('DOMContentLoaded', ()=> {
    getParent('Respawn Entertainment');
    getParent('Huggies Inc');
})