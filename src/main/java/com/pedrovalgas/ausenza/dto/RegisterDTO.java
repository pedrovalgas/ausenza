package com.pedrovalgas.ausenza.dto;

import com.pedrovalgas.ausenza.model.Role;

public record RegisterDTO(String email, String password, Role role) {
}
