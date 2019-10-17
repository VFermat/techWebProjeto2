import React from 'react';
import { Spinner } from 'react-bootstrap';
import axios from 'axios';

export default class MovieDisplay extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            loading: true
        };

        this.movieId = this.props.movieId;

        this.user = JSON.parse(localStorage.getItem('user'));
    }

    async componentDidMount() {
        await axios.get("http://localhost:8081/search/" + this.movieId)
            .then((v) => {
                const data = v.data;
                console.log(data);

                this.setState({
                    ...this.setState,
                    movie: data
                });

                console.log(this.state.movie.title);

                console.log("Sucesso.");
            })
            .catch((v) => {
                console.log(v.data);
                console.log("Erro ao procurar o filme.")
            });

        this.setState({
            loading: false
        });
    }

    render() {
        if (this.state.loading) {
            return (
                <div style={{
                    margin: "auto",
                    width: "50%",
                    textAlign: "center"
                }}>
                    <Spinner as="span" animation="border" role="status" aria-hidden="true" />
                </div>
            );
        } else {
            return (
                <div style={{
                    margin: "2.5rem auto 0px auto",
                    width: "50%",
                    textAlign: "center"
                }}>
                    <h2>{this.state.movie.title}</h2>
                    <h2>Overview: {this.state.movie.overview}</h2>
                    <h2>runtime: {this.state.movie.runtime}</h2>
                    <h2>Release Date: {this.state.movie.release_date}</h2>
                    <h2>Budget: {this.state.movie.budget}</h2>
                    <h2>Revenue: {this.state.movie.revenue}</h2>
                    <h2>IMDB ID: {this.state.movie.imdb_id}</h2>
                </div>
            );
        }
    }
}
