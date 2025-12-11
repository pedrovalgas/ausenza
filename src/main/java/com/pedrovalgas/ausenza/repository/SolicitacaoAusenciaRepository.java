package com.pedrovalgas.ausenza.repository;

import com.pedrovalgas.ausenza.model.SolicitacaoAusencia;
import com.pedrovalgas.ausenza.model.StatusSolicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDate;
import java.util.List;

public interface SolicitacaoAusenciaRepository extends JpaRepository<SolicitacaoAusencia, Long> {
    List<SolicitacaoAusencia> findByFuncionarioId(Long funcionarioId);

    List<SolicitacaoAusencia> findByStatusSolicitacao(StatusSolicitacao status);

    @Query("SELECT COUNT(s) > 0 FROM SolicitacaoAusencia s " +
            "WHERE s.funcionario.id = :funcionarioId " +
            "AND s.statusSolicitacao != 'RECUSADO' " +
            "AND ((s.dataInicio BETWEEN :inicio AND :fim) " +
            "OR (s.dataFim BETWEEN :inicio AND :fim) " +
            "OR (:inicio BETWEEN s.dataInicio AND s.dataFim))")
    boolean existeConflitoDeDatas(Long funcionarioId, LocalDate inicio, LocalDate fim);

}
