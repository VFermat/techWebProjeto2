import React, { Component } from 'react';
import { Spinner, Button } from 'react-bootstrap';
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

  handleSubmit(event) {
    this.setState({
      searchLoading: true
    });

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
          <div>
            <li>{movie.title}</li>
            <li>{movie.release_date}</li>
            <li>{movie.overview}</li>
          </div>
        );

        const submitButton =
            <Button type="submit" value="Submit" >
              Submit
            </Button>;

        if (this.state.searchLoading === true) {
          const submitButton =
            <Button type="submit" value="Submit" >
              Submit
              <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
            </Button>;
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
                width: 'auto',
                maxWidth: '50%',
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

                  {submitButton}
                </form>

                <ul>{results}</ul>
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
