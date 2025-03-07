"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { Container, Card, Form, Button, Alert } from "react-bootstrap";
import { toast } from "react-hot-toast";

const AdminLogin = () => {
  const [credentials, setCredentials] = useState({
    username: "",
    password: "",
  });
  const [error, setError] = useState("");
  const router = useRouter();

  const handleLogin = (e) => {
    e.preventDefault();
    setError("");

    // Basic hardcoded authentication
    // In production, use proper authentication system
    if (
      credentials.username === "admin" &&
      credentials.password === "@admin12345@"
    ) {
      sessionStorage.setItem("isAdminLoggedIn", "true");
      toast.success("Login successful!");
      router.push("/admin");
    } else {
      setError("Invalid credentials");
    }
  };

  return (
    <Container className='d-flex align-items-center justify-content-center min-vh-100'>
      <Card className='shadow-lg' style={{ maxWidth: "400px", width: "100%" }}>
        <Card.Body className='p-4'>
          <h2 className='text-center mb-4'>Admin Login</h2>

          {error && (
            <Alert variant='danger' className='mb-3'>
              {error}
            </Alert>
          )}

          <Form onSubmit={handleLogin}>
            <Form.Group className='mb-3'>
              <Form.Label>Username</Form.Label>
              <Form.Control
                type='text'
                value={credentials.username}
                onChange={(e) =>
                  setCredentials({ ...credentials, username: e.target.value })
                }
                required
              />
            </Form.Group>

            <Form.Group className='mb-4'>
              <Form.Label>Password</Form.Label>
              <Form.Control
                type='password'
                value={credentials.password}
                onChange={(e) =>
                  setCredentials({ ...credentials, password: e.target.value })
                }
                required
              />
            </Form.Group>

            <Button type='submit' variant='primary' className='w-100'>
              Login
            </Button>
          </Form>

          {/* <div className='text-center mt-3 text-muted'>
            <small>
              Default credentials:
              <br />
              Username: admin
              <br />
              Password: admin123
            </small>
          </div> */}
        </Card.Body>
      </Card>
    </Container>
  );
};

export default AdminLogin;
