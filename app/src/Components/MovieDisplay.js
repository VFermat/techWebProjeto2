import React, {Component} from 'react';
import {Figure} from 'react-bootstrap';
import {IoIosHeart, IoIosHeartEmpty, IoIosThumbsDown, IoIosThumbsUp} from 'react-icons/io';
import axios from 'axios';
import {Colors} from '../Config/Colors';

const validInfo = ['rating', 'summary', 'content', 'genres', 'director', 'duration', 'year'];
const mapInfoText = {
  rating: 'IMDB Rating:',
  summary: 'Summary:',
  content: 'Content:',
  genres: 'Genres:',
  director: 'Director:',
  duration: 'Duration:',
  year: 'Year:',
};

export class MovieDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      liked: null,
    };

    this.handleMovieFavorited = this.handleMovieFavorited.bind(this);
    this.handleMovieUnfavorited = this.handleMovieUnfavorited.bind(this);
    this.handleMovieLiked = this.handleMovieLiked.bind(this);
    this.handleMovieUnliked = this.handleMovieUnliked.bind(this);
  }

  handleMovieFavorited() {
    const user = this.state.user;
    user.movies.push(this.props.movie.imdbId);
    this.setState({
      user: user,
    });
    this.props.movie.favorited.push(user.id);
  }

  handleMovieUnfavorited() {
    const user = this.state.user;
    const newMovies = [];
    const users = [];
    user.movies.map((item) => (item !== this.props.movie.imdbId) ? newMovies.push(item) : '');
    this.props.movie.favorited.map((item) => (item !== user.id) ? users.push(item) : '');
    user.movies = newMovies;
    this.setState({
      user: user,
    });
    this.props.movie.favorited = users;
  }

  handleMovieLiked() {
    if (!this.state.liked) {
      this.setState({
        liked: true,
      });
      const users = [];
      this.props.movie.unliked.map((item) => (item !== this.state.user.id) ? users.push(item) : '');
      this.props.movie.unliked = users;
      this.props.movie.liked.push(this.state.user.id);
    }
  }

  handleMovieUnliked() {
    if (this.state.liked || this.state.liked === null) {
      this.setState({
        liked: false,
      });
      const users = [];
      this.props.movie.liked.map((item) => (item !== this.state.user.id) ? users.push(item) : '');
      this.props.movie.liked = users;
      this.props.movie.unliked.push(this.state.user.id);
    }
  }

  componentDidMount() {
    if (this.props.movie.liked.includes(this.state.user.id)) {
      this.setState({
        liked: true,
      });
    } else if (this.props.movie.unliked.includes(this.state.user.id)) {
      this.setState({
        liked: false,
      });
    }
  }

  componentWillUnmount() {
    localStorage.setItem('user', JSON.stringify(this.state.user));
    axios.patch('http://localhost:8080/user/'+this.state.user.id, {
      movies: this.state.user.movies,
    }, {
      headers: {
        authorization: this.state.user.token,
      },
    });
    axios.patch('http://localhost:8081/movie/'+this.props.movie.imdbId, this.props.movie);
  }

  render() {
    // Handling the Heart Display (favoriting or not a movie)
    let heartDisplay;
    if (this.state.user.movies.includes(this.props.movie.imdbId)) {
      heartDisplay = <IoIosHeart onClick={this.handleMovieUnfavorited} size={25}/>;
    } else {
      heartDisplay = <IoIosHeartEmpty onClick={this.handleMovieFavorited} size={25}/>;
    }

    // Handling movie like/unlike
    let thumbsUp;
    let thumbsDown;
    if (this.state.liked) {
      thumbsUp = <IoIosThumbsUp onClick={this.handleMovieLiked} size={25} color='green' style={{marginRight: '0.25rem'}}/>;
      thumbsDown = <IoIosThumbsDown onClick={this.handleMovieUnliked} size={25} style={{marginRight: '0.25rem'}}/>;
    } else if (this.state.liked === false) {
      thumbsUp = <IoIosThumbsUp onClick={this.handleMovieLiked} size={25} style={{marginRight: '0.25rem'}}/>;
      thumbsDown = <IoIosThumbsDown onClick={this.handleMovieUnliked} size={25} color='red' style={{marginRight: '0.25rem'}}/>;
    } else {
      thumbsUp = <IoIosThumbsUp onClick={this.handleMovieLiked} size={25} style={{marginRight: '0.25rem'}}/>;
      thumbsDown = <IoIosThumbsDown onClick={this.handleMovieUnliked} size={25} style={{marginRight: '0.25rem'}}/>;
    }
    const infoDisplay = validInfo.map((key) => {
      let text;
      if (key === 'genres') {
        text = this.props.movie[key].map((v) => {
          return (v + ', ');
        });
      } else {
        text = this.props.movie[key];
      }
      return (
        <div style={{
          display: 'block',
          marginTop: '1rem',
        }}>
          <div style={{
            width: '100%',
            borderTop: '1px solid ' + Colors.greyDark,
            borderBottom: '1px solid ' + Colors.greyDark,
          }}></div>
          <div style={{
            marginTop: '1rem',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            color: Colors.greyText,
          }}>
            <div style={{margin: '0px 0px 0px 0.5rem'}}><h6 style={{margin: '0px'}}>{mapInfoText[key]}</h6></div>
            <div style={{
              width: '10.5rem',
              margin: '0px 0.5rem 0px 0px',
            }}><p style={{margin: '0px 0.1rem 0px 0px', textAlign: 'end'}}>{text}</p></div>
          </div>
        </div>
      );
    });
    return (
      <div>
        <div style={{
          width: '100%',
          padding: '10px 0px 0px 0px',
          textAlign: 'center',
        }}><h4>{this.props.movie.title}</h4></div>
        <div style={{
          width: '50%',
          margin: '10px auto 10px auto',
          borderTop: '1px solid ' + Colors.greyDark,
          borderBottom: '1px solid ' + Colors.greyDark,
        }}></div>
        <div style={{
          width: '100%',
          minHeight: '700px',
          marginTop: '2.25rem',
          display: 'flex',
          alignItems: 'start',
          justifyContent: 'space-between',
        }}>
          <div style={{
            width: '25%',
            height: '100%',
          }}>
            <Figure style={{
              textAlign: 'center',
            }}>
              <Figure.Image
                src={this.props.movie.image}
                alt={this.props.movie.title}/>
            </Figure>
          </div>
          <div style={{
            width: '65%',
            height: '100%',
            display: 'block',
            marginBottom: '6rem',
            alignItems: 'end',
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
            }}>
              <div style={{margin: '0px 0px 0px 0.5rem'}}>
                {heartDisplay}
              </div>
              <div style={{margin: '0px 0.1rem 0px 0px', textAlign: 'end'}}>
                {thumbsUp}
                {thumbsDown}
              </div>
            </div>
            {infoDisplay}
          </div>
        </div>
      </div>
    );
  }
}

export default MovieDisplay;
