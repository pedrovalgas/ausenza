package com.pedrovalgas.ausenza.mapper;

import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaDetalhes;
import com.pedrovalgas.ausenza.dto.SolicitacaoAusenciaRequest;
import com.pedrovalgas.ausenza.model.SolicitacaoAusencia;
import org.mapstruct.Mapper;

@Mapper(componentModel = "Spring")
public interface SolicitacaoAusenciaMapper {

    SolicitacaoAusenciaDetalhes toDetalhes(SolicitacaoAusencia entity);

    SolicitacaoAusencia toEntity(SolicitacaoAusenciaRequest dto);


}
