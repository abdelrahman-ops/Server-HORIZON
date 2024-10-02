import express from "express";
import "dotenv/config";

const app = express();


app.use(express.json());


// Basic route to check server setup
app.get('/', (req, res) => {
    res.send('Server is up and running');
});


const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});


