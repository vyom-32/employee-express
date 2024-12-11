const config = require("dotenv");
config.config();
const express = require('express');
const bodyParser = require('body-parser');

const fileRouter = require('./routes/files');
const employeeRouter = require('./routes/employees');

const app = express();
app.use(bodyParser.json());
app.use(require('cors')());

app.use('/files', fileRouter);
app.use('/', employeeRouter)
app.use('/static', express.static('public'));

app.listen(process.env.PORT, () => {
    console.log('Server running on ' + process.env.PORT);
});
