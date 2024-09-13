package com.example.usermanagementservice.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotNull;
import org.hibernate.validator.constraints.Length;

public record CreateUserRequestDto(
        @NotNull
        @Length(min = 2, max = 255)
        String firstName,
        @NotNull
        @Length(min = 2, max = 255)
        String lastName,
        @NotNull
        @Length(min = 2, max = 255)
        @Email
        String email
) {}
