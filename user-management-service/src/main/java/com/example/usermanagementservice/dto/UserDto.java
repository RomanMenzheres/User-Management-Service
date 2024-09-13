package com.example.usermanagementservice.dto;

public record UserDto(
        Long id,
        String email,
        String firstName,
        String lastName
) {}
