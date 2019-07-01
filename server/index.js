//imports
const express = require('express');
const app = express();
const path = require('path');
const cors = require('cors');

//routers
const rentRouter = require('./routes/rent');

//vars for farther use in the app
const port = process.env.PORT || 5000;

//middlewares:
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(cors());

// use routers
app.use('/rent', rentRouter);

//run the server
app.listen(port, () => console.log(`Server is running on port ${port}`));