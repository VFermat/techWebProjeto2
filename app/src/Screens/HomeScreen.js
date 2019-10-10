import React, {Component} from 'react';
// import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.history.location.state;
    this.user = JSON.parse(localStorage.getItem('user'));
    this.navigate = this.navigate.bind(this);
  }

  navigate(screen) {
    this.props.history.push(screen);
  }

  render() {
    if (this.user) {
      return (
        <div>
          <Header user={this.user} history={this.props.history} />
          <div style={{
            width: '100%',
            minHeight: '700px',
            display: 'flex',
            background: Colors.background,
          }}>
            <SideBar history={this.props.history} key='home'/>
          </div>
        </div>
      );
    } else {
      this.props.history.push('/');
    }
  }
}

export default HomeScreen;
