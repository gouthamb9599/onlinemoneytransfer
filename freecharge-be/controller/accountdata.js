const client = require('../config/database')
const jwt = require("jsonwebtoken");
// var jwtDecode = require('jwt-decode');
const AccountController = () => { };

AccountController.login = (params, res) => {
    client.query(`select * from accountdata where email=$1 and password=$2`, [params.email, params.password],
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
}
AccountController.signup = (params, res) => {
    client.query(`insert into accountdata(name,email,providername,password,cash) values($1,$2,$3,$4,$5) RETURNING *`,
        [params.name, params.email, params.ProviderId, params.password, 5000], (err, results) => {
            if (err) console.log(err);
            else {
                console.log("user data entered successfully");
                res.send({ success: true })
            }
        })

}
AccountController.googlelogin = (params, res) => {
    const password = "";
    client.query('select * from accountdata where email=$1 and token=$2', [params.email, params.token],
        (err, results) => {
            if (err) console.log(err);
            else {
                console.log(results.rows[0]);
                if (results.rowCount === 1) {
                    let token = jwt.sign({ data: google, exp: Math.floor(Date.now() / 100) + 600 * 600 },
                        "secret"
                    );

                    res.send({ success: true, token, Name: params.Name, id: results.rows[0].id, data: results.rows[0] });
                }
                else {
                    client.query(`insert into accountdata(name,email,providername,image,token,password,cash) values($1,$2,$3,$4,$5,$6,$7) RETURNING id`,
                        [params.Name, params.email, params.ProviderId, params.Image, params.token, password, 5000],
                        (err, results) => {
                            if (err) console.log(err);
                            else {
                                console.log("user data entered successfully through google ID");
                                // console.log(results)
                                let token = jwt.sign({ data: google, exp: Math.floor(Date.now() / 100) + 600 * 600 },
                                    "secret"
                                );
                                // console.log(token)
                                res.send({ success: true, token, Name: params.Name, id: results.rows[0].id, data: results.rows[0] });
                            }

                        });
                }
            }
        })
}
AccountController.changeb = (params, res) => {
    client.query(`update accountdata set cash=$1 where name=$2`, [params.amount, params.user], (err, result) => {
        if (err) console.log(err);
        else {
            if (result.rowCount !== 0) {
                res.send({ success: true });
            }
        }
    })
}
AccountController.getuser = (res) => {
    client.query(`select * from accountdata where isadmin='false' order by id asc`, (err, results) => {
        if (err) console.log(err);
        else {
            if (results.rowCount !== 0) {
                res.send({ success: true, data: results.rows })
            }
        }
    })
}
AccountController.admin = (res) => {
    client.query(`insert into accountdata(name,email,providername,password,isadmin) values($1,$2,$3,$4,$5) RETURNING *`,
        ['admin', 'admin@gmail.com', 'admin', 'admin', true], (err, results) => {
            if (err) console.log(err);
            else {
                if (results.rowCount !== 0) {
                    console.log('admin account created')
                }
            }
        })
}
module.exports = AccountController;