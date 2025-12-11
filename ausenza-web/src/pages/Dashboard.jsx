import { useEffect, useState } from "react";
import { Container, Navbar, Nav, Table, Button, Card, Badge, Modal, Form, Alert, Toast, ToastContainer, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaCheck, FaTimes } from "react-icons/fa";

export function Dashboard() {
  const [funcionarios, setFuncionarios] = useState([]);
  const [solicitacoesPendentes, setSolicitacoesPendentes] = useState([]);
  const navigate = useNavigate();

  // Estados do Modal de FÉRIAS
  const [showModalFerias, setShowModalFerias] = useState(false);
  const [funcionarioSelecionado, setFuncionarioSelecionado] = useState(null);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFim, setDataFim] = useState("");

  // Estados do Modal de NOVO FUNCIONÁRIO (Novidade!)
  const [showModalNovo, setShowModalNovo] = useState(false);
  const [novoNome, setNovoNome] = useState("");
  const [novoCargo, setNovoCargo] = useState("");
  const [novaDataAdmissao, setNovaDataAdmissao] = useState("");
  
  // UX Geral
  const [loading, setLoading] = useState(false);
  const [msgErro, setMsgErro] = useState("");
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState("");
  const [toastVariant, setToastVariant] = useState("success");

  useEffect(() => {
    carregarDados();
  }, []);

  async function carregarDados() {
    try {
      const [respFunc, respSolicitacoes] = await Promise.all([
        api.get("/funcionarios"),
        api.get("/solicitacoes/pendentes")
      ]);

      setFuncionarios(respFunc.data);
      setSolicitacoesPendentes(respSolicitacoes.data);

    } catch (error) {
      if (error.response?.status === 403) handleLogout();
    }
  }

  function handleLogout() {
    localStorage.removeItem("token");
    navigate("/");
  }

  function calcularDias(inicio, fim) {
    const data1 = new Date(inicio);
    const data2 = new Date(fim);
    const diffTime = Math.abs(data2 - data1);
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; 
  }

  // --- Funções de FÉRIAS ---
  function abrirModalFerias(funcionario) {
    setFuncionarioSelecionado(funcionario);
    setMsgErro("");
    setDataInicio("");
    setDataFim("");
    setShowModalFerias(true);
  }

  async function handleSalvarSolicitacao() {
    setLoading(true);
    setMsgErro("");
    try {
      const payload = { dataInicio, dataFim, tipoAusencia: "FERIAS", observacao: "Solicitado via Web" };
      await api.post(`/solicitacoes/funcionario/${funcionarioSelecionado.id}`, payload);
      
      setShowModalFerias(false);
      setToastMessage(`Solicitação enviada! Aguardando aprovação.`);
      setToastVariant("success");
      setShowToast(true);
      carregarDados();
    } catch (error) {
      setMsgErro(error.response?.data?.message || "Erro ao solicitar.");
    } finally {
      setLoading(false);
    }
  }

  // --- Funções de APROVAÇÃO ---
  async function handleDecisao(idSolicitacao, decisao) {
    try {
      await api.post(`/solicitacoes/${idSolicitacao}/${decisao}`);
      
      if (decisao === "aprovar") {
        setToastMessage("Solicitação Aprovada!");
        setToastVariant("success");
      } else {
        setToastMessage("Solicitação Recusada.");
        setToastVariant("danger");
      }
      setShowToast(true);
      carregarDados();
    } catch (error) {
      alert("Erro: " + (error.response?.data?.message || "Erro desconhecido"));
    }
  }

  // --- Funções de NOVO FUNCIONÁRIO (Novidade!) ---
  function abrirModalNovo() {
    setNovoNome("");
    setNovoCargo("");
    setNovaDataAdmissao("");
    setMsgErro("");
    setShowModalNovo(true);
  }

  async function handleCriarFuncionario() {
    setLoading(true);
    setMsgErro("");
    try {
      const payload = {
        nome: novoNome,
        cargo: novoCargo,
        dataAdmissao: novaDataAdmissao
      };

      await api.post("/funcionarios", payload);

      setShowModalNovo(false);
      setToastMessage("Colaborador cadastrado com sucesso!");
      setToastVariant("success");
      setShowToast(true);
      carregarDados(); // Atualiza a lista pra mostrar o novo cara
    } catch (error) {
      setMsgErro(error.response?.data?.message || "Erro ao cadastrar.");
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

      <Container className="position-relative pb-5">
        <ToastContainer position="top-end" className="p-3" style={{zIndex: 1055}}>
          <Toast onClose={() => setShowToast(false)} show={showToast} delay={4000} autohide bg={toastVariant}>
            <Toast.Header><strong className="me-auto">{toastVariant === 'success' ? 'Sucesso' : 'Atenção'}</strong></Toast.Header>
            <Toast.Body className="text-white">{toastMessage}</Toast.Body>
          </Toast>
        </ToastContainer>

        {/* Tabela de Aprovações */}
        {solicitacoesPendentes.length > 0 && (
          <Card className="shadow-sm mb-4 border-warning">
            <Card.Header className="bg-warning bg-opacity-10 py-3">
              <h5 className="m-0 text-dark">⚠️ Aprovações Pendentes ({solicitacoesPendentes.length})</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <Table hover className="m-0 align-middle">
                <thead>
                  <tr>
                    <th className="ps-4">Funcionário</th>
                    <th>Período</th>
                    <th className="text-center">Duração</th>
                    <th className="text-end pe-4">Decisão</th>
                  </tr>
                </thead>
                <tbody>
                  {solicitacoesPendentes.map((sol) => (
                    <tr key={sol.id}>
                      <td className="ps-4 fw-bold">{sol.funcionario.nome}</td>
                      <td>{new Date(sol.dataInicio).toLocaleDateString()} até {new Date(sol.dataFim).toLocaleDateString()}</td>
                      <td className="text-center"><Badge bg="info" className="fs-6">{calcularDias(sol.dataInicio, sol.dataFim)} dias</Badge></td>
                      <td className="text-end pe-4">
                        <Button variant="success" size="sm" className="me-2" onClick={() => handleDecisao(sol.id, "aprovar")}><FaCheck /> Aprovar</Button>
                        <Button variant="danger" size="sm" onClick={() => handleDecisao(sol.id, "recusar")}><FaTimes /> Recusar</Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>
        )}

        {/* Tabela de Funcionários */}
        <Card className="shadow-sm">
          <Card.Header className="bg-white py-3 d-flex justify-content-between align-items-center">
            <h4 className="m-0">Colaboradores</h4>
            {/* Botão agora chama a função de abrir o modal */}
            <Button variant="success" onClick={abrirModalNovo}>+ Novo Funcionário</Button>
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
                      <Badge bg={func.saldoFerias > 10 ? "success" : "warning"} pill>{func.saldoFerias} dias</Badge>
                    </td>
                    <td className="text-end pe-4">
                      <Button variant="outline-primary" size="sm" onClick={() => abrirModalFerias(func)}>Solicitar Férias</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      </Container>

      {/* --- MODAL DE SOLICITAR FÉRIAS --- */}
      <Modal show={showModalFerias} onHide={() => setShowModalFerias(false)} centered>
        <Modal.Header closeButton><Modal.Title>Férias: {funcionarioSelecionado?.nome}</Modal.Title></Modal.Header>
        <Modal.Body>
          {msgErro && <Alert variant="danger">{msgErro}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Início</Form.Label>
              <Form.Control type="date" value={dataInicio} onChange={e => setDataInicio(e.target.value)} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Fim</Form.Label>
              <Form.Control type="date" value={dataFim} onChange={e => setDataFim(e.target.value)} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalFerias(false)} disabled={loading}>Cancelar</Button>
          <Button variant="primary" onClick={handleSalvarSolicitacao} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Enviar"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* --- NOVO MODAL: CADASTRAR FUNCIONÁRIO --- */}
      <Modal show={showModalNovo} onHide={() => setShowModalNovo(false)} centered>
        <Modal.Header closeButton><Modal.Title>Novo Colaborador</Modal.Title></Modal.Header>
        <Modal.Body>
          {msgErro && <Alert variant="danger">{msgErro}</Alert>}
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Nome Completo</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: João Silva" 
                value={novoNome} 
                onChange={e => setNovoNome(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Cargo</Form.Label>
              <Form.Control 
                type="text" 
                placeholder="Ex: Analista de RH" 
                value={novoCargo} 
                onChange={e => setNovoCargo(e.target.value)} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Data de Admissão</Form.Label>
              <Form.Control 
                type="date" 
                value={novaDataAdmissao} 
                onChange={e => setNovaDataAdmissao(e.target.value)} 
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModalNovo(false)} disabled={loading}>Cancelar</Button>
          <Button variant="success" onClick={handleCriarFuncionario} disabled={loading}>
            {loading ? <Spinner animation="border" size="sm" /> : "Cadastrar"}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}