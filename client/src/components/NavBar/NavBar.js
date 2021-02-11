import React from "react";
import { Navbar, Container, Button } from "react-bootstrap";
import { authLogin, authSignup, me, logout } from "../../store/index";
import { connect } from "react-redux";

class NavigationBar extends React.Component {
  logout() {
    this.props.signout();
  }

  render() {
    return (
      <div>
        <Navbar id="top-nav">
          <Navbar.Brand href="#home">Comic Sans</Navbar.Brand>
          <Container className="d-flex justify-content-end" fluid>
            <h5 className="nav-tag-line m-0">Creativity sans borders!</h5>
            <Button
              className="logout-button"
              onClick={() => {
                this.logout();
              }}
            >
              <i className="fa fa-sign-out" aria-hidden="true"></i>
            </Button>
          </Container>
        </Navbar>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return { user: state.user };
};

const mapDispatchToProps = (dispatch) => {
  return {
    signup: (userName, password) => dispatch(authSignup(userName, password)),
    login: (userName, password) => dispatch(authLogin(userName, password)),
    currentUser: () => dispatch(me()),
    signout: () => dispatch(logout()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(NavigationBar);
