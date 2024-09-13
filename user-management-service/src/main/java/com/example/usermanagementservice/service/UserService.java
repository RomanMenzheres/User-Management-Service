package com.example.usermanagementservice.service;

import com.example.usermanagementservice.dto.UserDto;
import com.example.usermanagementservice.dto.CreateUserRequestDto;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface UserService {
    UserDto save(CreateUserRequestDto requestDto);

    Page<UserDto> findAll(Pageable pageable);

    UserDto findById(Long id);

    UserDto update(Long id, CreateUserRequestDto requestDto);

    void delete(Long id);
}
