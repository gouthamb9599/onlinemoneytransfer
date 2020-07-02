import React from 'react';
import Drawer from '../../Components/drawer';
class Admin extends React.Component {
    logout = () => {
        this.props.history.push('/');
        sessionStorage.removeItem('adminData')
    }
    render() {
        return (
            <div>
                <Drawer isadmin={true} logout={this.logout}></Drawer>
            </div>
        )
    }
}
export default Admin;