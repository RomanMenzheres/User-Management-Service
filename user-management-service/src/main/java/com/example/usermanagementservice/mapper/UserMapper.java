package com.example.usermanagementservice.mapper;

import com.example.usermanagementservice.config.MapperConfig;
import com.example.usermanagementservice.dto.UserDto;
import com.example.usermanagementservice.dto.CreateUserRequestDto;
import com.example.usermanagementservice.model.User;
import org.mapstruct.BeanMapping;
import org.mapstruct.Mapper;
import org.mapstruct.MappingTarget;
import org.mapstruct.NullValuePropertyMappingStrategy;

@Mapper(config = MapperConfig.class)
public interface UserMapper {
    UserDto toDto(User user);

    User toModel(CreateUserRequestDto requestDto);

    @BeanMapping(nullValuePropertyMappingStrategy = NullValuePropertyMappingStrategy.IGNORE)
    void updateUserFromDto(CreateUserRequestDto requestDto, @MappingTarget User user);
}
