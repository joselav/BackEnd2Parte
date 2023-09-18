import { Router } from "express";
import { cartModel } from "../models/cart.models.js"; 
import { productsModel } from "../models/products.models.js"; 
import mongoose from "mongoose";

const cartRouter= Router();

cartRouter.get('/', async (req, res)=>{
    const {limit} = req.query
  try {
    const carts = await cartModel.find().limit(limit)
    res.status(200).send({respuesta:'Se han encontrado los productos del carrito', mensaje: carts })
  
  }catch(error){res.status(400).send({respuesta: 'No se ha logrado encontrar los productos del carrito', mensaje: error})}
})

cartRouter.post('/', async (req,res)=>{
  try{
    const carts = await cartModel.create({})
    res.status(200).send({respuesta: 'Se ha creado el carrito', mensaje: carts})
  }catch(error){res.status(400).send({respuesta:'No se ha logrado crear el carrito', mensaje: error})}
})


cartRouter.get('/:cid', async (req, res)=>{
  const {cid} = req.params
  try{
    const cart= await cartModel.findById(cid)
    if(cart){
      res.status(200).send({respuesta:'Se ha encontrado el id correspondiente', mensaje: cart})
    }else{res.status(404).send({respuesta: 'No se ha logrado encontrar el id', mensaje: error})}
  }catch(error){res.status(400).send({respuesta: 'No se ha logrado encontrar el carrito', mensaje: error})}
})



cartRouter.post('/:cid/products/:pid', async (req,res)=> {
  const {cid, pid} = req.params;
  const {quantity} = req.body;

  try{
    const cart = await cartModel.findById(cid);

    if(!cart){res.status(404).send({respuesta:'No se ha encontrado el id', mensaje: "Id no encontrado"});
  return;}


      const prod = await productsModel.findById(pid);
      
      if(prod){
        const index = cart.products.findIndex((prod)=> prod.id_prod.equals(pid))
        if(index !== -1){
          cart.products[index].quantity = quantity;
        }else {
          cart.products.push({id_prod: pid, quantity: quantity})
        }
        const respuesta = await cartModel.findByIdAndUpdate(cid, {products: cart.products}) //Actualizar el carrito
        res.status(200).send({ respuesta: 'Se ha creado el producto exitosamente', mensaje: respuesta })

    }
  }catch(error){res.status(400).send({respuesta: 'No se ha logrado encontrar el producto', mensaje: error})}
  
  
})

cartRouter.put('/:cid', async (req,res)=>{
  const {cid} = req.params;
  const {id_prod, quantity} = req.body;

  try{
    const cart = await cartModel.findById(cid);
    
    if(!cart){
      res.status(404).send({respuesta: 'No se ha encontrado carrito', mensaje: 'Carrito no encontrado'});
    }

    const ppid = new mongoose.Types.ObjectId(id_prod)
    
    const prodIndex = cart.products.findIndex((prod)=> prod.id_prod.equals(ppid));

    if(prodIndex == -1){res.status(404).send({respuesta: 'No se ha encontrado producto en el carrito', mensaje: 'Producto no encontrado'});}

    cart.products[prodIndex].quantity = quantity;

    res.status(200).send({respuesta: 'Carrito actualizado con éxito', mensaje: cart})
    await cart.save()
  }catch(error){
    console.error("ERROR AL ACTUALIZAR", error)
    res.status(400).send({respuesta: 'No se ha logrado actualizar el producto deseado', mensaje: "error"})
  }
})



cartRouter.put('/:cid/products/:pid', async (req,res)=>{
  const {cid, pid} = req.params;
  const {quantity} = req.body;

  try{
    const cart = await cartModel.findById(cid);
    
    if(!cart){
      res.status(404).send({respuesta: 'No se ha encontrado carrito', mensaje: 'Carrito no encontrado'});
    }

    const ppid= new mongoose.Types.ObjectId(pid);
    
    const prodIndex = cart.products.findIndex( (prod) =>  prod.id_prod.equals(ppid));

    if(prodIndex === -1){res.status(404).send({respuesta: 'No se ha encontrado producto en el carrito', mensaje: 'Producto no encontrado'});}

    cart.products[prodIndex].quantity = quantity;

    res.status(200).send({respuesta: 'Carrito actualizado con éxito', mensaje: cart})
    await cart.save()
  }catch(error){
    res.status(400).send({respuesta: 'No se ha logrado actualizar el producto deseado', mensaje: "error"})
  }
})

cartRouter.delete('/:cid', async (req, res)=>{
  const {cid} = req.params; 
  
  try{
    const prodDel = await cartModel.findByIdAndDelete(cid);
    if(prodDel){
      res.status(200).send({respuesta:'Se ha eliminado el producto exitosamente', mensaje: 'Producto eliminado'})
    }else{
      res.status(404).send({respuesta: 'Ha ocurrido un error al eliminar el producto', mensaje: error})
    }
  }catch{
    res.status(400).send({respuesta: 'No se ha logrado eliminar el producto', mensaje: error})
  }
})


cartRouter.delete('/:cid/products/:pid', async (req, res)=>{
  const {cid,pid} = req.params;

  try{
    const prodDel = await cartModel.findByIdAndDelete(cid, pid);
    if(prodDel){
      res.status(200).send({respuesta:'Se ha eliminado el producto exitosamente', mensaje: 'Producto eliminado'})
    }else{
      res.status(404).send({respuesta: 'Ha ocurrido un error al eliminar el producto', mensaje: error})
    }

  }catch(error){
    res.status(400).send({respuesta: 'No se ha logrado eliminar el producto', mensaje: error})
  }
})


export default cartRouter;