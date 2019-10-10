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
      <nav style={{
        display: 'block',
        minHeight: '56px',
        height: 'auto',
        background: Colors.purpleMedium,
        color: Colors.white,
      }}>
        <div style={{
          display: 'flex',
          justifyContent: 'space-between',
        }}>
          <div onClick={() => window.location.href='/'}>
            <p style={pStyling}>MovieMe</p>
          </div>
          <div>
            {userText}
          </div>
        </div>
      </nav>
    );
  }
}

export default Header;
