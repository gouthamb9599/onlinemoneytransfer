import React from "react";
import "../overall.css";
import axios from "axios";
import swal from 'sweetalert';


class Signup extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: "",
            email: "",
            role: "",
            password: "",
            cpassword: "",
        };
    }
    // ValidateEmail(mail) {
    //     if (/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(mail)) {
    //         return (true)
    //     }
    //     swal("warning", "You have entered an invalid email address!", "warning")
    //     return (false)
    // }
    signup = (e) => {
        e.preventDefault();
        if (this.state.name === "") {
            swal("warning", "Enter your name", "warning");
        } else if (this.state.email === "") {
            swal('warning', "Enter your Email ID", "warning");
        } else if (this.state.password !== this.state.cpassword) {
            swal("warning", "passwords does not match", "warning");
        } else {

            // const test = this.ValidateEmail(this.state.email);
            axios.post("http://localhost:5000/signup", { name: this.state.name, email: this.state.email, password: this.state.password, ProviderId: "email" }).then(res => {
                console.log(res);
                if (res.data.success === true) {
                    console.log('data entered successfully')
                    swal("you have registered successfully", "login into your account", "success")
                }
            });
        }

    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };

    render() {
        return (
            <div className="signupmain">
                <p className="page-tag">SIGNUP</p>
                <div className="signupset" align="center">
                    <form className="signup">
                        <input
                            className="form-alignments"
                            type="text"
                            id="name"
                            name="name"
                            placeholder="Name"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            type="email"
                            id="email"
                            name="email"
                            placeholder="Email"
                            className="form-alignments"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            type="password"
                            id="password"
                            name="password"
                            placeholder="Password"
                            className="form-alignments"
                            onChange={e => this.handleChange(e)}
                        />
                        <input
                            type="password"
                            id="confirm"
                            name="cpassword"
                            placeholder="Confirm Password"
                            className="form-alignments"
                            onChange={e => this.handleChange(e)}
                        />
                        <button
                            className="buttonstyle"
                            id="send"
                            onClick={e => {
                                this.signup(e);
                            }}>
                            Signup
            </button>
                        <div className="buttins">
                            <p className="para">Login via Google/Have an account?</p>
                            <button className="buttonstyle">
                                <a className="line" href="/">
                                    Login</a>
                            </button>
                        </div>
                    </form>
                </div>
            </div>)
    }
}
export default Signup;