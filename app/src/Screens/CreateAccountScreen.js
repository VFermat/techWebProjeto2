import React, {Component} from 'react';
import {Form, Button, Spinner} from 'react-bootstrap';
import axios from 'axios';
import Header from '../Components/Header';
import {Colors} from '../Config/Colors';

class CreateAccountScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password: '',
      phone: '',
      loading: false,
    };

    this.handleInputChange = this.handleInputChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.checkForm = this.checkForm.bind(this);
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    if (name === 'phone') {
      if (value >= '0' && value <= '9' && value.length < 15) {
        this.setState({
          [name]: value,
        });
      }
    } else if (name !== 'name') {
      this.setState({
        [name]: value,
      });
    } else {
      this.setState({
        [name]: value.toUpperCase(),
      });
    }
  }

  handleSubmit(event) {
    this.setState({
      loading: true,
    });
    axios.post('http://localhost:8080/user', {
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      phone: this.state.phone,
    }).then((v) => {
      this.props.history.push('/');
    }).catch((e) => {
      alert('Deu ruim ze');
      this.setState({
        loading: false,
      });
    });
  }

  checkForm() {
    const email = this.state.email;
    const password = this.state.password;
    const name = this.state.name;

    return email.length > 0 && email.includes('@') && password.length > 0 && name.length > 0;
  }

  render() {
    let button;
    if (this.state.loading) {
      button = <Button block disabled style={{width: '100%'}} type="submit">
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        /></Button>;
    } else {
      button = <Button block disabled={!this.checkForm()} onClick={this.handleSubmit}>Criar Conta</Button>;
    }
    return (
      <div style={{
        background: Colors.background,
        minHeight: '100%',
      }}>
        <Header />
        <div className="section-wrap" style={{
          padding: '30px 0px 100px 0px',
          display: 'flex',
          maxWidth: '70%',
          marginRight: 'auto',
          marginLeft: 'auto',
          position: 'relative',
        }}>
          <div className="elementor-row" style={{
            display: 'flex',
            flexWrap: 'wrap',
            alignContent: 'flex-start',
            width: '100%',
            alignItems: 'center',
            orientation: 'vertical',
          }}>
            <div className="element-heading" style={{
              width: '100%',
              textAlign: 'center',
              marginBottom: '20px',
              fontSize: '1.25rem',
              fontWeight: '400',
              color: Colors.greyText,
            }}>
              <h2>Create Account</h2>
            </div>
            <div className="form-wrap" style={{
              display: 'flex',
              width: '100%',
              alignItems: 'center',
            }}>
              <Form style={{
                width: '40%',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
              }} onSubmit={this.handleSubmit}>
                <Form.Group controlId="fromGroupName" style={{
                  width: '100%',
                }}>
                  <Form.Label>Name:</Form.Label>
                  <Form.Control name="name"
                    type="text"
                    onChange={this.handleInputChange}
                    placeholder="Your Name"
                    value={this.state.name}/>
                </Form.Group>
                <Form.Group controlId="formGroupEmail" style={{
                  width: '100%',
                }}>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control name="email"
                    type="email"
                    onChange={this.handleInputChange}
                    placeholder="Your Email"
                    value={this.state.email}/>
                </Form.Group>
                <Form.Group controlId="formGroupPhone" style={{
                  width: '100%',
                }}>
                  <Form.Label>Phone:</Form.Label>
                  <Form.Control name="phone"
                    type="text"
                    onChange={this.handleInputChange}
                    placeholder="Your Phone"
                    value={this.state.phone}/>
                </Form.Group>
                <Form.Group controlId="formGroupPassword" style={{
                  width: '100%',
                }}>
                  <Form.Label>Senha:</Form.Label>
                  <Form.Control
                    name="password"
                    type="password"
                    onChange={this.handleInputChange}
                    placeholder="Sua Senha"
                    value={this.state.password}/>
                </Form.Group>
              </Form>
            </div>
            <div style={{
              width: '100%',
              marginTop: '1rem',
              display: 'flex',
              textAlign: 'center',
            }}>
              <div style={{
                width: '40%',
                marginLeft: 'auto',
                marginRight: 'auto',
                position: 'relative',
              }}>
                <div style={{
                  width: '30%',
                  marginLeft: 'auto',
                  marginRight: 'auto',
                  position: 'relative',
                }}>
                  {button}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default CreateAccountScreen;
