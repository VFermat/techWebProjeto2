import React, {Component} from 'react';
import {Form, Button, Spinner} from 'react-bootstrap';
import axios from 'axios';
import Header from '../Components/Header';
import {Colors} from '../Config/Colors';

class LoginScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
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

    this.setState({
      [name]: value,
    });
  }

  handleSubmit(event) {
    this.setState({
      loading: true,
    });
    axios.post('http://localhost:8080/login', {
      email: this.state.email,
      password: this.state.password,
    }).then((v) => {
      const user = v.data;
      this.setState({
        loading: false,
      });
      console.log(user);
      localStorage.setItem('user', JSON.stringify(user));
      this.props.history.push('/home');
    }).catch((e) => {
      alert('Deu Ruim Ze!');
      this.setState({
        loading: false,
      });
      // this.props.history.push('/home', {user: {
      //   name: 'vitor',
      //   email: 'a@a.com',
      //   password: '123456',
      // }});
    });
    event.preventDefault();
  }

  checkForm() {
    const email = this.state.email;
    const password = this.state.password;

    return email.length > 0 && email.includes('@') && password.length > 0;
  }

  render() {
    let loginButton;
    if (this.state.loading) {
      loginButton = <Button block disabled style={{width: '100%'}} type="submit">
        <Spinner
          as="span"
          animation="border"
          size="sm"
          role="status"
          aria-hidden="true"
        /></Button>;
    } else {
      loginButton = <Button block disabled={!this.checkForm()} style={{width: '100%'}} type="submit">Login</Button>;
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
              <h2>Faça seu Login</h2>
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
                <Form.Group controlId="formGroupEmail" style={{
                  width: '100%',
                }}>
                  <Form.Label>Email:</Form.Label>
                  <Form.Control name="email"
                    type="email"
                    onChange={this.handleInputChange}
                    placeholder="Seu Email"
                    value={this.state.email}/>
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
                <Form.Group style={{
                  width: '30%',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  position: 'relative',
                }}>
                  {loginButton}
                </Form.Group>
              </Form>
            </div>
            <div style={{
              width: '50%',
              margin: '10px auto 10px auto',
              borderTop: '1px solid ' + Colors.greyDark,
              borderBottom: '1px solid ' + Colors.greyDark,
            }}></div>
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
                  <Button block onClick={() => {
                    this.props.history.push('/user');
                  }}>Criar Conta</Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
}

export default LoginScreen;
