package com.pedrovalgas.ausenza.controller;

import com.pedrovalgas.ausenza.dto.AuthenticationDTO;
import com.pedrovalgas.ausenza.dto.LoginResponseDTO;
import com.pedrovalgas.ausenza.dto.RegisterDTO;
import com.pedrovalgas.ausenza.model.Usuario;
import com.pedrovalgas.ausenza.repository.UsuarioRepository;
import com.pedrovalgas.ausenza.service.TokenService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
@RequiredArgsConstructor
public class AuthenticationController {

    private final AuthenticationManager authenticationManager;
    private final UsuarioRepository repository;
    private final TokenService tokenService;

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Valid AuthenticationDTO data){
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.email(), data.password());

        var auth = authenticationManager.authenticate(usernamePassword);

        var token = tokenService.generateToken((Usuario) auth.getPrincipal());

        return ResponseEntity.ok(new LoginResponseDTO(token));
    }

    @PostMapping("/register")
    public ResponseEntity register(@RequestBody @Valid RegisterDTO data){
        if(repository.findByEmail(data.email()).isPresent()) return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(data.password());

        Usuario newUser = new Usuario();
        newUser.setEmail(data.email());
        newUser.setPassword(encryptedPassword);
        newUser.setRole(data.role());

        repository.save(newUser);

        return ResponseEntity.ok().build();
    }
}