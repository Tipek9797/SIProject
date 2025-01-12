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

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/conferences")
public class ConferenceController {

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

            conferenceDTO.setArticleId(conference.getArticles());
            conferenceDTO.setState(conference.getState());
            conferenceDTO.setStartUpload(conference.getStartUpload());
            conferenceDTO.setCloseUpload(conference.getCloseUpload());
            conferenceDTO.setStartReview(conference.getStartReview());
            conferenceDTO.setCloseReview(conference.getCloseReview());
            conferenceDTO.setFormId(conference.getForm().getId());
            conferenceDTO.setDescription(conference.getDescription());
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
}