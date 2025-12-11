package com.pedrovalgas.ausenza.model;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Entity
@Table(name = "solicitacao_ausencia")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
public class SolicitacaoAusencia {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private LocalDate dataInicio;

    private LocalDate dataFim;

    private String observacao;

    @Enumerated(EnumType.STRING)
    private TipoAusencia tipoAusencia;

    @Enumerated(EnumType.STRING)
    private StatusSolicitacao statusSolicitacao = StatusSolicitacao.PENDENTE;

    @ManyToOne
    @JoinColumn(name = "funcionario_id")
    private Funcionario funcionario;

}
