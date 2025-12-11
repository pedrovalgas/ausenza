package com.pedrovalgas.ausenza.controller;

import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaDetalhes;
import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaRequest;
import com.pedrovalgas.ausenza.service.SolicitacaoAusenciaService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/solicitacoes")
@RequiredArgsConstructor
public class SolicitacaoController {

    private final SolicitacaoAusenciaService service;


    @PostMapping("/funcionario/{id}")
    public ResponseEntity<SolicitacaoAusenciaDetalhes> criaSolicitacao(@PathVariable Long id, @RequestBody SolicitacaoAusenciaRequest dto){
        return ResponseEntity.ok(service.solicitarAusencia(id, dto));
    }

    @PostMapping("/{id}/aprovar")
    public ResponseEntity<SolicitacaoAusenciaDetalhes> aprovarSolicitacao(@PathVariable Long id){
        return ResponseEntity.ok(service.aprovarSolicitacao(id));
    }

    @PostMapping("/{id}/recusar")
    public ResponseEntity<SolicitacaoAusenciaDetalhes> recusarSolicitacao(@PathVariable Long id){
        return ResponseEntity.ok(service.recusarSolicitacao(id));
    }

}
