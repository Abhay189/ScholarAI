import React from 'react';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import '../Styles/Scholarships.css';


function Scholarships() {
    return(
        <Container>
            <Row>
                <Col className='d-none d-md-block justify-content-center align-items-center'>
                Sidebar
                </Col>
                <Col className='justify-content-center align-items-center'>
                Scholarships
                </Col>
            </Row>
        </Container>
    );
}

export default Scholarships;