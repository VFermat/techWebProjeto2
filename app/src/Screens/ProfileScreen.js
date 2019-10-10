import React, {Component} from 'react';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

export class ProfileScreen extends Component {
  render() {
    const user = JSON.parse(localStorage.getItem('user'));
    if (user) {
      return (
        <div>
          <Header user={user}/>
          <div style={{
            width: '100%',
            minHeight: '700px',
            display: 'flex',
            background: Colors.background,
          }}>
            <SideBar history={this.props.history}/>
            <p>Oi</p>
          </div>
        </div>
      );
    } else {
      this.props.history.push('/');
    }
  }
}

export default ProfileScreen;
