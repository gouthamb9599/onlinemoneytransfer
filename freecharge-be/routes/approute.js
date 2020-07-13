const client = require('../config/database')
const jwt = require('jsonwebtoken')
const route = app => {

    app.post("/logingoogle", (req, res) => {
        console.log(req.body)
        const params = req.body;
        const controller = require('../controller/accountdata.js')
        controller.googlelogin(params, res)

    })
    app.post('/login', (req, res) => {
        console.log(req.body);
        const params = req.body;
        const controller = require('../controller/accountdata.js')
        controller.login(params, res);
    })
    app.post('/changebasemoney', (req, res) => {
        const params = req.body;
        const controller = require('../controller/accountdata.js')
        controller.changeb(params, res);

    })
    app.post('/canceltransaction', (req, res) => {
        const params = req.body;
        const controller = require('../controller/transaction.js')
        controller.cancel(params, res)
    })
    app.get('/adminallhistory', (req, res) => {
        const controller = require('../controller/transaction.js')
        controller.history(params, res)
    })
    app.get('/adminuserdata', (req, res) => {
        let controller = require('../controller/accountdata.js')
        controller.getuser(res);

    })
    app.post("/signup", (req, res) => {
        const params = req.body;
        const controller = require('../controller/accountdata.js')
        controller.signup(params, res)
    })
    /*  admin creation script*/
    app.get('/', (req, res) => {
        let controller = require('../controller/accountdata.js')
        controller.admin(res);
    });
    app.post('/moneytransfer', (req, res) => {
        const params = req.body;
        const controller = require('../controller/transaction.js');
        controller.moneytransfer(params, res);
    })
    app.get('/getsent', (req, res) => {
        const params = req.query.id;
        const controller = require('../controller/transaction.js');
        controller.getsent(params, res)
    })
    app.get('/getreceived', (req, res) => {
        const params = req.query.id;
        const controller = require('../controller/transaction.js');
        controller.getreceive(params, res);
    })
}
module.exports = route;