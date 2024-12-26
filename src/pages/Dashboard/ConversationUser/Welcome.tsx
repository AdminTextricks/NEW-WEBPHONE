import React from "react";
import { Button, Col, Row } from "reactstrap";

const Welcome = () => {

  return (
    <React.Fragment>
      <div className="chat-welcome-section">
        <Row className="w-100 justify-content-center">
          <Col xxl={5} md={7}>
            <div className="p-4 text-center">
              <div className="avatar-xl mx-auto mb-4">
                <div className="avatar-title bg-soft-primary rounded-circle">
                  <i className="bx bxs-message-alt-detail display-4 text-primary m-0"></i>
                </div>
              </div>
              <h4>Welcome to CallAnalog Webphone</h4>
              <p className="text-muted mb-4">
                Experience seamless communication with CallAnalog Webphone.
                Whether it's voice calls or instant messaging, stay connected
                effortlessly.
              </p>
              <Button
                type="button"
                className="btn btn-primary w-lg"
              >
                Get Started
              </Button>
            </div>
          </Col>
        </Row>
      </div>
    </React.Fragment>
  );
};

export default Welcome;
