import React from 'react';
import Drawer from '../../Components/drawer';
class Homepage extends React.Component {
    logout = () => {
        this.props.history.push('/');
        sessionStorage.removeItem('userData')
    }
    render() {
        return (
            <div>
                <Drawer data={JSON.parse(localStorage.getItem('userData'))} logout={this.logout}></Drawer>
            </div>
        )
    }
}
export default Homepage;