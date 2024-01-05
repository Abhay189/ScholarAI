import React, { useState ,useEffect } from 'react';
import Axios from "axios";
import {Container, Card, Form} from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../Styles/Scholarships.css';
import { styles } from "../styles"


function Sidebar(){
    return(
        <div className='sidebar'>
            {/* <button></button>
            <button>My Institution</button>
            <button>Need Based</button>
            <button>Merit Based</button>
            <button>Deadline soon</button> */}
            <Form className='form'>
                <Form.Check // prettier-ignore
                    type="switch"
                    id="Eligible Scholarships"
                    label="Eligible Scholarships"
                    className='custom_formcheck'
                />
                <Form.Check // prettier-ignore
                    // disabled
                    type="switch"
                    label="My Institution"
                    id="My Institution"
                    className='custom_formcheck'
                />
                <Form.Check // prettier-ignore
                    // disabled
                    type="switch"
                    label="Deadline soon"
                    id="Deadline soon"
                    className='custom_formcheck'
                />
                <Form.Check // prettier-ignore
                    // disabled
                    type="switch"
                    label="Need Based"
                    id="Need Based"
                    className='custom_formcheck'
                />
                <Form.Check // prettier-ignore
                    // disabled
                    type="switch"
                    label="Merit Based"
                    id="Merit Based"
                    className='custom_formcheck'
                />
            </Form>
        </div>
    );
}

function Scholarships() {
    const [scholarships, setScholarships] = useState();

    useEffect( () => {
        const fetchData = async () => {
            try {
              const response = await Axios.get("http://127.0.0.1:5000/get_all_scholarships_brief?username=zeeshan", {
              })
              console.log(response);
              setScholarships(response.data);
            } catch (error) {
              console.error("Error in getting resources for Scholarship page", error);
            }
          };
          console.log("I got your scholarships ");
      
          fetchData();
    }
    , []
    )

    const redirectToApplicationReview = (applicationTitle) => {
        localStorage.setItem("ApplicationReviewTitle",applicationTitle);
        // Reloads the current page
        window.location.reload();
        // Redirects to the main page
        window.location.href = "http://localhost:3000/applicationReview";
    };


    return(
        <div>
        <Container className='scholarship_container'>
            <Row className='scholarship_rows justify-content-center'>
                <Col className='d-none d-md-block justify-content-center align-items-center'>
                <Sidebar />
                </Col>
                <Col md={9} className='scholarship_col'>
                    <div className="scholarship_title">
                        <h1 className={`${styles.heroHeadText}`} style={{ fontWeight: 'bold', fontSize: '50px', textAlign: 'center', marginBottom: '35px', paddingTop:`70px` }}>Scholarships</h1>
                    </div>
                    
                    <div className='scholarship_card_space'>
                        {scholarships?.map((scholarship,index) => {
                        const key = `${scholarship.id}-${index}`;
                        return (
                            <div key={key} className="scholarship-card" style={{ marginBottom:"20px", width: "20rem", height:"100%", maxHeight: "600px", background: '#FFFFFF', margin: `1% 0`, borderRadius: '35px', textAlign: 'center', padding: '11px', position: 'relative' }}>
                            {/* Centered Image */}
                            <img
                            src={scholarship.Image} // Replace with the actual image URL
                            alt="Scholarship Logo"
                            style={{ width: '30%', marginBottom: '5px' }}
                            />
                        
                            <Card.Body style={{ cursor: `pointer`, display:`flex`, flexDirection:'column', height: `auto`}} onClick={() => redirectToApplicationReview(scholarship.Title)}>
                            <Card.Title>{scholarship.Title}</Card.Title>
                            <Card.Subtitle className="mb-2 text-muted">
                                {scholarship.Institution}
                            </Card.Subtitle>
                            <div style={{ margin: '15px 0' }}>
                                {scholarship.Requirements.map((requirement, index) => (
                                <p key={index}  className="requirement-text">
                                    #{requirement}
                                </p>
                                ))}
                            </div>
                            <div style={{ position: 'relative', bottom: '0', left: '0', width: '100%', borderTop: '1px solid #ccc', padding: '10px', borderRadius: '0px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gridGap: '0px' }}>
                                <div style={{ borderBottom: '1px solid #d3d3d3', borderRight: '1px solid #d3d3d3', padding: '10px' }}>💸{scholarship["Scholarship Amount"]}</div>
                                <div style={{ borderBottom: '1px solid #d3d3d3', padding: '10px' }}>📆​ {scholarship.Deadline}</div>
                                <div style={{ borderRight: '1px solid #d3d3d3', padding: '10px' }}>⌛​ {scholarship["Estimated Completion Time"]}</div>
                                <div style={{ padding: '10px' }}>📜 Upto {scholarship["Number of Recipients"]} Recipients</div>
                                </div>
                            </div>
                            </Card.Body>
                        </div>  
                    
                        );
                        })}
                        
                    </div>
                </Col>
            </Row>
        </Container>
        </div>
    );
}

export default Scholarships;