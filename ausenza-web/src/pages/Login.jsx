import { useState } from "react";
import { Form, Button, Alert } from "react-bootstrap";
import api from "../services/api"; 
import { useNavigate } from "react-router-dom"; 
import "./Login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  async function handleLogin(e) {
    e.preventDefault();
    setError("");

    try {
      const response = await api.post("/auth/login", { email, password });
      
      const token = response.data.token;
      localStorage.setItem("token", token);
      
      navigate("/dashboard");

    } catch (err) {
      console.error(err);
      setError("Email ou senha incorretos.");
    }
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <h2 className="login-title">Ausenza RH</h2>
        <p className="text-muted text-center mb-4">Entre para gerenciar a equipe</p>
        
        {error && <Alert variant="danger">{error}</Alert>}

        <Form onSubmit={handleLogin}>
          <Form.Group className="mb-3">
            <Form.Label>Email Corporativo</Form.Label>
            <Form.Control 
              type="email" 
              placeholder="ex: admin@ausenza.com" 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-4">
            <Form.Label>Senha</Form.Label>
            <Form.Control 
              type="password" 
              placeholder="********" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </Form.Group>

          <Button variant="primary" type="submit" className="w-100 btn-custom">
            ACESSAR SISTEMA
          </Button>
        </Form>
      </div>
    </div>
  );
}