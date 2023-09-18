const socket = io();
const form = document.getElementById("idForms");


form.addEventListener('submit', (e)=>{
    e.preventDefault();
    const dataForm = new FormData(e.target);
    const prod = Object.fromEntries(dataForm)
    console.log(prod)
    socket.emit("newProduct", prod)
    e.target.reset();
})

socket.on('prod', (data)=>{
    console.log('Nuevo producto recibido desde el servidor:', data);
    const listProd = document.getElementById("listProd");

    const createDiv = document.createElement("div");
    createDiv.classList.add("prods");
    createDiv.innerHTML= 
    `<h2>${data.title}</h2>
    <p>CAT: ${data.category} REF: ${data.code} </p>
    <h4>${data.description}</h4>
    <p>Stock: ${data.stock}</p>`

    listProd.appendChild(createDiv)
})