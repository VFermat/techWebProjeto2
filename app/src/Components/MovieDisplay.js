import React, {Component} from 'react';
import {Figure} from 'react-bootstrap';
import {IoIosHeart, IoIosHeartEmpty} from 'react-icons/io';
import StarRating from 'react-star-ratings';
import {Colors} from '../Config/Colors';

const validInfo = ['rating', 'summary', 'content', 'genres', 'director', 'duration', 'year'];
const mapInfoText = {
  summary: 'Resumo:',
  content: 'Classificação Indicativa:',
  genres: 'Categorias:',
  director: 'Diretor:',
  duration: 'Duração:',
  year: 'Ano de Lançamento',
};

export class MovieDisplay extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
    };

    this.handleMovieLike = this.handleMovieLike.bind(this);
    this.handleMovieUnlike = this.handleMovieUnlike.bind(this);
  }

  handleMovieLike() {
    const user = this.state.user;
    user.movies.push(this.props.movie.imdbId);
    this.setState({
      user: user,
    });
  }

  handleMovieUnlike() {
    const user = this.state.user;
    const newMovies = [];
    user.movies.map((item) => (item !== this.props.movie.imdbId) ? newMovies.push(item) : '');
    user.movies = newMovies;
    this.setState({
      user: user,
    });
  }

  componentWillUnmount() {
    localStorage.setItem('user', JSON.stringify(this.state.user));
  }

  render() {
    let heartDisplay;
    if (this.state.user.movies.includes(this.props.movie.imdbId)) {
      heartDisplay = <IoIosHeart onClick={this.handleMovieUnlike}/>;
    } else {
      heartDisplay = <IoIosHeartEmpty onClick={this.handleMovieLike}/>;
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
      if (key === 'rating') {
        return (
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
          }}>
            <div style={{margin: '0px 0px 0px 0.5rem'}}>{heartDisplay}</div>
            <div style={{margin: '0px 0.5rem 0px 0px'}}>
              <StarRating
                rating={(this.props.movie[key])/2}
                numberOfStars={5}
                starRatedColor={Colors.extra}
                starDimension={'2rem'}
                starSpacing={'0.1rem'}
              />
            </div>
          </div>
        );
      } else {
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
      }
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
            {infoDisplay}
          </div>
        </div>
      </div>
    );
  }
}

export default MovieDisplay;
