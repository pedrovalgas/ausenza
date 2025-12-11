package com.pedrovalgas.ausenza.dto;

import com.pedrovalgas.ausenza.model.Funcionario;
import com.pedrovalgas.ausenza.model.StatusSolicitacao;
import com.pedrovalgas.ausenza.model.TipoAusencia;

import java.time.LocalDate;

public record SolicitacaoAusenciaDetalhes(Long id, LocalDate dataInicio, LocalDate dataFim, String observacao, TipoAusencia tipoAusencia, StatusSolicitacao statusSolicitacao, FuncionarioDetalhesResponse funcionario) {
}
