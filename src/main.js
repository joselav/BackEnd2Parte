import express from 'express';
import appRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';

//MongoDB
import mongoose from 'mongoose';

//
const PORT = 8080;
const app =express();


const appServer = app.listen(PORT, () => {
  console.log(`Server on localhost:${PORT}`)
})


//Middleware
app.use(express.json());
app.use(express.urlencoded({extended: true}));


//MONGO
mongoose.connect('mongodb+srv://josefinalavinia05:<contraseña>@cluster0.f5zhko4.mongodb.net/?retryWrites=true&w=majority',  {
  useNewUrlParser: true,
  useUnifiedTopology: true, // Agrega esta línea
})
.then(()=> console.log("DB conectada"))
.catch(()=> console.error("Error en conectar DB", error))


//Routes
app.use('/api/products', appRouter);
app.use('/api/cart', cartRouter)