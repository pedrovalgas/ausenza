package com.pedrovalgas.ausenza.dto;

import java.time.LocalDate;

public record FuncionarioDetalhesResponse(Long id, String nome, String cargo, LocalDate dataAdmissao, Integer saldoFerias) {
}
