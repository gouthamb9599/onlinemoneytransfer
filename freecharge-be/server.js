const express = require('express');
const bodyParser = require('body-parser');
const db = require('./config/database')
const route = require('./routes/approute.js')
const app = express();
const port = process.env.PORT || 5000;
class Server {
    constructor() {
        this.initserver();
        route(app);
    }
    initserver() {
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({ extended: true }));
        var cors = require("cors");
        app.use(cors());
        app.listen(port, () => console.log(`Listening on port ${port}`));
    }
}
const server = new Server();