import React, {Component} from 'react';
import {ListGroup} from 'react-bootstrap';
import {Colors} from '../Config/Colors';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.history.location.state;
  }

  render() {
    return (
      <div style={{
        height: 'auto',
        width: '15%',
        background: Colors.sideBar,
      }}>
        <ListGroup variant="flush"
          style={{
            marginTop: '1rem',
            background: Colors.sideBar,
          }}>
          <ListGroup.Item style={{
            background: Colors.sideBar,
          }}></ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/home');
          }} style={{
            background: Colors.sideBar,
          }}>Home</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/home');
          }} style={{
            background: Colors.sideBar,
          }}>Meus Filmes</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/home');
          }} style={{
            background: Colors.sideBar,
          }}>Buscar Filmes</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/profile');
          }} style={{
            background: Colors.sideBar,
          }}>Minha Conta</ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}

export default SideBar;
