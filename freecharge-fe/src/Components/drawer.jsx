import React from 'react';
import clsx from 'clsx';
import { makeStyles, useTheme } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import List from '@material-ui/core/List';
import CssBaseline from '@material-ui/core/CssBaseline';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import IconButton from '@material-ui/core/IconButton';
import MenuIcon from '@material-ui/icons/Menu';
import ChevronLeftIcon from '@material-ui/icons/ChevronLeft';
import ChevronRightIcon from '@material-ui/icons/ChevronRight';
import ListItem from '@material-ui/core/ListItem';
import ListItemIcon from '@material-ui/core/ListItemIcon';
import ListItemText from '@material-ui/core/ListItemText';
import AccountCircleIcon from '@material-ui/icons/AccountCircle';
import PaymentIcon from '@material-ui/icons/Payment';
import AttachMoneyIcon from '@material-ui/icons/AttachMoney';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import TextField from '@material-ui/core/TextField';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import { InputLabel } from '@material-ui/core';
import { Button } from '@material-ui/core';
import '../styles/drawer.css';
import Axios from 'axios';
import swal from 'sweetalert';

const drawerWidth = 253;

const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
    },
    appBar: {
        zIndex: theme.zIndex.drawer + 1,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
    },
    appBarShift: {
        marginLeft: drawerWidth,
        width: `calc(100% - ${drawerWidth}px)`,
        transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    menuButton: {
        marginRight: 36,
    },
    hide: {
        display: 'none',
    },
    drawer: {
        width: drawerWidth,
        flexShrink: 0,
        whiteSpace: 'nowrap',
    },
    drawerOpen: {
        width: drawerWidth,
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.enteringScreen,
        }),
    },
    drawerClose: {
        transition: theme.transitions.create('width', {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
        }),
        overflowX: 'hidden',
        width: theme.spacing(7) + 1,
        [theme.breakpoints.up('sm')]: {
            width: theme.spacing(9) + 1,
        },
    },
    nested: {
        paddingLeft: theme.spacing(4),
    },
    toolbar: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
    },
    content: {
        flexGrow: 1,
        padding: theme.spacing(3),
    },
}));

