package com.pedrovalgas.ausenza.repository;

import com.pedrovalgas.ausenza.model.Funcionario;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FuncionarioRepository extends JpaRepository<Funcionario, Long> {
}
