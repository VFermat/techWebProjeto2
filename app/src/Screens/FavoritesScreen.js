import React, {Component} from 'react';
import {Figure, Spinner} from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

export class FavoritesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movies: null,
      loading: true,
    };
    this.user = JSON.parse(localStorage.getItem('user'));
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    const movies = [];
    if (this.user.movies.length > 0) {
      this.user.movies.forEach(async (item, index) => {
        await axios.get('http://localhost:8081/movie/'+item).then((v) => {
          movies.push(v.data);
        }).catch((e) => {
          console.log(e);
        });
        if (index === this.user.movies.length - 1) {
          this.setState({
            loading: false,
            movies: movies,
          });
        }
      });
    } else {
      this.setState({
        loading: false,
        movies: [],
      });
    }
  }

  render() {
    let movies;
    if (this.state.loading) {
      movies = <Spinner animation="border" role="status"/>;
    } else {
      movies = this.state.movies.map((item) => {
        console.log(item);
        return (
          <Figure style={{
            width: '15%',
            margin: '10px 10px 0px 10px',
          }}>
            <Figure.Image
              onClick={() => {
                this.props.history.push('/movie/'+item.imdbId);
              }}
              src={item.image}
              alt={item.title}
            />
            <Figure.Caption>
              {item.title}
            </Figure.Caption>
            <StarRatings
              rating={(item.rating)/2}
              numberOfStars={5}
              starRatedColor={Colors.extra}
              starDimension={'20px'}
              starSpacing={'1px'}
            />
          </Figure>
        );
      });
    }

    if (this.user) {
      return (
        <div>
          <Header user={this.user} history={this.props.history} />
          <div style={{
            width: '100%',
            heigth: 'auto',
            minHeight: '700px',
            display: 'flex',
            background: Colors.background,
          }}>
            <SideBar history={this.props.history} key='home'/>
            <div style={{
              width: '75%',
              height: '100%',
              marginTop: '2rem',
              marginRight: 'auto',
              marginLeft: 'auto',
              display: 'block',
              color: Colors.greyText,
            }}>
              <div style={{
                width: '100%',
                padding: '10px 0px 0px 0px',
                textAlign: 'center',
              }}><h2>My Favorites Movies:</h2></div>
              <div style={{
                width: '50%',
                margin: '10px auto 10px auto',
                borderTop: '1px solid ' + Colors.greyDark,
                borderBottom: '1px solid ' + Colors.greyDark,
              }}></div>
              <div style={{
                width: '80%',
                marginTop: '2rem',
                marginRight: 'auto',
                marginLeft: 'auto',
                display: 'flex',
                alignItems: 'start',
                justifyContent: 'space-between',
                flexWrap: 'wrap',
              }}>
                {movies}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      this.props.history.push('/');
    }
  }
}

export default FavoritesScreen;
