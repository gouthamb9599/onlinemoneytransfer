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
                    console.log(results.rows[0]);
                    if (results.rowCount === 1) {
                        let token = jwt.sign({ data: google, exp: Math.floor(Date.now() / 100) + 600 * 600 },
                            "secret"
                        );

                        res.send({ success: true, token, Name: google.Name, id: results.rows[0].id, data: results.rows[0] });
                    }
                    else {
                        client.query(`insert into accountdata(name,email,providername,image,token,password,cash) values($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
                            [google.Name, google.email, google.ProviderId, google.Image, google.token, password, 5000],
                            (err, results) => {
                                if (err) console.log(err);
                                else {
                                    console.log("user data entered successfully through google ID");
                                    // console.log(results)
                                    let token = jwt.sign({ data: google, exp: Math.floor(Date.now() / 100) + 600 * 600 },
                                        "secret"
                                    );
                                    // console.log(token)
                                    res.send({ success: true, token, Name: google.Name, id: results.rows[0].id, data: results.rows[0] });
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
                    console.log(results);
                    if (results.rowCount !== 0) {
                        console.log('access successful')
                        console.log(results.rows[0])
                        let token = jwt.sign({ data: results.rows[0], exp: Math.floor(Date.now() / 100) + 600 * 600 },
                            "secret")
                        // console.log(token);
                        res.send({ success: true, token, data: results.rows[0] })
                    }
                }

            })
    })
    app.post('/canceltransaction', (req, res) => {
        const data = req.body;
        client.query(`delete from transaction where id=$1`, [data.id],
            (err1, res1) => {
                if (err1) console.log(err1);
                else {
                    if (res1.rowCount !== 0) {
                        client.query(`select cash from accountdata where id=$1`, [data.sender],
                            (err2, res2) => {
                                if (err2) console.log(err2)
                                else {
                                    const money = ((res2.rows[0].cash - 0) + (data.amount - 0));
                                    client.query(`update accountdata set cash=$1 where id=$2`, [money, data.sender],
                                        (err, result) => {
                                            if (err) console.log(err);
                                            else {
                                                if (result.rowCount !== 0) {
                                                    console.log('deduced amount added back')
                                                }
                                            }
                                        })

                                }
                            })
                        client.query(`select cash from accountdata where id=$1`, [data.receiver],
                            (err2, res2) => {
                                if (err2) console.log(err2)
                                else {
                                    const money = ((res2.rows[0].cash - 0) - (data.amount - 0));
                                    client.query(`update accountdata set cash=$1 where id=$2`, [money, data.receiver],
                                        (err, result) => {
                                            if (err) console.log(err);
                                            else {
                                                if (result.rowCount !== 0) {
                                                    console.log('added amount deduced back')
                                                }
                                            }
                                        })

                                }
                            })
                        res.send({ success: true })
                    }
                }
            })

    })
    app.get('/adminallhistory', (req, res) => {
        client.query(`select * from transaction order by id asc `, (err, results) => {
            if (err) console.log(err);
            else {
                if (results.rowCount !== 0) {
                    res.send({ success: true, data: results.rows })
                }
            }
        })
    })
    app.get('/adminuserdata', (req, res) => {
        client.query(`select * from accountdata where isadmin='false' order by id asc`, (err, results) => {
            if (err) console.log(err);
            else {
                if (results.rowCount !== 0) {
                    res.send({ success: true, data: results.rows })
                }
            }
        })
    })
    app.post("/signup", (req, res) => {
        const data = req.body;
        client.query(`insert into accountdata(name,email,providername,password,cash) values($1,$2,$3,$4,$5) RETURNING *`,
            [data.name, data.email, data.ProviderId, data.password, 5000], (err, results) => {
                if (err) console.log(err);
                else {
                    console.log("user data entered successfully");
                    res.send({ success: true })
                }
            })

    })
    /*  admin creation script*/
    app.get('/', (req, res) => {
        client.query(`insert into accountdata(name,email,providername,password,isadmin) values($1,$2,$3,$4,$5) RETURNING *`,
            ['admin', 'admin@gmail.com', 'admin', 'admin', true], (err, results) => {
                if (err) console.log(err);
                else {
                    if (results.rowCount !== 0) {
                        console.log('admin account created')
                    }
                }
            })
    });
    app.post('/moneytransfer', (req, res) => {
        const data = req.body;
        client.query(`select id from accountdata where name=$1 or email=$1`, [data.receiver],
            (err, results) => {
                if (err) console.log(err);
                else {
                    console.log(results.rows[0]);
                    const rid = results.rows[0].id;
                    client.query(`insert into transaction(sender_id,receiver_id,amount) values($1,$2,$3)`, [data.senderid, rid, data.amount],
                        (errs, result) => {
                            if (errs) console.log(err);
                            else {
                                res.send({ success: true });
                                client.query(`select cash from accountdata where id=$1`, [data.senderid],
                                    (err1, res1) => {
                                        if (err1) console.log(err1);
                                        else {
                                            console.log(res1.rows[0].cash);
                                            var current = ((res1.rows[0].cash - 0) - (data.amount - 0));
                                            console.log(current);
                                            client.query(`update accountdata set cash=$1 where id=$2`, [current, data.senderid],
                                                (erru1, resu1) => {
                                                    if (erru1) console.log(erru1);
                                                    else if (resu1.rowCount !== 0) {
                                                        console.log('amount deduced');
                                                    }
                                                })

                                        }
                                    })
                                client.query(`select cash from accountdata where id=$1`, [rid],
                                    (err1, res1) => {
                                        if (err1) console.log(err1);
                                        else {
                                            console.log(res1.rows[0].cash);
                                            var current = ((res1.rows[0].cash - 0) + (data.amount - 0));
                                            console.log('104', current);
                                            client.query(`update accountdata set cash=$1 where id=$2`, [current, rid],
                                                (erru1, resu1) => {
                                                    if (erru1) console.log(erru1);
                                                    else if (resu1.rowCount !== 0) {
                                                        console.log('amount added');
                                                    }
                                                })

                                        }
                                    })
                            }

                        })
                }

            })
    })
    app.get('/getsent', (req, res) => {
        const data = req.query.id;
        client.query(`select * from transaction where sender_id=$1`, [data], (err, results) => {
            if (err) console.log(err);
            else {
                res.send({ success: true, data: results.rows })
            }
        })
    })
    app.get('/getreceived', (req, res) => {
        const data = req.query.id;
        client.query(`select * from transaction where receiver_id=$1`, [data], (err, results) => {
            if (err) console.log(err);
            else {
                res.send({ success: true, data: results.rows })
            }
        })
    })
}
module.exports = route;