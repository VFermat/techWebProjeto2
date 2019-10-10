import React, {Component} from 'react';
import {ListGroup} from 'react-bootstrap';
import {Colors} from '../Config/Colors';

class SideBar extends Component {
  constructor(props) {
    super(props);
    this.state = this.props.history.location.state;
    console.log(this.props.history);
  }

  render() {
    return (
      <div style={{
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
          }} eventKey='home'>Home</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/home');
          }} style={{
            background: Colors.sideBar,
          }} eventKey='movies'>Meus Filmes</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/home');
          }} style={{
            background: Colors.sideBar,
          }} eventKey='search'>Buscar Filmes</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/profile');
          }} style={{
            background: Colors.sideBar,
          }} eventKey='profile'>Minha Conta</ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}

export default SideBar;
