package ukf.backend.Security;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.http.HttpMethod;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.AuthenticationProvider;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.SecurityFilterChain;

import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;
import ukf.backend.Model.User.UserService;

import java.util.Arrays;
import java.util.List;

@Configuration
@EnableWebSecurity
public class SecurityConfig {

    private final UserService appUserService;
    private final JwtService jwtService;

    public SecurityConfig(UserService appUserService, JwtService jwtService) {
        this.appUserService = appUserService;
        this.jwtService = jwtService;
    }

    @Bean
    public JwtAuthenticationFilter jwtAuthenticationFilter() {
        return new JwtAuthenticationFilter(jwtService, userDetailsService());
    }

    @Bean
    public UserDetailsService userDetailsService(){
        return appUserService;
    }

    @Bean
    public AuthenticationProvider authenticationProvider(){
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(appUserService);
        provider.setPasswordEncoder(passwordEncoder());
        return provider;
    }

    @Bean
    public AuthenticationManager authenticationManager(AuthenticationConfiguration authenticationConfiguration)
            throws Exception {
        return authenticationConfiguration.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder passwordEncoder(){
        return new BCryptPasswordEncoder();
    }

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity httpSecurity) throws Exception {
        return httpSecurity
                .cors(cors -> cors.configurationSource(corsConfigurationSource()))
                .csrf(AbstractHttpConfigurer::disable)
                .authorizeHttpRequests(authorize -> authorize
                        //update when the testing is done
                        //.requestMatchers("/api/**").permitAll()
                        .requestMatchers("/api/login", "/api/register", "confirm-email").permitAll()
                        .requestMatchers("/home", "/events").hasAnyRole("USER", "REVIEWER", "ADMIN")
                        .requestMatchers("/my-works").hasAnyRole("USER", "ADMIN")
                        .requestMatchers("/works-to-review").hasAnyRole("REVIEWER", "ADMIN")
                        .requestMatchers("/manage-users", "/all-works","/settings","/settings/**").hasRole("ADMIN")
                        //.requestMatchers("/api/schools").hasRole("USER")
                        .requestMatchers(HttpMethod.GET,"/api/article-categories").hasAnyRole("ADMIN", "USER")
                        .requestMatchers("/api/article-categories/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.PATCH,"/api/articles/**").hasAnyRole("ADMIN", "USER","REVIEWER")
                        .requestMatchers(HttpMethod.GET,"/api/articles/").hasAnyRole("USER","REVIEWER")
                        .requestMatchers(HttpMethod.POST,"/api/articles/").hasAnyRole("USER")
                        .requestMatchers("/api/article-states/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/conferences/**").permitAll()
                        .requestMatchers(HttpMethod.PUT,"/api/conferences/**").hasAnyRole("USER", "ADMIN", "REVIEWER")
                        .requestMatchers("/api/conferences/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/faculties/").hasAnyRole("ADMIN", "REVIEWER", "USER")
                        .requestMatchers("/api/faculties/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/files/**").hasAnyRole("ADMIN", "REVIEWER", "USER")
                        .requestMatchers(HttpMethod.POST,"/api/files/**").hasAnyRole("USER")
                        .requestMatchers(HttpMethod.GET,"/api/forms").hasAnyRole("ADMIN")
                        .requestMatchers("/api/pros-and-cons-categories/**").hasAnyRole("ADMIN")
                        .requestMatchers("/api/pros-and-cons/**").hasAnyRole("REVIEWER")
                        .requestMatchers("/api/reviews/**").hasAnyRole("REVIEWER")
                        .requestMatchers("/api/roles/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/schools").permitAll()
                        .requestMatchers("/api/schools/**").hasAnyRole("ADMIN")
                        .requestMatchers(HttpMethod.GET,"/api/users/**").hasAnyRole("ADMIN", "REVIEWER", "USER")
                        .requestMatchers(HttpMethod.PUT,"/api/users/**").hasAnyRole("ADMIN", "REVIEWER", "USER")
                        .requestMatchers(HttpMethod.PATCH,"/api/users/**").hasAnyRole("ADMIN", "REVIEWER", "USER")
                        .requestMatchers("/api/users/**").hasAnyRole("ADMIN")
                        .anyRequest().authenticated()

                )
                .addFilterBefore(jwtAuthenticationFilter(), UsernamePasswordAuthenticationFilter.class)
                .build();
    }

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOrigins(List.of("http://localhost:3000"));
        configuration.setAllowedMethods(Arrays.asList("GET", "POST", "PUT", "DELETE", "PATCH"));
        configuration.setAllowedHeaders(Arrays.asList("Authorization", "Content-Type"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }
}
