package com.pedrovalgas.ausenza.mapper;

import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaDetalhes;
import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaRequest;
import com.pedrovalgas.ausenza.model.SolicitacaoAusencia;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "Spring", uses = {FuncionarioMapper.class})
public interface SolicitacaoAusenciaMapper {

    SolicitacaoAusenciaDetalhes toDetalhes(SolicitacaoAusencia entity);

    @Mapping(target = "funcionario", ignore = true)
    SolicitacaoAusencia toEntity(SolicitacaoAusenciaRequest dto);


}
