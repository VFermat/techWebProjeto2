import React, { Component } from 'react';
import axios from 'axios';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import { Colors } from '../Config/Colors';
import MovieDisplay from '../Components/NewMovieDisplay';

export class SearchScreen extends Component {
    constructor(props) {
        super(props);

        this.state = {
        }

        this.user = JSON.parse(localStorage.getItem('user'));

        this.movieId = this.props.match.params.movieId;
        console.log(this.movieId);

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
        event.preventDefault();
    }

    render() {
        if (this.user) {
            if (this.user.valid) {
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
                    </div>
                );
            } else {
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

                            <MovieDisplay movieId={this.movieId} />
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
