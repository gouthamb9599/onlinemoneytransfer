import React, { Component } from 'react'
// import FacebookLogin from 'react-facebook-login';
import GoogleLogin from 'react-google-login';
import axios from 'axios'
import '../overall.css';


export class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: "",
            password: ""
        };

    }
    check = (e) => {
        axios.post('http://localhost:5000/login', { email: this.state.email, password: this.state.password })
            .then((res) => {

                if (res.data.success === true) {
                    sessionStorage.setItem("userData", JSON.stringify(res.data.data));
                    this.props.history.push('/home')
                }
            });
    }
    handleChange = (e) => {
        this.setState({ [e.target.name]: e.target.value });
    };
    signup(res) {
        const googleresponse = {
            Name: res.profileObj.name,
            email: res.profileObj.email,
            token: res.googleId,
            Image: res.profileObj.imageUrl,
            ProviderId: 'Google'
        };
        axios.post('http://localhost:5000/logingoogle', googleresponse)
            .then((result) => {
                if (result.data.success === true) {
                    sessionStorage.setItem("userData", JSON.stringify(result.data.data));
                    this.props.history.push('/home')
                }
            });
    }

    render() {
        const responseGoogle = (response) => {
            console.log(response);
            var res = response;
            console.log(res);
            this.signup(res);
        }
        return (
            <div className="loginmain">
                <h4 className="headdis">Login</h4>
                <div>
                    <div className="signpage">
                        <div className="container">
                            {/* {(this.props.value === 0) ? <h2 className="heading">Student LOGIN</h2> : <h2 className="heading">Teacher LOGIN</h2>} */}
                            <div id="login">
                                {/* <div className="col-25">
                        <label htmlFor="fname">Email</label>
                    </div> */}
                                <div className="col-75">
                                    <input type="email" className="form-alignment" name="email" placeholder="Email" onChange={(e) => this.handleChange(e)} /><br /></div>
                                {/* <div className="col-25">
                        <label htmlFor="fname">Password</label>
                    </div> */}

                                <div className="col-75">
                                    <input type="password" className="form-alignment" name="password" placeholder="Password" onChange={(e) => this.handleChange(e)} /><br />
                                </div>

                                <button id="send" className="buttonstyle" onClick={e => this.check(e)}>Login</button>
                                <p className="para">New user?</p>
                                <button className="buttonstyle"><a className="line" href="/signup">Signup</a></button>
                            </div>

                        </div>
                    </div>

                </div>
                <div>
                    <div style={{ 'paddingTop': "20px" }}>

                        <div>
                            <GoogleLogin
                                clientId="329161322392-t41738mvn37n8tb0skeloknsb1sop6se.apps.googleusercontent.com"
                                buttonText="Login with Google"
                                onSuccess={responseGoogle}
                                onFailure={responseGoogle} ></GoogleLogin>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
    ;
}
export default Login;