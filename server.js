const express = require('express');
const bodyParser = require('body-parser');
const { allocateButler } = require('./controllers/allocateButlers');

const app = express();

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

const port = 3030;

app.get('/', (req, res) => {
  res.send('welcome to the node js application.');
});

app.post('/allocateButler', allocateButler);

app.listen(port, () => {
  console.log(`server is running on port ${port}`);
});
