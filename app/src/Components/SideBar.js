import React, {Component} from 'react';
import {ListGroup, ToggleButton} from 'react-bootstrap';
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
            this.props.history.push('/favorites');
          }} style={{
            background: Colors.sideBar,
          }}>My Favotires</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/search');
          }} style={{
            background: Colors.sideBar,
          }}>Search</ListGroup.Item>
          <ListGroup.Item action onClick={() => {
            this.props.history.push('/profile');
          }} style={{
            background: Colors.sideBar,
          }}>Profile</ListGroup.Item>
        </ListGroup>
      </div>
    );
  }
}

export default SideBar;
