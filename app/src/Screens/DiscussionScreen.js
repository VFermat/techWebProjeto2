import React, {Component} from 'react';
import {Button, Spinner, Modal, Form, ListGroup} from 'react-bootstrap';
import Header from '../Components/Header';
import SideBar from '../Components/SideBar';
import {Colors} from '../Config/Colors';
import axios from 'axios';

export class DiscussionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: JSON.parse(localStorage.getItem('user')),
      acceptedSpoiler: false,
      loadingComments: true,
      comments: [],
      showModal: false,
      comment: '',
    };

    this.handleAcceptance = this.handleAcceptance.bind(this);
    this.handleGoBack = this.handleGoBack.bind(this);
    this.handleModalOpen = this.handleModalOpen.bind(this);
    this.handleModalClose = this.handleModalClose.bind(this);
    this.handleInputChange = this.handleInputChange.bind(this);
    this.addComment = this.addComment.bind(this);
  }

  handleAcceptance() {
    this.setState({
      acceptedSpoiler: true,
    });
  }

  handleGoBack() {
    this.props.history.goBack();
  }

  handleModalOpen() {
    this.setState({
      showModal: true,
    });
  }

  handleModalClose() {
    this.setState({
      showModal: false,
    });
  }

  handleInputChange(event) {
    const target = event.target;
    const name = target.name;
    const value = target.value;

    if (name !== 'name') {
      this.setState({
        [name]: value,
      });
    } else {
      this.setState({
        [name]: value.toUpperCase(),
      });
    }
  }


  async addComment() {
    await axios.post('http://localhost:8081/comments/1', {
      user: this.state.user.id,
      movie: this.props.match.params.movieId,
      comment: this.state.comment,
    }).then((v) => {
      alert('Comment succesfully added!');
      this.state.comments.push(v);
      this.setState({
        showModal: false,
        comments: this.state.comments,
      });
    }).catch((e) => {
      alert('Error. Please try again!');
    });
  }

  async componentDidMount() {
    await axios.get('http://localhost:8081/comments/' + this.props.match.params.movieId).then((v) => {
      this.setState({
        comments: v.data.comments,
        loadingComments: false,
      });
    }).catch((e) => {
      console.log(e.response);
      this.setState({
        loadingComments: true,
      });
    });
  }

  render() {
    let display;
    if (this.state.acceptedSpoiler) {
      display = <div>
        <h3 style={{
          textAlign: 'center',
          color: Colors.greyText,
          marginTop: '2rem',
        }}>Comments on {this.props.history.location.state.movie.title}</h3>
        <div style={{
          display: 'block',
          width: '75%',
          minHeight: '5rem',
          maxHeight: '15rem',
          margin: '0.5rem auto 0px auto',
          padding: '0.2rem',
          overflowY: 'scroll',
          background: Colors.extra,
        }}>
          <ListGroup variant="flush"
            style={{
              marginTop: '1rem',
              background: Colors.extra,
            }}>
            {this.state.loadingComments ?
              <Spinner as="span" animation="border" role="status" aria-hidden="true" /> :
              this.state.comments.map((comment) => <ListGroup.Item style={{
                background: Colors.extra,
                display: 'block',
              }}>
                <p style={{margin: '0px', textAlign: 'center'}}>{comment.comment}</p>
              </ListGroup.Item>)}
          </ListGroup>
        </div>
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          margin: '2rem auto 0px auto',
        }}>
          <Button onClick={this.handleModalOpen}>Add Comment</Button>
        </div>
      </div>;
    } else {
      display = <div style={{
        width: '50%',
        minHeight: '7rem',
        margin: '5rem auto 0px auto',
        padding: '1rem',
        background: Colors.extra,
        color: Colors.greyText,
        display: 'block',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <h3 style={{
            margin: '0.2rem auto 0px auto',
            textAlign: 'center',
            maxWidth: '75%',
          }}>This page might have contain spoilers. Are you sure that you want to continue?</h3>
        </div>
        <div style={{
          maxWidth: '75%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          margin: '1rem auto 0px auto',
          paddingBottom: '0.2rem',
        }}>
          <Button style={{
            textAlign: 'center',
            background: Colors.header,
            borderColor: Colors.header,
          }} onClick={this.handleAcceptance}>Yes!</Button>
          <Button style={{
            textAlign: 'center',
            background: Colors.SideBar,
            borderColor: Colors.SideBar,
          }} onClick={this.handleGoBack}>Please No!</Button>
        </div>
      </div>;
    }
    return (
      <div>
        <Header user={this.state.user} history={this.props.history}/>
        <div style={{
          width: '100%',
          minHeight: '700px',
          display: 'flex',
          background: Colors.background,
        }}>
          <SideBar history={this.props.history} />
          <div style={{
            display: 'block',
            maxWidth: '70%',
            minWidth: '40%',
            height: '100%',
            marginRight: 'auto',
            marginLeft: 'auto',
            position: 'relative',
          }}>
            {display}
          </div>
        </div>
        <Modal
          show={this.state.showModal}
          onHide={this.handleModalClose}
          animation={false}
          style={{
            color: Colors.greyText,
          }}>
          <Modal.Header closeButton>
            <Modal.Title>Add Comment</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{
            display: 'block',
          }}>
            <Form style={{
              width: '70%',
              marginLeft: 'auto',
              marginRight: 'auto',
              position: 'relative',
            }}>
              <Form.Group controlId="comment">
                <Form.Label>Comment:</Form.Label>
                <Form.Control name="comment"
                  type="text"
                  as="textarea" rows="4"
                  onChange={this.handleInputChange}
                  placeholder="Your comment"
                  value={this.state.comment}/>
              </Form.Group>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={this.handleModalClose}>
              Close
            </Button>
            <Button variant="primary" onClick={this.addComment}>
              Add
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    );
  }
}

export default DiscussionScreen;
