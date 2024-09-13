package com.example.usermanagementservice.service.impl;

import com.example.usermanagementservice.dto.UserDto;
import com.example.usermanagementservice.dto.CreateUserRequestDto;
import com.example.usermanagementservice.exception.CreationException;
import com.example.usermanagementservice.mapper.UserMapper;
import com.example.usermanagementservice.model.User;
import com.example.usermanagementservice.repository.UserRepository;
import com.example.usermanagementservice.service.UserService;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class UserServiceImpl implements UserService {
    private final UserRepository userRepository;
    private final UserMapper userMapper;

    public UserServiceImpl(UserRepository userRepository, UserMapper userMapper) {
        this.userRepository = userRepository;
        this.userMapper = userMapper;
    }

    @Override
    public UserDto save(CreateUserRequestDto requestDto) {
        checkIfEmailFree(requestDto.email());
        User user = userMapper.toModel(requestDto);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public Page<UserDto> findAll(Pageable pageable) {
        Page<User> usersPage = userRepository.findAll(pageable);

        List<UserDto> userDTOs = usersPage.getContent().stream()
                .map(userMapper::toDto)
                .collect(Collectors.toList());

        return new PageImpl<>(userDTOs, pageable, usersPage.getTotalElements());
    }

    @Override
    public UserDto findById(Long id) {
        return userMapper.toDto(userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Can't find user with id: " + id)));
    }

    @Override
    public UserDto update(Long id, CreateUserRequestDto requestDto) {
        System.out.println(requestDto);
        String newEmail = requestDto.email();
        User user = userRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Can't find user with id: " + id));
        System.out.println(user);
        if(!user.getEmail().equals(newEmail)){
            checkIfEmailFree(newEmail);
        }
        userMapper.updateUserFromDto(requestDto, user);
        return userMapper.toDto(userRepository.save(user));
    }

    @Override
    public void delete(Long id) {
        userRepository.deleteById(id);
    }

    private void checkIfEmailFree(String email) {
        if (userRepository.findByEmail(email).isPresent()) {
            throw new CreationException("Provided email is already taken");
        }
    }
}
