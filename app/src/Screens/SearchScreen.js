import React, {Component} from 'react';
import {Spinner, Button, Figure, OverlayTrigger, Tooltip} from 'react-bootstrap';
import {FaPoop, FaFire} from 'react-icons/fa';
import StarRatings from 'react-star-ratings';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';

export class SearchScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movieTitle: '',
      searchResults: [],
      searchLoading: false,
    };

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

  async handleSubmit(event) {
    this.setState({
      searchLoading: true,
    });

    // await new Promise((resolve) => {setTimeout(resolve, 3000)})

    const movieTitle = this.state.movieTitle;

    console.log('Buscando por: ' + movieTitle);

    await axios.get('http://52.14.233.110/search', {
      'params': {
        'title': movieTitle,
        'year': '',
      },
    }).then((v) => {
      const result = v.data.result;
      console.log(result);

      this.setState({
        searchResults: result,
      });

      console.log('Sucesso.');
    }).catch((e) => {
      console.log(e.data);
      console.log('Erro ao procurar o filme.');
    });

    this.setState({
      searchLoading: false,
    });

    event.preventDefault();
  }

  render() {
    if (this.user) {
      if (this.user.valid) {
        const movies = this.state.searchResults.map((item) => {
          let fire;
          if (item.liked.length > 4*item.unliked.length) {
            fire = <OverlayTrigger
              key='right'
              placement='right'
              overlay={
                <Tooltip id={`tooltip-right`}>
                        This Icon means that more than 80% of our users like this movie!
                </Tooltip>
              }>
              <FaFire size={25} color={Colors.greyText}/>
            </OverlayTrigger>;
          } else if (item.unliked.length > item.liked.length) {
            fire = <OverlayTrigger
              key='right'
              placement='right'
              overlay={
                <Tooltip id={`tooltip-right`}>
                This Icon means that more than 50% of our users do not like this movie!
                </Tooltip>
              }>
              <FaPoop size={25} color={Colors.greyText}/>
            </OverlayTrigger>;
          } else {
            fire = <></>;
          }
          return (
            <Figure style={{
              width: '15%',
              margin: '10px 10px 0px 10px',
            }}>
              <Figure.Image
                onClick={() => {
                  this.props.history.push('/search/'+item.imdbId);
                }}
                src={item.image}
                alt={item.title}
              />
              <Figure.Caption style={{textAlign: 'center'}}>
                {item.title}
              </Figure.Caption>
              <div style={{
                marginTop: '0.3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                {fire}
              </div>
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

        return (
          <div>
            <Header history={this.props.history}/>
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
                <div style={{
                  width: '90%',
                  marginRight: 'auto',
                  marginLeft: 'auto',
                  display: 'flex',
                  alignItems: 'center',
                  flexWrap: 'wrap',
                }}>
                  <form onSubmit={this.handleSubmit}
                    style={{
                      padding: '0px 0.5rem 0px 0.5rem',
                      alignContent: 'center',
                      alignItems: 'center',
                    }}>
                    <label style={{
                      margin: '0px',
                    }}>
                      Search:
                      <input type="text"
                        value={this.state.movieTitle}
                        onChange={this.handleChange}
                        name="movieTitle"
                        placeholder="Movie Title"
                        style={{
                          margin: '0px 0.5rem 0px 0.5rem',
                        }}/>
                    </label>
                  </form>
                  {this.state.searchLoading ?
                    <Button type="submit" value="Submit" >
                      <Spinner as="span" animation="border" size="sm" role="status" aria-hidden="true" />
                    </Button> :
                    <Button type="submit" value="Submit" onClick={this.handleSubmit}>
                      Submit
                    </Button>}
                </div>
                <div style={{
                  width: '90%',
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
        return (
          <div>
            <Header history={this.props.history}/>
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
                <h3 style={{margin: 'none'}}>Feature can only be used by users who validated their phone number. Please validate your phone number on your profile!</h3>
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
