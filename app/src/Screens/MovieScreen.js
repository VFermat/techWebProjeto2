import React, {Component} from 'react';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

export class MovieScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: this.props.match.params.movieId,
      loading: true,
      movie: null,
    };
  }

  render() {
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
          <SideBar history={this.props.history} />
        </div>
      </div>
    );
  }
}

export default MovieScreen;
