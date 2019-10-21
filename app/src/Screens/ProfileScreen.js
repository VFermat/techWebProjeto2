import React, {Component} from 'react';
import {IoIosPerson, IoIosMail, IoIosFilm} from 'react-icons/io';
import {ListGroup, Button, Modal} from 'react-bootstrap';
import OTPInput from 'otp-input-react';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';
import axios from 'axios';

export class ProfileScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showModal: false,
      otp: '',
      valButAble: true,
    };

    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleLogout = this.handleLogout.bind(this);
    this.handleOtpChange = this.handleOtpChange.bind(this);
    this.handleValidationButton = this.handleValidationButton.bind(this);
  }

  handleModalOpen() {
    this.setState({
      showModal: true,
      otp: '',
    });
  }

  handleModalClose() {
    this.setState({
      showModal: false,
    });
  }

  handleLogout() {
    localStorage.clear();
    this.props.history.push('/');
  }

  handleOtpChange(otp) {
    const lastChar = (otp.length >= 2) ? otp.substring(otp.length - 2, otp.length - 1) : otp;
    if (lastChar > '0' && lastChar < '9') {
      this.setState({
        otp: otp,
      });
      return otp;
    } else {
      return otp.substring(0, otp.length - 1);
    }
  }

  async handleValidationButton() {
    const user = JSON.parse(localStorage.getItem('user'));
    this.setState({
      valButAble: false,
    });
    await axios.post('http://localhost:8080/validate/' + user.id, {
      otp: this.state.otp,
    }).then((v) => {
      this.setState({
        showModal: false,
      });
      alert('User validate! Enjoy MovieMe!');
    }).catch((e) => {
      console.log(e);
      if (e.response.status === 415) {
        alert('Invalid Pin! Try again or get a new OTP.');
      } else {
        alert('Error, please try again.');
      }
      this.setState({
        valButAble: true,
      });
    });
  }

  render() {
    let validationButton;
    const user = JSON.parse(localStorage.getItem('user'));
    if (!user.valid) {
      validationButton = <Button onClick={this.handleModalOpen} style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-around',
        marginTop: '1rem',
        width: '30%',
        height: 'auto',
        marginRight: 'auto',
        marginLeft: 'auto',
        background: Colors.purpleDark,
        borderColor: Colors.purpleDark,
      }}>Validate Account</Button>;
    }
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
                      <IoIosFilm />
                      <div>{user.movies.length + ' Movies Liked'}</div>
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
                {validationButton}
              </div>
            </div>
          </div>
          <Modal
            show={this.state.showModal}
            onHide={this.handleModalClose}
            animation={false}
            style={{
              color: Colors.greyText,
            }}
          >
            <Modal.Header closeButton>
              <Modal.Title>Account Validation</Modal.Title>
            </Modal.Header>
            <Modal.Body style={{
              display: 'block',
            }}>
              <div style={{
                width: '100%',
                justifyContent: 'center',
                marginTop: '0.2rem',
                marginRight: '20px',
              }}>
                <h5 style={{
                  marginBottom: 'none',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  maxWidth: '60%',
                  textAlign: 'center',
                }}>
                  Please insert the code you received through SMS.
                </h5>
              </div>
              <div style={{
                width: '100%',
                marginTop: '0.2rem',
              }}>
                <OTPInput
                  value={this.state.otp}
                  onChange={this.handleOtpChange}
                  autoFocus
                  OTPLength={4}
                  otpType="number"
                  disabled={false}
                  style={{
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginLeft: 'auto',
                    marginRight: 'auto',
                    marginTop: '1rem',
                  }}
                />
              </div>
              <Button
                disabled={this.valButAble}
                onClick={this.handleValidationButton}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-around',
                  marginTop: '1rem',
                  width: '30%',
                  height: 'auto',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                }}>
                Validate
              </Button>
            </Modal.Body>
            <Modal.Footer>
              <Button variant="secondary" onClick={this.handleModalClose}>
                Close
              </Button>
              <Button variant="primary" onClick={this.handleModalClose}>
                Save Changes
              </Button>
            </Modal.Footer>
          </Modal>
        </div>
      );
    } else {
      this.props.history.push('/');
    }
  }
}

export default ProfileScreen;
