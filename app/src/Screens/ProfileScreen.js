import React, {Component} from 'react';
import {IoIosPerson, IoIosMail} from 'react-icons/io';
import {ListGroup, Button} from 'react-bootstrap';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

export class ProfileScreen extends Component {
  constructor(props) {
    super(props);

    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout() {
    localStorage.clear();
    this.props.history.push('/');
  }

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
            <div style={{
              display: 'flex',
              maxWidth: '70%',
              minWidth: '40%',
              height: '100%',
              marginRight: 'auto',
              marginLeft: 'auto',
              position: 'relative',
            }}>
              <div style={{
                display: 'block',
                width: '100%',
                height: '100%',
                marginTop: '5rem',
              }}>
                <div style={{
                  width: '100%',
                  textAlign: 'center',
                  color: Colors.greyText,
                }}><h1 style={{textAlign: 'center'}}>Minha Conta</h1></div>
                <div style={{
                  width: '50%',
                  margin: '10px auto 10px auto',
                  borderTop: '1px solid ' + Colors.greyDark,
                  borderBottom: '1px solid ' + Colors.greyDark,
                }}></div>
                <ListGroup variant="flush" style={{
                  marginTop: '40px'}}>
                  <ListGroup.Item style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '50%',
                    height: 'auto',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    minHeight: '54px',
                    background: Colors.background,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      height: 'auto',
                    }}>
                      <IoIosPerson />
                      <div>{user.name}</div>
                    </div>
                  </ListGroup.Item>
                  <ListGroup.Item style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    width: '50%',
                    height: 'auto',
                    marginRight: 'auto',
                    marginLeft: 'auto',
                    minHeight: '54px',
                    background: Colors.background,
                  }}>
                    <div style={{
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between',
                      width: '100%',
                      height: 'auto',
                    }}>
                      <IoIosMail />
                      <div>{user.email}</div>
                    </div>
                  </ListGroup.Item>
                </ListGroup>
                <Button onClick={this.handleLogout} style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginTop: '40px',
                  width: '30%',
                  height: 'auto',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                }}>Logout</Button>
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      this.props.history.push('/');
    }
  }
}

export default ProfileScreen;
