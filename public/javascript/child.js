console.log('working correctly');
const params = new URLSearchParams(window.location.search);

console.log(params.has('corg'));
console.log(params.get('corg'));

const getChildWarehouses = async () => {
    const wholeChild = await((await fetch(`/${params.get('corg')}/storage`))).json();
    console.log(wholeChild);
}


document.addEventListener('DOMContentLoaded', (req,res) => {
    getChildWarehouses();
})

