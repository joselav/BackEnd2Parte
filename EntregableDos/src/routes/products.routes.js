import { Router } from 'express';
import { productsModel } from '../models/products.models.js';

const appRouter= Router();

appRouter.get('/', async (req,res)=>{
  const {limit} = req.query;

  try{
    const prod = await productsModel.paginate({category: 'starwars'}, {limit: 10, page:1})
    res.status(200).send({respuesta:'Se ha encontrado el producto', mensaje: prod})

  } catch(error){ res.status(400).send({respuesta: 'No se ha encontrado el producto', mensaje: error})}
})

appRouter.post('/', async (req, res)=> {
  const {title, description, price, code, stock, category} = req.body; 

  try{
    const prod = await productsModel.create({title, description, price, code, stock, category})
    res.status(200).send({respuesta:'Se ha creado el producto', mensaje: prod})

  }catch(error){ res.status(400).send({respuesta:'Error al cargar producto', mensaje: error})}
})

appRouter.get('/:pid', async (req, res)=> {
  const {pid} = req.params

  try{
    const prod = await productsModel.findById(pid);
    if(prod){
      res.status(200).send({respuesta:'Se ha encontrado el producto', mensaje: prod})
    }else{
      res.status(404).send({respuesta:'No se ha logrado encontrar el producto', mensaje: error})
    }

  } catch(error){
    res.status(400).send({respuesta:'No se ha encontrado el producto', mensaje: error})
  }
})

appRouter.put('/:pid', async (req, res)=>{
  const {pid} = req.params;
  const {title, description, price, code, stock, category}= req.body;

  try{
    const prod = await productsModel.findByIdAndUpdate(pid, {title, description, price, code, stock, category})
    if(prod){
      res.status(200).send({respuesta: 'Se ha actualizado exitosamente el producto', mensaje: prod})
    }else {
      res.status(404).send({respuesta: 'No se ha logrado actualizar el producto', mensaje: error})
    }
  }catch(error){
    res.status(400).send({respuesta: 'No se ha logrado actualizar el producto deseado', mensaje: error})
  }
} )

appRouter.delete('/:pid', async (req,res)=>{
  const {pid} = req.params;

  try{
    const prodDel = await productsModel.findByIdAndDelete(pid);
    if(prodDel){
      res.status(200).send({respuesta:'Se ha eliminado el producto exitosamente', mensaje: 'Producto eliminado'})
    }else{
      res.status(404).send({respuesta: 'Ha ocurrido un error al eliminar el producto', mensaje: error})
    }

  }catch(error){
    res.status(400).send({respuesta: 'No se ha logrado eliminar el producto', mensaje: error})
  }
})

export default appRouter