package com.smartcampus.security;

import com.smartcampus.model.entity.User;
import com.smartcampus.model.enums.Provider;
import com.smartcampus.model.enums.Role;
import com.smartcampus.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.security.oauth2.client.userinfo.DefaultOAuth2UserService;
import org.springframework.security.oauth2.client.userinfo.OAuth2UserRequest;
import org.springframework.security.oauth2.core.OAuth2AuthenticationException;
import org.springframework.security.oauth2.core.user.OAuth2User;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class CustomOAuth2UserService extends DefaultOAuth2UserService {

    private final UserRepository userRepository;

    @Override
    public OAuth2User loadUser(OAuth2UserRequest userRequest) throws OAuth2AuthenticationException {
        OAuth2User oauth2User = super.loadUser(userRequest);
        
        String registrationId = userRequest.getClientRegistration().getRegistrationId();
        String email;
        String name;
        String providerId;
        String picture;
        Provider provider;

        if ("github".equalsIgnoreCase(registrationId)) {
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
            providerId = String.valueOf(oauth2User.getAttribute("id"));
            picture = oauth2User.getAttribute("avatar_url");
            provider = Provider.GITHUB;
            
            // GitHub might return null for email if not public, simplified for this task
            if (email == null) {
                email = oauth2User.getAttribute("login") + "@github.com";
            }
        } else {
            // Default to Google info extraction
            email = oauth2User.getAttribute("email");
            name = oauth2User.getAttribute("name");
            providerId = oauth2User.getAttribute("sub");
            picture = oauth2User.getAttribute("picture");
            provider = Provider.GOOGLE;
        }

        // Ensure user exists in DB, or auto-register logic
        Optional<User> existingUser = userRepository.findByProviderId(providerId);
        if (existingUser.isEmpty()) {
            // Check by email as fallback if providerId not found (e.g. user previously signed up with different provider but same email)
            existingUser = userRepository.findByEmail(email);
        }

        if (existingUser.isEmpty()) {
            User newUser = User.builder()
                .email(email)
                .name(name)
                .provider(provider)
                .providerId(providerId)
                .profilePicture(picture)
                .role(Role.USER) // Default role
                .build();
            userRepository.save(newUser);
        }

        return oauth2User;
    }
}
