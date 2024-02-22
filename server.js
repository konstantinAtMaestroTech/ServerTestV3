const express = require('express');
const { PORT } = require('./config.js');

let app = express();
app.use(express.static('wwwroot'));
app.use(require('./routes/auth.js'));
app.use(require('./routes/models.js'));

app.get('/labelsServer/:imageID', (req, res) => {
    const {imageID} = req.params;
    res.sendFile(__dirname + '/temp/labelsServer/' + String(imageID));
    }
);
app.get('/temp/:project/LabelsAppVersion/:imageID', (req, res) => {
    const {imageID} = req.params;
    const {project} = req.params;
    console.log(req.params);
    res.sendFile(__dirname + '/temp/' + project + '/LabelsAppVersion/' + String(imageID));
    }
);
app.get('/temp/:project/Drawings/:imageID', (req, res) => {
    const {imageID} = req.params;
    const {project} = req.params;
    console.log(req.params);
    res.sendFile(__dirname + '/temp/' + project + '/Drawings/' + String(imageID));
    }
);
app.get('/temp/:project/Instructions/:imageID', (req, res) => {
    const {imageID} = req.params;
    const {project} = req.params;
    res.sendFile(__dirname + '/temp/' + project + '/Instructions/' + String(imageID));
    }
);
app.get('/temp/gantt/csv_sheet.csv', (req, res) => {
    res.sendFile(__dirname + '/temp/gantt/csv_sheet.csv');
    }
);

app.listen(PORT, function () { console.log(`Server listening on port ${PORT}...`); });
