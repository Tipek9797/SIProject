package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.server.ResponseStatusException;
import ukf.backend.Model.Conference.Conference;
import ukf.backend.Model.Conference.ConferenceRepository;
import ukf.backend.Model.Form.Form;
import ukf.backend.Model.Form.FormRepository;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;
import ukf.backend.dtos.ConferenceDTO;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

@RestController
@RequestMapping("/api/conferences")
public class ConferenceController {

    private static final Logger logger = LoggerFactory.getLogger(ConferenceController.class);

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<ConferenceDTO> getAllConferences() {
        List<Conference> conferences = conferenceRepository.findAll();
        return conferences.stream().map(conference -> {
            ConferenceDTO conferenceDTO = new ConferenceDTO();
            conferenceDTO.setId(conference.getId());
            conferenceDTO.setName(conference.getName());
            conferenceDTO.setArticleId(conference.getArticles());
            conferenceDTO.setState(conference.getState());
            conferenceDTO.setArticles(conference.getArticles());
            conferenceDTO.setStartUpload(conference.getStartUpload());
            conferenceDTO.setCloseUpload(conference.getCloseUpload());
            conferenceDTO.setStartReview(conference.getStartReview());
            conferenceDTO.setCloseReview(conference.getCloseReview());
            conferenceDTO.setFormId(conference.getForm().getId());
            conferenceDTO.setDescription(conference.getDescription());
            conferenceDTO.setConferenceStart(conference.getConferenceStart());
            conferenceDTO.setConferenceEnd(conference.getConferenceEnd());
            return conferenceDTO;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Conference createConference(@RequestBody ConferenceDTO conferenceDTO) {
        Conference conference = new Conference();
        conference.setName(conferenceDTO.getName());
        conference.setState(conferenceDTO.getState());
        conference.setStartUpload(conferenceDTO.getStartUpload());
        conference.setCloseUpload(conferenceDTO.getCloseUpload());
        conference.setStartReview(conferenceDTO.getStartReview());
        conference.setCloseReview(conferenceDTO.getCloseReview());
        conference.setDescription(conferenceDTO.getDescription());
        conference.setConferenceStart(conferenceDTO.getConferenceStart());
        conference.setConferenceEnd(conferenceDTO.getConferenceEnd());
        if (conferenceDTO.getFormId() != null) {
            Form form = formRepository.findById(conferenceDTO.getFormId()).orElseThrow(() -> new IllegalArgumentException("Invalid form ID"));
            conference.setForm(form);
        }
        return conferenceRepository.save(conference);
    }

    @GetMapping("/{id}")
    public Conference getConferenceById(@PathVariable Long id) {
        return conferenceRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Conference updateConference(@PathVariable Long id, @RequestBody ConferenceDTO conferenceDTO) {
        Conference conference = conferenceRepository.findById(id).orElseThrow(() -> new IllegalArgumentException("Invalid conference ID"));
        if (conference != null) {
            conference.setName(conferenceDTO.getName());
            conference.setState(conferenceDTO.getState());
            conference.setStartUpload(conferenceDTO.getStartUpload());
            conference.setCloseUpload(conferenceDTO.getCloseUpload());
            conference.setStartReview(conferenceDTO.getStartReview());
            conference.setCloseReview(conferenceDTO.getCloseReview());
            conference.setDescription(conferenceDTO.getDescription());
            conference.setConferenceStart(conferenceDTO.getConferenceStart());
            conference.setConferenceEnd(conferenceDTO.getConferenceEnd());
            if (conferenceDTO.getFormId() != null) {
                Form form = formRepository.findById(conferenceDTO.getFormId()).orElseThrow(() -> new IllegalArgumentException("Invalid form ID"));
                conference.setForm(form);
            }
            return conferenceRepository.save(conference);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteConference(@PathVariable Long id) {
        conferenceRepository.deleteById(id);
    }

    @PutMapping("/{id}/addUser")
    public Conference addUserToConference(@PathVariable Long id, @RequestBody ConferenceDTO conferenceDTO) {
        Conference conference = conferenceRepository.findById(id).orElse(null);
        if (conference == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Conference not found");
        }

        Long userId = conferenceDTO.getFormId();
        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        if (conference.getUsers().stream().anyMatch(u -> u.getId().equals(userId))) {
            throw new ResponseStatusException(HttpStatus.BAD_REQUEST, "User is already added to the conference");
        }

        conference.getUsers().add(user);
        user.getConferences().add(conference);

        conferenceRepository.save(conference);
        userRepository.save(user);

        return conference;
    }

    @GetMapping("/{id}/isUserIn")
    public boolean isUserInConference(@PathVariable Long id, @RequestParam Long userId) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conference not found"));

        return conference.getUsers().stream().anyMatch(user -> user.getId().equals(userId));
    }

    @DeleteMapping("/{conferenceId}/removeUser/{userId}")
    public void removeUserFromConference(@PathVariable Long conferenceId, @PathVariable Long userId) {
        Conference conference = conferenceRepository.findById(conferenceId).orElse(null);
        if (conference == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "Conference not found");
        }

        User user = userRepository.findById(userId).orElse(null);
        if (user == null) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found");
        }

        conference.getUsers().remove(user);
        user.getConferences().remove(conference);

        conferenceRepository.save(conference);
        userRepository.save(user);
    }

    @GetMapping("/user-conferences")
    public List<String> getUserConferenceIds() {
        List<Conference> conferences = conferenceRepository.findAll();

        if (conferences.isEmpty()) {
            throw new ResponseStatusException(HttpStatus.NOT_FOUND, "No conferences found");
        }

        List<String> userConferenceIds = new ArrayList<>();
        for (Conference conference : conferences) {
            if (conference.getUsers() != null && !conference.getUsers().isEmpty()) {
                for (User user : conference.getUsers()) {
                    userConferenceIds.add("Conference ID: " + conference.getId() + ", User ID: " + user.getId());
                }
            }
        }

        return userConferenceIds;
    }

    @GetMapping("/user-conferences/{userId}")
    public List<ConferenceDTO> getUserConferences(@PathVariable Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return user.getConferences().stream().map(conference -> {
            ConferenceDTO dto = new ConferenceDTO();
            dto.setId(conference.getId());
            dto.setName(conference.getName());
            return dto;
        }).collect(Collectors.toList());
    }

    @PutMapping("/{id}/updateState")
    public Conference updateConferenceState(@PathVariable Long id, @RequestBody ConferenceDTO conferenceDTO) {
        Conference conference = conferenceRepository.findById(id)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Conference not found"));
        conference.setState(conferenceDTO.getState());
        Conference updatedConference = conferenceRepository.save(conference);
        return updatedConference;
    }
}
