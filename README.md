# Ausenza - Sistema de Gestão de Férias Corporativas 🏖️

![Java](https://img.shields.io/badge/java-%23ED8B00.svg?style=for-the-badge&logo=openjdk&logoColor=white)
![Spring](https://img.shields.io/badge/spring-%236DB33F.svg?style=for-the-badge&logo=spring&logoColor=white)
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Postgres](https://img.shields.io/badge/postgres-%23316192.svg?style=for-the-badge&logo=postgresql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

## 💻 Sobre o Projeto

O **Ausenza** é uma solução Fullstack para modernizar o processo de solicitação e aprovação de férias em empresas. O sistema substitui planilhas e e-mails por um fluxo automatizado e seguro.

### 🎯 Principais Funcionalidades

- **Dashboard Administrativo:** Visão geral de todos os colaboradores e seus saldos de férias.
- **Solicitação de Férias:** Cálculo automático de dias e validação de regras de negócio (saldo insuficiente, conflito de datas).
- **Fluxo de Aprovação:** Gestores podem aprovar ou recusar solicitações pendentes.
- **Controle de Saldo:** O saldo é descontado automaticamente após a aprovação.
- **Segurança:** Autenticação via Token JWT e proteção de rotas.

## 🛠️ Tecnologias Utilizadas

**Backend:**
- Java 17
- Spring Boot 3
- Spring Security (JWT)
- Spring Data JPA
- Validation API

**Frontend:**
- ReactJS + Vite
- Bootstrap 5
- Axios (Integração API)

**Infraestrutura:**
- Docker & Docker Compose
- PostgreSQL

## 🚀 Como rodar o projeto localmente

### Pré-requisitos
- Docker e Docker Compose instalados.

### Passo a passo

1. Clone o repositório:
```
git clone https://github.com/pedrovalgas/ausenza.git

```

2. Entre na pasta e suba os containers:
  ```
cd ausenza
docker-compose up --build
```

3. Acesse a aplicação:

* Frontend: http://localhost:5173
* Backend: http://localhost:8080

4. Login padrão (Admin):

* Email: teste@teste.com
* Senha: 123


## Desenvolvido por Pedro Valgas ⚡
