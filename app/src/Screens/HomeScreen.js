import React, {Component} from 'react';
import {Figure, Spinner} from 'react-bootstrap';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

class HomeScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      movies: null,
    };
    this.user = JSON.parse(localStorage.getItem('user'));
    this.componentDidMount = this.componentDidMount.bind(this);
  }

  async componentDidMount() {
    const movies = localStorage.getItem('movies');
    if (!movies) {
      await axios.get('http://localhost:8081/movies?category=movies&type=wanted').then((v) => {
        if (v) {
          localStorage.setItem('movies', JSON.stringify(v.data));
          this.setState({
            loading: false,
            movies: v.data,
          });
        } else {
          this.setState({
            loading: true,
          });
        }
      }).catch((e) => {
        console.log(e);
      });
    } else {
      this.setState({
        loading: false,
        movies: JSON.parse(movies),
      });
    }
  }

  render() {
    let movies;
    if (this.state.loading) {
      movies = <Spinner animation="border" role="status"/>;
    } else {
      movies = this.state.movies.movies.map((item) => {
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
              }}><h2>Most Wanted:</h2></div>
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

export default HomeScreen;
