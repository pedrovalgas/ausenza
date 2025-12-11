package com.pedrovalgas.ausenza.dto;

import java.time.LocalDate;

public record FuncionarioRequest(String nome, String cargo, LocalDate dataAdmissao) {
}
