import React from "react";
import { Container, Card } from "react-bootstrap";
import { Spinner } from "react-bootstrap";

const Loading = ({show}) => {

    return (
        <div style={show ? {} : {display: "none"}}>
            <Container className="d-flex justify-content-center align-items-center" style={{height: window.innerHeight - 54}}>
                <Card className="p-5 align-items-center" style={{width: 600}}>
                    <Spinner animation="border"/>
                </Card>
            </Container>
        </div>
    );
};

export default Loading