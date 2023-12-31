import "./Styles/App.css";
import * as React from "react";
import { Container, Col, Row, Navbar, Nav, Button } from "react-bootstrap";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import TrackingPage from "./Pages/TrackingPage";
import Scholarships from "./Pages/Scholarship2";
import SalariesPage from "./Pages/SalariesPage";
import LearningPage from "./Pages/LearningPage";
import HomePage from "./Pages/HomePage";
import LoginPage from "./Pages/LoginPage";
import SignupPage from "./Pages/SignupPage";
import EmployerDashboardPage from "./Pages/EmployerDashboardPage";
import EmployerSignupPage from "./Pages/EmployerSignupPage";
import EmployerLoginPage from "./Pages/EmployerLoginPage";
import InterviewPage from "./Pages/InterviewPage";
import ApplicationReview from "./Pages/ApplicationReview";
import TrackingPage2 from "./Pages/TrackingPage2";
import ProfileBuilder from "./Pages/ProfileBuilder";
import scholair from '../src/assets/scholair.png'


function App() {
  function signOut(){
    localStorage.removeItem("token");
    window.location.href = "http://localhost:3000/"
  }

  return (

    <Router>

       <Navbar collapseOnSelect expand="lg" style={{ backgroundColor: 'white' }}>
      <Container>
        <Navbar.Brand href="/"><img src={scholair} alt="ChatGPT Icon" style={{ marginRight: '5px', height: '80px', width: '220x' }} /></Navbar.Brand>
        <Navbar.Toggle aria-controls="responsive-navbar-nav" />
        <Navbar.Collapse id="responsive-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link href="/tracking">Tracking</Nav.Link>
            <Nav.Link href="/scholarships">Scholarships</Nav.Link>
            <Nav.Link href="/learning">Learning</Nav.Link>
            <Nav.Link href="/interview">Interview</Nav.Link>
          </Nav>
          <Nav>
            {localStorage.getItem("token") !== null ? (
              <Button
                className="navButton"
                onClick={signOut}
                style={{
                  backgroundColor: `white`,
                  color: `#264653`,
                  borderColor: `white`,
                }}
              >
                Sign out
              </Button>
            ) : (
              <div>
                <Button
                  className="navButton"
                  href="/signup"
                >
                  Sign up for free
                </Button>
                <Button
                  className="navButton"
                  href="/login"
                >
                  Sign in
                </Button>
              </div>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
      

      <div className="content">
        <Switch>
          <Route path="/" exact>
            <HomePage />
          </Route>
          <Route path="/tracking" exact>
            <TrackingPage2 />
          </Route>
          <Route path="/scholarships" exact>
            <Scholarships />
          </Route>
          <Route path="/salaries" exact>
            <SalariesPage />
          </Route>
          <Route path="/learning" exact>
            <LearningPage />
          </Route>
          <Route path="/signup" exact>
            <SignupPage />
          </Route>
          <Route path="/employersignup" exact>
            <EmployerSignupPage />
          </Route>
          <Route path="/login" exact>
            <LoginPage />
          </Route>
          <Route path="/interview" exact>
            <InterviewPage />
          </Route>
          <Route path="/profileBuilder" exact>
            <ProfileBuilder />
          </Route>
          <Route path="/applicationReview" exact>
            <ApplicationReview />
          </Route>
          <Route path="/employerdashboard" exact>
            <EmployerDashboardPage />
          </Route>
          <Route path="/" >
            <h1 style={{marginTop: `5%`, fontFamily:`Ubuntu`}}>Sorry this page doesn't exist!</h1>
          </Route> 
        </Switch>
      </div>

      <div className="footer">
      <Navbar collapseOnSelect expand="lg" sticky="bottom" style={{height:`170px`, backgroundColor:`#e29578`}}>
        <Container style={{justifyContent:`center`, marginTop:`10px`}}>
          <div>
            <h1>An all-in-one GPT-powered scholarship application tool. Simplify the search for scholarships, maximize your potential, and sharpen your interview skills – all at no cost.</h1>
            <img src={scholair} alt="ChatGPT Icon" style={{ marginRight: '5px', height: '80px', width: '220x' }} />
          </div>
        </Container>
      </Navbar>
      </div>
    </Router>
  );
}

export default App;
