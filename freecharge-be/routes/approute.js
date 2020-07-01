const client = require('../config/database')
const jwt = require('jsonwebtoken')
const route = app => {
    app.post("/logingoogle", (req, res) => {
        console.log(req.body)
        const google = req.body;
        const password = "";
        client.query('select * from accountdata where email=$1 and token=$2', [google.email, google.token],
            (err, results) => {
                if (err) console.log(err);
                else {
                    // console.log(results);
                    if (results.rowCount === 1) {
                        let token = jwt.sign({ data: google, exp: Math.floor(Date.now() / 100) + 600 * 600 },
                            "secret"
                        );
                        // console.log(token)
                        res.send({ success: true, token, Name: google.Name, id: results.rows[0].id });
                    }
                    else {
                        client.query(`insert into accountdata(name,email,providername,image,token,password) values($1,$2,$3,$4,$5,$6) RETURNING id`,
                            [google.Name, google.email, google.ProviderId, google.Image, google.token, password],
                            (err, results) => {
                                if (err) console.log(err);
                                else {
                                    console.log("user data entered successfully through google ID");
                                    // console.log(results)
                                    let token = jwt.sign({ data: google, exp: Math.floor(Date.now() / 100) + 600 * 600 },
                                        "secret"
                                    );
                                    // console.log(token)
                                    res.send({ success: true, token, Name: google.Name, id: results.rows[0].id });
                                }

                            });
                    }
                }
            })
    })
    app.post('/login', (req, res) => {
        console.log(req.body);
        const data = req.body;
        client.query(`select * from accountdata where email=$1 and password=$2`, [data.email, data.password],
            (err, results) => {
                if (err) console.log(err);
                else {
                    console.log('access successful')
                    // console.log(results.rows[0])
                    let token = jwt.sign({ data: results.rows[0], exp: Math.floor(Date.now() / 100) + 600 * 600 },
                        "secret")
                    // console.log(token);
                    res.send({ success: true, token, Name: results.rows[0].name, id: results.rows[0].id })
                }

            })
    })
    app.post("/signup", (req, res) => {
        const data = req.body;
        client.query(`insert into accountdata(name,email,providername,password) values($1,$2,$3,$4) RETURNING *`,
            [data.name, data.email, data.ProviderId, data.password], (err, results) => {
                if (err) console.log(err);
                else {
                    console.log("user data entered successfully");
                    res.send({ success: true })
                }
            })

    })
}
module.exports = route;