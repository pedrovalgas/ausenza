package com.pedrovalgas.ausenza.controller;

import com.pedrovalgas.ausenza.dto.FuncionarioDetalhesResponse;
import com.pedrovalgas.ausenza.dto.FuncionarioRequest;
import com.pedrovalgas.ausenza.service.FuncionarioService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/funcionarios")
@RequiredArgsConstructor
public class FuncionarioController {

    private final FuncionarioService service;

    @PostMapping
    public ResponseEntity<FuncionarioDetalhesResponse> create(@RequestBody FuncionarioRequest dto){
        return ResponseEntity.status(HttpStatus.CREATED).body(service.create(dto));
    }

    @GetMapping
    public ResponseEntity<List<FuncionarioDetalhesResponse>> findAll(){
        return ResponseEntity.ok(service.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FuncionarioDetalhesResponse> findById(@PathVariable Long id){
        return ResponseEntity.ok(service.findById(id));
    }
}
