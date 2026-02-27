package com.sospl.inventory.security.jwt;

import com.sospl.inventory.repository.auth.SosUserRepository;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.web.authentication.WebAuthenticationDetailsSource;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.ArrayList;
import java.util.List;

@Component
public class JwtFilter extends OncePerRequestFilter {

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private SosUserRepository userRepository;

    @Override
    protected void doFilterInternal(HttpServletRequest request,
                                    HttpServletResponse response,
                                    FilterChain filterChain)
            throws ServletException, IOException {

        final String authHeader = request.getHeader("Authorization");
        String extractedToken = null;
        String extractedUsername = null;

        // Extract token from Authorization header
        if (authHeader != null && authHeader.startsWith("Bearer ")) {
            extractedToken = authHeader.substring(7);
            try {
                extractedUsername = jwtUtil.extractUsername(extractedToken);
            } catch (Exception e) {
                logger.error("JWT token extraction failed: " + e.getMessage());
            }
        }

        // Make final copies for use inside lambda
        final String token = extractedToken;
        final String username = extractedUsername;

        // Validate token and set authentication
        if (username != null &&
                SecurityContextHolder.getContext().getAuthentication() == null) {

            boolean isValid = jwtUtil.validateToken(token, username);

            if (isValid) {
                userRepository.findByUsernameAndIsDeletedFalse(username)
                        .ifPresent(user -> {
                            List<SimpleGrantedAuthority> authorities = new ArrayList<>();
                            authorities.add(new SimpleGrantedAuthority("ROLE_USER"));

                            UsernamePasswordAuthenticationToken authToken =
                                    new UsernamePasswordAuthenticationToken(
                                            username, null, authorities);

                            authToken.setDetails(
                                    new WebAuthenticationDetailsSource()
                                            .buildDetails(request));

                            SecurityContextHolder.getContext()
                                    .setAuthentication(authToken);
                        });
            }
        }

        filterChain.doFilter(request, response);
    }
}