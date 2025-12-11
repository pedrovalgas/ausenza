package com.pedrovalgas.ausenza.service;

import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaDetalhes;
import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaRequest;
import com.pedrovalgas.ausenza.mapper.SolicitacaoAusenciaMapper;
import com.pedrovalgas.ausenza.model.StatusSolicitacao;
import com.pedrovalgas.ausenza.model.TipoAusencia;
import com.pedrovalgas.ausenza.repository.FuncionarioRepository;
import com.pedrovalgas.ausenza.repository.SolicitacaoAusenciaRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.temporal.ChronoUnit;

@Service
@RequiredArgsConstructor
public class SolicitacaoAusenciaService {

    private final SolicitacaoAusenciaRepository repository;
    private final SolicitacaoAusenciaMapper mapper;
    private final FuncionarioRepository funcionarioRepository;

    public SolicitacaoAusenciaDetalhes solicitarAusencia(Long funcionarioId, SolicitacaoAusenciaRequest dto){
        var funcionario = funcionarioRepository.findById(funcionarioId)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado!"));

        var solicitacao = mapper.toEntity(dto);
        solicitacao.setFuncionario(funcionario);

        if (solicitacao.getDataFim().isBefore(solicitacao.getDataInicio())){
            throw new RuntimeException("Data final não pode ser maior que a data do início");
        }

        if (repository.existeConflitoDeDatas(funcionarioId, solicitacao.getDataInicio(), solicitacao.getDataFim())){
            throw new RuntimeException("Já existe férias nesse período!");
        }

        return mapper.toDetalhes(repository.save(solicitacao));

    }

    @Transactional
    public SolicitacaoAusenciaDetalhes aprovarSolicitacao(Long solicitacaoId){
        var solicitacao = repository.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada!"));

        var funcionario = solicitacao.getFuncionario();

        if (solicitacao.getStatusSolicitacao() != StatusSolicitacao.PENDENTE){
            throw new RuntimeException("Não é possível aprovar solicitação já aprovado ou recusada");
        }

        if (solicitacao.getTipoAusencia() == TipoAusencia.FERIAS){
            long diasLong = ChronoUnit.DAYS.between(solicitacao.getDataInicio(), solicitacao.getDataFim()) + 1;
            int dias = (int) diasLong;

            if (dias > funcionario.getSaldoFerias()){
                throw new RuntimeException("Saldo de férias insuficiente. Saldo: " + funcionario.getSaldoFerias() + ", Solicitado: " + dias);
            } else {
                funcionario.setSaldoFerias(funcionario.getSaldoFerias() - dias);
                funcionarioRepository.save(funcionario);
            }
        }

        solicitacao.setStatusSolicitacao(StatusSolicitacao.APROVADO);
        return mapper.toDetalhes(repository.save(solicitacao));
    }

    public SolicitacaoAusenciaDetalhes recusarSolicitacao(Long solicitacaoId){
        var solicitacao = repository.findById(solicitacaoId)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada!"));

        solicitacao.setStatusSolicitacao(StatusSolicitacao.RECUSADO);
        return mapper.toDetalhes(repository.save(solicitacao));
    }




}
