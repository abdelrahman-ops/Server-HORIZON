const express = require('express');


require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(express.json());


// Basic route to check server setup
app.get('/', (req, res) => {
    res.send('Server is up and running');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})
