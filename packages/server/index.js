const fs = require('fs');
const path = require('path');

const express = require('express');
const bodyParser = require('body-parser');

const app = express();

const PORT = 3000;

function getData() {
    const data = fs.readFileSync(path.join(__dirname, 'data', 'frameworks.json'), 'utf8');
    return JSON.parse(data);
}

function setData(data) {
    fs.writeFileSync(path.join(__dirname, 'data', 'frameworks.json'), JSON.stringify(data));
}

const router = express.Router();

router.get('/', (req, res) => {
    const data = getData();
    res.status(200).json(data);
});

router.post('/', (req, res) => {
    if(!req.body.name) {
        res.status(400).send('Name is required');
        return;
    }

    setData([...getData(), req.body]);
    res.status(201).send(req.body);
});

router.patch('/:id', (req, res) => {
    const data = getData();
    const index = data.findIndex(item => item.id === req.params.id);

    if(index === -1) {
        res.status(404).send('Not found');
        return;
    }

    data[index] = {...data[index], ...req.body};

    setData(data);

    res.status(200).send(data[index]);
});

router.delete('/:id', (req, res) => {
    const data = getData();
    const index = data.findIndex(item => item.id === req.params.id);

    if(index === -1) {
        res.status(404).send('Not found');
        return;
    }

    data.splice(index, 1);

    setData(data);

    res.status(200).send('OK');
});

app.use(bodyParser.json());
app.use('/frameworks', router);

app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
});

