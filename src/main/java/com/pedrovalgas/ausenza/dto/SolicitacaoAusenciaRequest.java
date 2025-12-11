package com.pedrovalgas.ausenza.dto;

import com.pedrovalgas.ausenza.model.Funcionario;
import com.pedrovalgas.ausenza.model.TipoAusencia;

import java.time.LocalDate;

public record SolicitacaoAusenciaRequest(LocalDate dataInicio, LocalDate dataFim, String observacao, TipoAusencia tipoAusencia, Funcionario funcionario) {
}
