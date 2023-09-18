import express from 'express';
import appRouter from './routes/products.routes.js';
import cartRouter from './routes/cart.routes.js';
import messageRouter from './routes/messages.routes.js';
import path from 'path';



//models
import { productsModel } from './models/products.models.js';
import { messageModel } from './models/message.models.js';

//MongoDB
import mongoose from 'mongoose';


//handlebars
import handlebars from 'express-handlebars';
import {fileURLToPath} from 'url';
import {dirname} from 'path';

//socket
import { Server } from 'socket.io';
import { resourceLimits } from 'worker_threads';


const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename)

//
const PORT = 8080;
const app =express();


const appServer = app.listen(PORT, () => {
  console.log(`Server on localhost:${PORT}`)
})

//Socket
const io = new Server(appServer)

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

//handlebars
app.engine('handlebars', handlebars.engine());
app.set('views', __dirname+'/views');
app.set('view engine', 'handlebars');
app.use(express.static(__dirname+'/public'))


//Routes
app.use('/api/products', appRouter);
app.use('/api/cart', cartRouter)
app.use('/api/messages', messageRouter)

app.get('/', async (req, res) => {
  try {
    const prodActive = await productsModel.find({ status: true }).lean();
    console.log(prodActive)
    res.render('home', { products: prodActive, styles: 'estilos.css' });
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
});

app.get('/api/messages/chat', (req,res)=>{
  res.render('chat', {styles: 'estilos.css', js: 'chat.js'});
});




io.on('connection', (socket) => {
  console.log(`Usuario conectado: ${socket.id}`);

  socket.on('chatMessages', async (data) => {
      const { user, message } = data;

      if (user && message) {
          
          try {
            const userExist = await messageModel.findOne({user});

          if(userExist){
            userExist.messages.push({
              date: new Date(),
              message,
            });
    
            await userExist.save();
            console.log('Mensaje guardado en MongoDB');
          }else { await messageModel.create({ user, message });
          console.log('Mensaje guardado en MongoDB');}
             
          } catch (error) {
              console.error('Error al guardar el mensaje en MongoDB:', error);
          }

         
          io.emit('Message', {
              user,
              date: new Date(),
              message,
          });

      } else {
          console.log('Datos de usuario o mensaje no válidos');
      }
  });

  socket.on("newProduct", async (newProd) => {
    const {title, description, price, thumbnail, code, stock, category} =  newProd
    await productsModel.create({ title, description, price, thumbnail, code, stock, category});
    console.log('Mensaje guardado en MongoDB');

    socket.emit('prod', newProd)
});

});

app.get('/realtimeproducts', async (req,res)=>{
  try {
    const prodActive = await productsModel.find({ status: true }).lean();
    console.log(prodActive)
    res.render('realTimeProducts',{products:prodActive, styles:'estilos.css', js:'realTimeProducts.js'})
  } catch (error) {
    console.error(error);
    res.status(500).send('Error interno del servidor');
  }
  
})


