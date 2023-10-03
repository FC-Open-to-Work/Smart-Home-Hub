import * as React from "react";

import { FormEvent } from "react";
import { useState } from "react";
import { Container, FormText } from "react-bootstrap";
import { Row, Col } from "react-bootstrap";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";

import { Link } from "react-router-dom";

import { useAuthDispatch } from "../context/auth";

import axios from "axios";

export default function Login() {
  const [variables, setVariables] = useState({
    email: "",
    password: "",
  });

  const [errors, setErrors] = useState({
    email: "",
    password: "",
  });

  const dispatch = useAuthDispatch();

  function submitLoginForm(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const api_domain = process.env.BACKEND_API_DOMAIN
      ? process.env.BACKEND_API_DOMAIN
      : "localhost";
    const api_url =
      "http://" + api_domain + ":" + process.env.REACT_APP_BACKEND_API_PORT;

    axios
      .post(api_url + "/login", {
        email: variables.email,
        password: variables.password,
      })
      .then(function (response) {
        // handle success
        console.log(response);
        dispatch({ type: "LOGIN", token: response.data.token });
        window.location.href = "/";
      })
      .catch(function (error) {
        // handle error
        console.log(error);
        if (error.response) {
          if (error.response.status === 401) {
            setErrors({ ...errors, password: error.response.data.error });
          } else if (error.response.status === 404) {
            setErrors({ ...errors, email: error.response.data.error });
          } else {
            setErrors({
              ...errors,
              email: "Error from backend: " + error.response.status,
            });
          }
        } else if (error.request) {
          setErrors({
            ...errors,
            email: "No response",
          });
        } else {
          setErrors({
            ...errors,
            email: "Error when setting up the request",
          });
        }
      });
  }

  return (
    <Container className="justify-content-center">
      <Row className="justify-content-center pt-5">
        <Col className="bg-light p-5 justify-content-center" lg={6} md={8}>
          <h2 className="fs-2 text-dark text-center">Login</h2>
          <Form onSubmit={submitLoginForm}>
            <Form.Group className="mb-3" controlId="LoginEmail">
              <Form.Label className={errors.email && "text-danger"}>
                {errors.email || "Email address"}
              </Form.Label>
              <Form.Control
                type="email"
                value={variables.email}
                className={errors.email && "is-invalid"}
                onChange={(e) =>
                  setVariables({ ...variables, email: e.target.value })
                }
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group className="mb-3" controlId="LoginPassword">
              <Form.Label className={errors.password && "text-danger"}>
                {errors.password || "Password"}
              </Form.Label>
              <Form.Control
                type="password"
                value={variables.password}
                className={errors.password && "is-invalid"}
                onChange={(e) =>
                  setVariables({ ...variables, password: e.target.value })
                }
                placeholder="******"
              />
            </Form.Group>

            <div className="text-center">
              <Button variant="primary" type="submit">
                Submit
              </Button>
              <br />
              <div className="mt-2">
                <FormText>
                  Don't have an account? <Link to="/register">Register</Link>
                </FormText>
              </div>
            </div>
          </Form>
        </Col>
      </Row>
    </Container>
  );
}