export default function MiniDrawer(props) {
    const classes = useStyles();
    const theme = useTheme();
    // const data = JSON.parse(localStorage.getItem('userData'));
    const [open, setOpen] = React.useState(false);
    const [opennest, setOpennest] = React.useState(false);
    const [newtrans, setNewtrans] = React.useState(false);
    const [transhissent, setTranshissent] = React.useState(false);
    const [transhisrec, setTranshisrec] = React.useState(false);
    const [receivedlist, setReceivedlist] = React.useState([]);
    const [sentlist, setSentlist] = React.useState([]);
    const [amount, setAmount] = React.useState(0);
    const [oamount, setOamount] = React.useState(true);
    const [username, setUsername] = React.useState('');
    const [name, setName] = React.useState('');
    const [balance, setBalance] = React.useState(0);
    const [newbalance, setnewBalance] = React.useState(0);

    const handleDrawerOpen = () => {
        if (props.isadmin === false) {
            const data = JSON.parse(sessionStorage.getItem('userData'));
            console.log(data.name, data.cash);
            setName(data.name);
            setBalance(data.cash)
            setOpen(true);
        }
        else {
            setOpen(true);
        }
    };
    const handleamount = (event) => {
        setAmount(event.target.value);
    }
    const handleuser = (event) => {
        setUsername(event.target.value);
    }
    const handlenest = () => {
        setOpennest(!opennest);
    }
    const handleDrawerClose = () => {
        setOpen(false);
    };
    const maketransaction = () => {
        setNewtrans(!newtrans)
    }

    const allhistory = () => {
        Axios.get(`http://localhost:5000/adminallhistory`)
            .then(res => {
                if (res.data.success === true) {
                    setReceivedlist(res.data.data);
                    setTranshisrec(!transhisrec);
                }
            })
    }
    const alluserdata = () => {
        Axios.get(`http://localhost:5000/adminuserdata`)
            .then(res => {
                if (res.data.success === true) {
                    setSentlist(res.data.data);
                    setTranshissent(!transhissent);
                }
            })
    }
    const moneytransfer = () => {
        const data = JSON.parse(sessionStorage.getItem('userData'));
        Axios.post(`http://localhost:5000/moneytransfer`, { senderid: data.id, amount: amount, receiver: username })
            .then(res => {
                if (res.data.success === true) {
                    swal("Money Transferred Successfully", "It will take time to reflect in your account", "success")
                    setOamount(false);
                    console.log(balance, amount)
                    setnewBalance((balance) - (amount - 0));
                    setBalance((balance) - (amount - 0));
                    console.log(balance, amount)

                }
                else if (res.data.success === false) {
                    swal("Invalid user Details", "Check the user details", "warning")
                }
            })
    }
    const received = () => {
        const data = JSON.parse(sessionStorage.getItem('userData'));
        Axios.get(`http://localhost:5000/getreceived?id=${data.id}`)
            .then(res => {
                if (res.data.success === true) {
                    console.log(res.data.data);
                    setReceivedlist(res.data.data);
                    setTranshisrec(!transhisrec);
                }
            })
    }
    const sent = () => {
        const data = JSON.parse(sessionStorage.getItem('userData'));
        Axios.get(`http://localhost:5000/getsent?id=${data.id}`)
            .then(res => {
                if (res.data.success === true) {
                    console.log(res.data.data);
                    setSentlist(res.data.data);
                    setTranshissent(!transhissent);
                }
            })
    }
    const canceltransaction = (id, sender, receiver, amount) => {
        Axios.post(`http://localhost:5000/canceltransaction`, { id: id, sender: sender, receiver: receiver, amount: amount })
            .then(res => {
                if (res.data.success === true) {
                    swal('transaction cancelled successfully', 'check other transactions for validation', 'success')
                }
            })
    }

    return (
        <div> {props.isadmin ? <div>
            <div className={classes.root} >
                <CssBaseline />
                <AppBar
                    position="fixed"
                    className={clsx(classes.appBar, {
                        [classes.appBarShift]: open,
                    })}
                    style={{ backgroundColor: '#e3714d' }}
                >
                    <Toolbar>
                        <IconButton
                            color="inherit"
                            aria-label="open drawer"
                            onClick={handleDrawerOpen}
                            edge="start"
                            className={clsx(classes.menuButton, {
                                [classes.hide]: open,
                            })}
                        >
                            <MenuIcon />
                        </IconButton>
                        <Typography variant="h6" noWrap>
                            Free Charge
  </Typography>

                    </Toolbar>
                </AppBar>
                <Drawer
                    variant="permanent"
                    className={clsx(classes.drawer, {
                        [classes.drawerOpen]: open,
                        [classes.drawerClose]: !open,
                    })}
                    classes={{
                        paper: clsx({
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        }),
                    }}
                >
                    <div className={classes.toolbar} >
                        <div className="userinfo" >
                            <span>Hello Admin</span>
                        </div>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                        </IconButton>
                    </div>
                    <Divider />
                    <List>
                        <ListItem button onClick={alluserdata} key={'View User Details'}>
                            <ListItemIcon><AccountCircleIcon /></ListItemIcon>
                            <ListItemText primary={'View User details'} />
                        </ListItem>
                        <ListItem button onClick={allhistory} key={'Transactions History'}>
                            <ListItemIcon><PaymentIcon /></ListItemIcon>
                            <ListItemText primary={'Transactions History'} />
                        </ListItem>
                        <Divider />
                        <ListItem onClick={props.logout} button key={'Logout'}>
                            <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                            <ListItemText primary={'Logout'} />
                        </ListItem>
                    </List>
                </Drawer>
            </div >
            <div>
                {transhissent ? <table id='customers'>
                    <tr>
                        <th>User ID</th>
                        <th>User Name</th>
                        <th>User Email</th>
                        <th>Provider Name</th>
                        <th>Balance</th>
                        <th>Change Balance</th>
                    </tr>
                    {sentlist.map(data => (<tr>
                        <td>{data.id}</td>
                        <td>{data.name}</td>
                        <td>{data.email}</td>
                        <td>{data.providername}</td>
                        <td>{data.cash}</td>
                        <td><Button style={{ backgroundColor: "#e3714d" }}>Change Amount</Button></td>
                    </tr>))}

                </table> : <></>}
                {transhisrec ? <table id='customers'>
                    <tr>
                        <th>Sender ID</th>
                        <th>Reciver ID</th>
                        <th>Received Amount</th>
                        <th>Cancel Transaction</th>


                    </tr>
                    {receivedlist.map(data => (<tr>
                        <td>{data.sender_id}</td>
                        <td>{data.receiver_id}</td>
                        <td>{data.amount}</td>
                        <td><Button onClick={() => canceltransaction(data.id, data.sender_id, data.receiver_id, data.amount)} style={{ backgroundColor: "#e3714d" }}>Cancel</Button></td>
                    </tr>))}
                </table> : <></>}

            </div>
        </div>
            :
            <div>
                <div className={classes.root} >
                    <CssBaseline />
                    <AppBar
                        position="fixed"
                        className={clsx(classes.appBar, {
                            [classes.appBarShift]: open,
                        })}
                        style={{ backgroundColor: '#e3714d' }}
                    >
                        <Toolbar>
                            <IconButton
                                color="inherit"
                                aria-label="open drawer"
                                onClick={handleDrawerOpen}
                                edge="start"
                                className={clsx(classes.menuButton, {
                                    [classes.hide]: open,
                                })}
                            >
                                <MenuIcon />
                            </IconButton>
                            <Typography variant="h6" noWrap>
                                Free Charge
          </Typography>

                        </Toolbar>
                    </AppBar>
                    <Drawer
                        variant="permanent"
                        className={clsx(classes.drawer, {
                            [classes.drawerOpen]: open,
                            [classes.drawerClose]: !open,
                        })}
                        classes={{
                            paper: clsx({
                                [classes.drawerOpen]: open,
                                [classes.drawerClose]: !open,
                            }),
                        }}
                    >
                        <div className={classes.toolbar} >
                            <div className="userinfo" >
                                <span>Hello {name}</span>
                                {oamount ? <span>Account Balance:${balance}</span> : <span>Account Balance:${newbalance}</span>}
                            </div>
                            <IconButton onClick={handleDrawerClose}>
                                {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
                            </IconButton>
                        </div>
                        <Divider />
                        <List>
                            <ListItem button onClick={maketransaction} key={'Make Transaction'}>
                                <ListItemIcon><AttachMoneyIcon /></ListItemIcon>
                                <ListItemText primary={'Make Transaction'} />
                            </ListItem>
                            <ListItem button onClick={handlenest} key={'Transaction History'}>
                                <ListItemIcon><PaymentIcon /></ListItemIcon>
                                <ListItemText primary={'Transaction History'} />
                                {opennest ? <ExpandLess /> : <ExpandMore />}
                            </ListItem>
                            <Collapse in={opennest} timeout="auto" unmountOnExit>
                                <List component="div" disablePadding>
                                    <ListItem button onClick={sent} className={classes.nested}>
                                        <ListItemText primary="Sent" />
                                    </ListItem>
                                    <ListItem button onClick={received} className={classes.nested}>
                                        <ListItemText primary="Recieved" />
                                    </ListItem>
                                </List>
                            </Collapse>
                            <Divider />
                            <ListItem onClick={props.logout} button key={'Logout'}>
                                <ListItemIcon><ExitToAppIcon /></ListItemIcon>
                                <ListItemText primary={'Logout'} />
                            </ListItem>
                        </List>
                    </Drawer>
                </div >
                <div>
                    {newtrans ? <div className="maketrans"><InputLabel>Money Transfer</InputLabel>
                        <div><TextField id="standard-basic" value={username} onChange={handleuser} type="text" label="User Details" placeholder="Name/Email" /></div>
                        <div><TextField id="standard-basic" value={amount} onChange={handleamount} min="1" max="5000" type="number" label="Amount" placeholder="Amount" /></div>
                        <Button variant="contained" onClick={moneytransfer} style={{ backgroundColor: "#e3714d", marginTop: "9px" }}>Transfer</Button></div> : <></>}
                </div>
                <div>
                    {transhissent ? <table id='customers'>
                        <tr>
                            <th>Sent Amount</th>
                            <th>Reciever</th>
                        </tr>
                        {sentlist.map(data => (<tr>
                            <td>{data.sender_id}</td>
                            <td>{data.amount}</td>
                        </tr>))}

                    </table> : <></>}
                    {transhisrec ? <table id='customers'>
                        <tr>
                            <th>Received Amount</th>
                            <th>Sender</th>

                        </tr>
                        {receivedlist.map(data => (<tr>
                            <td>{data.sender_id}</td>
                            <td>{data.amount}</td>

                        </tr>))}
                    </table> : <></>}

                </div>
            </div>
        }
        </div >
    );
}
