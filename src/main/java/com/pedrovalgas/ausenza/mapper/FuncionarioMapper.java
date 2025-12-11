package com.pedrovalgas.ausenza.mapper;

import com.pedrovalgas.ausenza.dto.FuncionarioDetalhesResponse;
import com.pedrovalgas.ausenza.dto.FuncionarioRequest;
import com.pedrovalgas.ausenza.model.Funcionario;
import org.mapstruct.Mapper;

import java.util.List;

@Mapper(componentModel = "spring")
public interface FuncionarioMapper {

    List<FuncionarioDetalhesResponse> toDetalhesList(List<Funcionario> entities);

    FuncionarioDetalhesResponse toDetalhes(Funcionario dto);

    Funcionario toEntity(FuncionarioRequest dto);
}
