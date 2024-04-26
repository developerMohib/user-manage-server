const express = require("express");
const app = express();
const cors = require("cors");
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

/* -------------------------- MongoDB Connected start -------------------------- */
// userName : mohibullah_mohim
// password : rCVJm04fj9saYIIU

const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const uri =
  "mongodb+srv://mohibullah_mohim:rCVJm04fj9saYIIU@cluster0.ylmjbhk.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();

    const database = client.db("userDB");
    const userCollection = database.collection("user");

    // data load read 
    app.get('/users', async(req, res) => {
      const cursor = userCollection.find() ;
      const result = await cursor.toArray();
      res.send(result)
    })

    // update data get 
    app.get('/users/:id', async(req, res) => {
      const id = req.params.id;
      const query = { _id : new ObjectId(id)};
      const result = await userCollection.findOne(query)
      res.send(result)
    })
    // data post
    app.post("/users", async (req, res) => {
      const user = req.body;
      // console.log('add new user', user);

      const result = await userCollection.insertOne(user);
      res.send(result);
    });

     // update data put/patch
     app.put('/users/:id', async(req, res) => {
      const id = req.params.id ;
      const updateUser = req.body ;

      console.log(updateUser, 'update user')
      const filter = {_id : new ObjectId(id)};
      const options = { upsert: true };
      const updateDoc = {
        $set: {
          name : updateUser.name,
          email : updateUser.email
        },
      };
      const result = await userCollection.updateOne(filter, updateDoc, options);
      res.send(result);
      
    } )

    // data delete 
    app.delete('/users/:id', async (req, res) => {
      const id = req.params.id;
      console.log(id, 'dynamic id');
      const query = { _id : new ObjectId(id) };
      const result = await userCollection.deleteOne(query);
      res.send(result)
    })
    //-------
    //-------

    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } finally {
    // Ensures that the client will close when you finish/error
    // /////////////////// await client.close();
  }
}
run().catch(console.dir);

/* -------------------------- MongoDB Connected end -------------------------- */
app.get("/", (req, res) => {
  res.send("Hello World! i am conneting with database");
});

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
