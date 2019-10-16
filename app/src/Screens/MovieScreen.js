import React, {Component} from 'react';
import {Spinner} from 'react-bootstrap';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';
import MovieDisplay from '../Components/MovieDisplay';

export class MovieScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieId: this.props.match.params.movieId,
      loading: true,
      movie: null,
    };
    this.user = JSON.parse(localStorage.getItem('user'));
  }

  async componentDidMount() {
    if (!this.state.movie) {
      await axios.get('http://localhost:8081/movie/' + this.state.movieId).then((v) => {
        if (v) {
          this.setState({
            loading: false,
            movie: v.data,
          });
        } else {
          this.setState({
            loading: true,
          });
        };
      }).catch((e) => {
        this.setState({
          loading: true,
        });
      });
    }
  }

  async componentDidMount() {
    if (!this.state.movie) {
      await axios.get('http://localhost:8081/movie/' + this.state.movieId).then((v) => {
        if (v) {
          this.setState({
            loading: false,
            movie: v.data,
          });
        } else {
          this.setState({
            loading: true,
          });
        };
      }).catch((e) => {
        this.setState({
          loading: true,
        });
      });
    }
  }

  render() {
    if (this.user) {
      let display;
      if (this.state.loading) {
        display = <Spinner animation="border" role="status"/>;
      } else {
        display = <MovieDisplay movie={this.state.movie} />;
      }
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
            <div style={{
              width: '75%',
              height: '100%',
              marginTop: '2rem',
              marginRight: 'auto',
              marginLeft: 'auto',
              display: 'block',
              color: Colors.greyText,
            }}>
              {display}
            </div>
          </div>
        </div>
      );
    } else {
      this.props.history.push('./');
    }
  }
}

export default MovieScreen;
