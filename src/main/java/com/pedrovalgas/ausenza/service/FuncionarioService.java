package com.pedrovalgas.ausenza.service;

import com.pedrovalgas.ausenza.dto.FuncionarioDetalhesResponse;
import com.pedrovalgas.ausenza.dto.FuncionarioRequest;
import com.pedrovalgas.ausenza.mapper.FuncionarioMapper;
import com.pedrovalgas.ausenza.repository.FuncionarioRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class FuncionarioService {

    private final FuncionarioRepository repository;
    private final FuncionarioMapper mapper;

    public List<FuncionarioDetalhesResponse> findAll(){
        return mapper.toDetalhesList(repository.findAll());
    }

    public FuncionarioDetalhesResponse create(FuncionarioRequest dto){
        var entity = mapper.toEntity(dto);
        if (entity.getSaldoFerias() == null){
            entity.setSaldoFerias(30);
        }
        return mapper.toDetalhes(repository.save(entity));
    }

    public FuncionarioDetalhesResponse findById(Long id){
        var entity = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Funcionário não encontrado!"));
        return mapper.toDetalhes(entity);
    }

}
