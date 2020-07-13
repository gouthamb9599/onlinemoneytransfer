const client = require('../config/database')
const jwt = require("jsonwebtoken");
// var jwtDecode = require('jwt-decode');
const TransactionController = () => { };
TransactionController.cancel = (params, res) => {
    client.query(`delete from transaction where id=$1`, [params.id],
        (err1, res1) => {
            if (err1) console.log(err1);
            else {
                if (res1.rowCount !== 0) {
                    client.query(`select cash from accountdata where id=$1`, [params.sender],
                        (err2, res2) => {
                            if (err2) console.log(err2)
                            else {
                                const money = ((res2.rows[0].cash - 0) + (params.amount - 0));
                                client.query(`update accountdata set cash=$1 where id=$2`, [money, params.sender],
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
                    client.query(`select cash from accountdata where id=$1`, [params.receiver],
                        (err2, res2) => {
                            if (err2) console.log(err2)
                            else {
                                const money = ((res2.rows[0].cash - 0) - (params.amount - 0));
                                client.query(`update accountdata set cash=$1 where id=$2`, [money, params.receiver],
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
}
TransactionController.history = (params, res) => {
    client.query(`select * from transaction order by id asc `, (err, results) => {
        if (err) console.log(err);
        else {
            if (results.rowCount !== 0) {
                res.send({ success: true, data: results.rows })
            }
        }
    })
}
TransactionController.moneytransfer = (params, res) => {
    client.query(`select id from accountdata where name=$1 or email=$1`, [params.receiver],
        (err, results) => {
            if (err) console.log(err);
            else {
                console.log(results.rows[0]);
                const rid = results.rows[0].id;
                client.query(`insert into transaction(sender_id,receiver_id,amount) values($1,$2,$3)`, [params.senderid, rid, params.amount],
                    (errs, result) => {
                        if (errs) console.log(err);
                        else {
                            res.send({ success: true });
                            client.query(`select cash from accountdata where id=$1`, [params.senderid],
                                (err1, res1) => {
                                    if (err1) console.log(err1);
                                    else {
                                        console.log(res1.rows[0].cash);
                                        var current = ((res1.rows[0].cash - 0) - (params.amount - 0));
                                        console.log(current);
                                        client.query(`update accountdata set cash=$1 where id=$2`, [current, params.senderid],
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
                                        var current = ((res1.rows[0].cash - 0) + (params.amount - 0));
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
}
TransactionController.getsent = (params, res) => {
    client.query(`select * from transaction where sender_id=$1`, [params], (err, results) => {
        if (err) console.log(err);
        else {
            res.send({ success: true, data: results.rows })
        }
    })
}
TransactionController.getreceive = (params, res) => {
    client.query(`select * from transaction where receiver_id=$1`, [params], (err, results) => {
        if (err) console.log(err);
        else {
            res.send({ success: true, data: results.rows })
        }
    })
}
module.exports = TransactionController;