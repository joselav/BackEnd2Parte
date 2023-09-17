const form = document.getElementById("idForms");
const socket = io();

form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const dataForm = new FormData(e.target);
    const prod = Object.fromEntries(dataForm);
    console.log(prod)
    socket.emit('nuevoProducto', prod)
    e.target.reset();
})

socket.on('prod', (newProd)=>{
    const listProd = document.getElementById("listProd");

    const createDiv = document.createElement("div");
    createDiv.classList.add("prods");
    createDiv.innerHTML= 
    `<h2>${newProd.title}</h2>
    <p>CAT: ${newProd.category} REF: ${newProd.code} </p>
    <h4>${newProd.description}</h4>
    <p>Stock: ${newProd.stock}</p>`

    listProd.appendChild(createDiv)
})