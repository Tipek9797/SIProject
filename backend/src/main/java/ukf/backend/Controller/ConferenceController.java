
package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Conference.Conference;
import ukf.backend.Model.Conference.ConferenceRepository;

import java.util.List;

@RestController
@RequestMapping("/api/conferences")
public class ConferenceController {

    @Autowired
    private ConferenceRepository conferenceRepository;

    @GetMapping
    public List<Conference> getAllConferences() {
        return conferenceRepository.findAll();
    }

    @PostMapping
    public Conference createConference(@RequestBody Conference conference) {
        return conferenceRepository.save(conference);
    }

    @GetMapping("/{id}")
    public Conference getConferenceById(@PathVariable Long id) {
        return conferenceRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Conference updateConference(@PathVariable Long id, @RequestBody Conference conferenceDetails) {
        Conference conference = conferenceRepository.findById(id).orElse(null);
        if (conference != null) {
            conference.setState(conferenceDetails.getState());
            conference.setName(conferenceDetails.getName());
            conference.setStartUpload(conferenceDetails.getStartUpload());
            conference.setCloseUpload(conferenceDetails.getCloseUpload());
            conference.setStartReview(conferenceDetails.getStartReview());
            conference.setCloseReview(conferenceDetails.getCloseReview());
            return conferenceRepository.save(conference);
        }
        return null;
    }

    @DeleteMapping("/{id}")
    public void deleteConference(@PathVariable Long id) {
        conferenceRepository.deleteById(id);
    }
}