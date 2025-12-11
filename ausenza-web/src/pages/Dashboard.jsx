import { useEffect, useState } from "react";
import { Container, Navbar, Nav, Table, Button, Card, Badge, Modal, Form, Alert, Toast, ToastContainer, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

export function Dashboard() {
  const [funcionarios, setFuncionarios] = useState([]);
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");
  
  const [loading, setLoading] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");

  useEffect(() => {
    carregarFuncionarios();
  }, []);

  async function carregarFuncionarios() {
    try {
      const response = await api.get("/funcionarios");
      setFuncionarios(response.data);
    } catch (error) {
      if (error.response?.status === 403) {
        handleLogout();
      }
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function abrirModalFerias(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setMsgErro("");
    setDataInicio("");
    setDataFim("");
    setShowModal(true);
  }

  async function handleSalvarSolicitacao() {
    setLoading(true);
    setMsgErro("");

    try {
      const payload = {
        dataInicio: dataInicio,
        dataFim: dataFim,
        tipoAusencia: "FERIAS",
        observacao: "Solicitado via Web"
      };

      await api.post(`/solicitacoes/funcionario/${funcionarioSelecionado.id}`, payload);
      
      setShowModal(false);
      setToastMessage(`Solicitação enviada para ${funcionarioSelecionado.nome}! Aguardando aprovação.`);
      setShowToast(true);
      
      carregarFuncionarios();

    } catch (error) {
      console.error(error);
      setMsgErro(error.response?.data?.message || "Erro ao solicitar férias.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Navbar bg="dark" variant="dark" expand="lg" className="mb-4">
        <Container>
          <Navbar.Brand href="#">Ausenza RH</Navbar.Brand>
          <Nav className="ms-auto">
            <Button variant="outline-light" onClick={handleLogout}>Sair</Button>
          </Nav>
        </Container>
      </Navbar>

      <Container className="position-relative">
        {/* --- NOTIFICAÇÃO FLUTUANTE (TOAST) --- */}
        <ToastContainer position="top-end" className="p-3" style={{zIndex: 1055}}>
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={5000} autohide bg="success">
            <Toast.Header>
              <strong className="me-auto">Sucesso!</strong>
              <small>Agora mesmo</small>
            </Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        <Card className="shadow-sm">
          <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
            <h4 className="m-0">Colaboradores</h4>
            <Button variant="success" disabled>+ Novo Funcionário</Button>
          </Card.Header>
          
          <Card.Body className="p-0">
            <Table responsive hover className="m-0 align-middle">
              <thead className="bg-light">
                <tr>
                  <th className="ps-4">Nome</th>
                  <th>Cargo</th>
                  <th className="text-center">Saldo Atual</th>
                  <th className="text-end pe-4">Ações</th>
                </tr>
              </thead>
              <tbody>
                {funcionarios.map((func) => (
                  <tr key={func.id}>
                    <td className="ps-4 fw-bold">{func.nome}</td>
                    <td className="text-muted">{func.cargo}</td>
                    <td className="text-center">
                      <Badge bg={func.saldoFerias > 10 ? "success" : "warning"} pill>
                        {func.saldoFerias} dias
                      </Badge>
                    </td>
                    <td className="text-end pe-4">
                      <Button 
                        variant="outline-primary" 
                        size="sm" 
                        onClick={() => abrirModalFerias(func)}
                      >
                        Solicitar Férias
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* --- MODAL DE FÉRIAS --- */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Férias: {funcionarioSelecionado?.nome}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {msgErro && <Alert variant="danger">{msgErro}</Alert>}
          <Alert variant="info" className="small">
            O saldo só será descontado após a aprovação do gestor.
          </Alert>
          
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Início das Férias</Form.Label>
              <Form.Control 
                type="date" 
                value={dataInicio} 
                onChange={e => setDataInicio(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fim das Férias</Form.Label>
              <Form.Control 
                type="date" 
                value={dataFim} 
                onChange={e => setDataFim(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)} disabled={loading}>
            Cancelar
          </Button>
          <Button variant="primary" onClick={handleSalvarSolicitacao} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Enviar Solicitação"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}