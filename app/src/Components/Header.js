import React, {Component} from 'react';
import {Colors} from '../Config/Colors';

class Header extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    const pStyling = {
      fontSize: '2.1rem',
      paddingLeft: '1rem',
      paddingRight: '1rem',
      paddingTop: '0.5rem',
      margin: '0',
    };
    let userText;
    if (this.props.user) {
      userText = <p style={pStyling}>Ola {this.props.user.name}</p>;
    } else {
      userText = <p></p>;
    }
    return (
      <div style={{
        display: 'block',
        minHeight: '56px',
        height: 'auto',
        width: '100%',
        background: Colors.header,
        color: Colors.white,
        boxShadow: '0 2px 5px 0 rgba(0,0,0,0.16), 0 2px 10px 0 rgba(0,0,0,0.12)',
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div onClick={() => this.props.history.push('/home')}>
            <p style={pStyling}>MovieMe</p>
          </div>
          <div>
            {userText}
          </div>
        </div>
      </div>
    );
  }
}

export default Header;
