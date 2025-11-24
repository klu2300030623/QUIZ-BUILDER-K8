package com.klef.dev;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class WebConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {
        http
            .csrf(csrf -> csrf.disable())        // disable CSRF for APIs
            .cors(cors -> {})                   // enable CORS (picks from WebConfig)
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // allow login & register
                .anyRequest().authenticated()               // protect other endpoints
            );

        return http.build();
    }
}
