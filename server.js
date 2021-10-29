import Express from 'express';
import { MongoClient,ObjectId } from 'mongodb';

import Cors from 'cors';


const stringbaseDeDatos="mongodb+srv://seb:seb@cluster0.dxe47.mongodb.net/myFirstDatabase?retryWrites=true&w=majority";
const client = new MongoClient(stringbaseDeDatos,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
});

let baseDeDatos ;
const app = Express();
app.use(Express.json());
app.use(Cors());


app.get('/productos',(req, res)=>{
    console.log('Alguien hizo un get a productos');
    baseDeDatos.collection("producto").find().toArray((err,result)=>{
        if (err){
            res.status(500).send("Error consultando la base de dtos");
        }
        else {
            res.json(result);

        }
    })
    


});

app.post("/productos/nuevo",(req,res)=>{
    const datosProducto = req.body;
    console.log('llaves:',Object.keys(datosProducto));
    try {
        if (
            Object.keys(datosProducto).includes("tipo") && 
            Object.keys(datosProducto).includes("tamanio") &&
            Object.keys(datosProducto).includes("aroma") 
            ){
            
            baseDeDatos.collection("producto").insertOne(datosProducto, (err, result)=>{
                if (err){
                    console.error(err);
                    res.sendStatus(500);
                }
                else{
                    console.log(result);
                    res.sendStatus(200); 

                }
            });
                     
            }
            else {
                res.sendStatus(500);
            }
        
    } catch  {
        res.sendStatus(500);
        
    }
   
    
});



app.patch('/productos/editar',(req,res)=>{
    const edicion =req.body;
    console.log(edicion);
    const filtroProducto={_id:new ObjectId(edicion.id)}
    delete edicion.id;
    const operacion={
        $set:edicion,
    }
    baseDeDatos.collection('producto').findOneAndUpdate(filtroProducto,operacion,{upsert:true, returnOriginal:true},(err,result)=>{
        if(err){
            console.error("Error actualizando producto",err);
            res.sendStatus(500);
        }
        else {
            console.log("Producto Actualizado");
            res.sendStatus(200);
        }

    });
});

const main = ()=>{
    client.connect((err,db)=>{
        if(err){
            console.error("Error conectando a la BD");
            return "Error";
        }
        baseDeDatos =db.db('Andromeda');
        console.log("Conexión exitosa!")
        return app.listen(5000,()=>{
            console.log('escuchando puerto 5000');
            
        
        });
        
    });

};

main ();
