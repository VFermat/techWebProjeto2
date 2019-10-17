import React, { Component } from 'react';
import { Spinner, Button, Figure } from 'react-bootstrap';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import { Colors } from '../Config/Colors';

export class SearchScreen extends Component {
  constructor(props) {
    super(props);

    this.state = {
      movieTitle: "",
      searchResults: {
        results: []
      },

      searchLoading: false
    }

    this.user = JSON.parse(localStorage.getItem('user'));

    // Connecting the methods
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.goToMovieScreen = this.goToMovieScreen.bind(this);
  }

  handleChange(event) {
    // Getting the component that changed.
    const target = event.target;

    // Getting the name of the component that changed.
    const name = target.name;

    // Getting the new value.
    const value = target.value;

    // Updating the state according to the component that changed.
    this.setState({
      [name]: value,
    });
  }

  async handleSubmit(event) {
    this.setState({
      searchLoading: true
    });

    // await new Promise((resolve) => {setTimeout(resolve, 3000)})

    const movieTitle = this.state.movieTitle;

    console.log("Buscando por: " + movieTitle);

    axios({
      "method": "GET",
      "url": "http://localhost:8081/search?",
      "params": {
        "t": movieTitle,
        "y": ""
      }
    })
      .then((v) => {
        var data = v.data;
        console.log(data);

        this.setState({
          searchResults: data
        });

        console.log("Sucesso.");
      })
      .catch((v) => {
        console.log(v.data);
        console.log("Erro ao procurar o filme.")
      });

    this.setState({
      searchLoading: false
    });

    event.preventDefault();
  }
  
  goToMovieScreen(movieId) {
    this.props.history.push("/search/" + movieId);
  }

  render() {
    if (this.user) {
      if (this.user.valid) {

        const results = this.state.searchResults.results.map((result) =>
          result.result.map((movie) =>
            <div>
              <li>{movie.title}</li>
              <li>{movie.release_date}</li>
              <li>{movie.overview}</li>
            </div>
          )
        );

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
              <SideBar />
            </div>

            <ul>{results}</ul>
          </div>
        );
      } else {

        const results = this.state.searchResults.results.map((movie) =>
          <React.Fragment>
            <Figure style={{
              width: '15%',
              margin: '10px 10px 0px 10px',
            }}>
              <Figure.Image
                onClick={() => {
                  this.props.history.push("/search/" + movie.id);
                }}
                src={"https://image.tmdb.org/t/p/w500" + movie.poster_path}
                alt={movie.title}
              />
              <Figure.Caption
                style={{ textAlign: 'center' }}>
                {movie.title}
              </Figure.Caption>
            </Figure>
          </React.Fragment>
        );

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
                width: 'auto',
                maxWidth: '75%',
                minHeight: '300px',
                heigth: '100%',
                margin: '6rem auto 0px auto',
                display: 'block',
                color: Colors.greyText,
                alignItems: 'center',
                textAlign: 'center',
              }}>
                <h3 style={{ margin: 'none' }}>Feature can only be used by users who validated their phone number. Please validate your phone number on your profile!</h3>

                <form onSubmit={this.handleSubmit}>
                  <label>
                    Search:
                    <input type="text" value={this.state.movieTitle} onChange={this.handleChange} name="movieTitle" placeholder="Movie Title" />
                  </label>

                  {this.state.searchLoading ?
                    <Button type="submit" value="Submit" >
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    </Button>
                    :
                    <Button type="submit" value="Submit" >
                      Submit
                    </Button>}
                </form>

                {/* <ul>{results}</ul> */}

                <div style={{
                  width: '80%',
                  marginTop: '2rem',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'start',
                  flexDirection: "row",
                  justifyContent: 'space-between',
                  flexWrap: 'wrap',
                }}>
                  {results}
                </div>
              </div>
            </div>
          </div>
        );
      }
    } else {
      this.props.history.push('./');
    }
  }
}


export default SearchScreen;
