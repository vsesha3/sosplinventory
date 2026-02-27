package com.sospl.inventory.security.service;

import com.sospl.inventory.model.auth.SosUser;
import com.sospl.inventory.repository.auth.SosUserRepository;
import com.sospl.inventory.repository.auth.SosUserRoleRepository;
import com.sospl.inventory.repository.auth.SosRoleRepository;
import com.sospl.inventory.repository.auth.SosRolePermissionRepository;
import com.sospl.inventory.repository.auth.SosPermissionRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.User;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;

@Service
public class CustomUserDetailsService implements UserDetailsService {

    @Autowired
    private SosUserRepository userRepository;

    @Autowired
    private SosUserRoleRepository userRoleRepository;

    @Autowired
    private SosRoleRepository roleRepository;

    @Autowired
    private SosRolePermissionRepository rolePermissionRepository;

    @Autowired
    private SosPermissionRepository permissionRepository;

    @Override
    public UserDetails loadUserByUsername(String username)
            throws UsernameNotFoundException {

        SosUser user = userRepository
                .findByUsernameAndIsDeletedFalse(username)
                .orElseThrow(() -> new UsernameNotFoundException(
                        "User not found: " + username));

        List<SimpleGrantedAuthority> authorities = new ArrayList<>();

        // Add roles as authorities
        userRoleRepository.findActiveRolesByUserId(user.getId())
                .forEach(userRole ->
                        roleRepository.findById(userRole.getRoleId())
                                .ifPresent(role -> {
                                    // Add role
                                    authorities.add(new SimpleGrantedAuthority(
                                            role.getRoleCode()));

                                    // Add permissions
                                    rolePermissionRepository
                                            .findActivePermissionsByRoleId(role.getId())
                                            .forEach(rp ->
                                                    permissionRepository
                                                            .findById(rp.getPermissionId())
                                                            .ifPresent(p ->
                                                                    authorities.add(
                                                                            new SimpleGrantedAuthority(
                                                                                    p.getPermissionCode()))));
                                }));

        return new User(
                user.getUsername(),
                user.getPassword(),
                user.getIsActive(),
                true,
                true,
                !user.getIsLocked(),
                authorities
        );
    }
}