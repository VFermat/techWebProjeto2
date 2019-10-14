import React, {Component} from 'react';
import {Spinner} from 'react-bootstrap';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

export class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  render() {
    if (this.user) {
      if (this.user.valid) {
        return (
          <div>
            <Header />
            <div style={{
              width: '100%',
              heigth: 'auto',
              minHeight: '700px',
              display: 'flex',
              background: Colors.background,
            }}>
              <SideBar />
            </div>
          </div>
        );
      } else {
        return (
          <div>
            <Header />
            <div style={{
              width: '100%',
              heigth: 'auto',
              minHeight: '700px',
              display: 'flex',
              background: Colors.background,
            }}>
              <SideBar history={this.props.history}/>
              <div style={{
                width: 'auto',
                maxWidth: '50%',
                minHeight: '300px',
                heigth: '100%',
                margin: '6rem auto 0px auto',
                display: 'block',
                color: Colors.greyText,
                alignItems: 'center',
                textAlign: 'center',
              }}><h3 style={{margin: 'none'}}>Feature can only be used by users who validated their phone number. Please validate your phone number on your profile!</h3></div>
            </div>
          </div>
        );
      }
    } else {
      this.props.history.push('./');
    }
  }
}


export default SearchScreen;
