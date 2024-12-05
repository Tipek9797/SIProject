package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Conference.Conference;
import ukf.backend.Model.Conference.ConferenceRepository;
import ukf.backend.Model.Form.Form;
import ukf.backend.Model.Form.FormRepository;
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

    @GetMapping
    public List<ConferenceDTO> getAllConferences() {
        List<Conference> conferences = conferenceRepository.findAll();
        return conferences.stream().map(conference -> {
            ConferenceDTO conferenceDTO = new ConferenceDTO();
            conferenceDTO.setId(conference.getId());
            conferenceDTO.setName(conference.getName());
            conferenceDTO.setState(conference.getState());
            conferenceDTO.setStartUpload(conference.getStartUpload());
            conferenceDTO.setCloseUpload(conference.getCloseUpload());
            conferenceDTO.setStartReview(conference.getStartReview());
            conferenceDTO.setCloseReview(conference.getCloseReview());
            conferenceDTO.setFormId(conference.getForm().getId());
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
}