const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();
app.use(cors());
app.use(express.json());

// JhwlguKzj0t6WJBo
// taskManagement

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.xvker.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run(){
    try{
        console.log('Connected Succesfully');
        const tasks = client.db('taskManagement').collection('tasks');
        
        
        app.post('/tasks', async(req, res)=>{
            const task = req.body;
            const result =await tasks.insertOne(task);

            res.send(result);
        })
        app.put('/tasks/:id', async(req, res)=>{
           
            const id = req.params.id;
            const query = {
                _id:ObjectId(id)
            };
            const updatedDoc = {
                $set:{
                    status: 'complete'
                }
            }
            const result = await tasks.updateOne(query, updatedDoc);
            res.send(result);
        })
        app.put('/completetasks/:id', async(req, res)=>{
            const id = req.params.id;
            const query = {
                _id:ObjectId(id)
            };
            const updatedDoc = {
                $set:{
                    status: 'not complete'
                }
            }
            const result = await tasks.updateOne(query, updatedDoc);
            res.send(result);
        })
        app.get('/tasks', async(req, res)=>{
            const email = req.query.email;
            const query = {
                email: email,
                status: "not complete"
            }
            const result =await tasks.find(query).toArray();
            res.send(result);
        })
        app.get('/completetasks', async(req, res)=>{
            const email = req.query.email;
            const query = {
                email: email,
                status: "complete"
            }
            const result =await tasks.find(query).toArray();
            res.send(result);
        })
     
    }finally{
        // await client.close();
    }
}

run().catch(console.dir);
app.get('/', (req, res)=>{
    res.send('Welcome to Task Management');
})


app.listen(port, ()=>{
    console.log(`Listening port`, port);
})