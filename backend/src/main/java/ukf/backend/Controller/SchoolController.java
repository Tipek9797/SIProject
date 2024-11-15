package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ukf.backend.Model.School.School;
import ukf.backend.Model.School.SchoolRepository;

import java.util.List;

@RestController
@RequestMapping("/api/schools")
public class SchoolController {

    @Autowired
    private SchoolRepository schoolRepository;

    @GetMapping
    public List<School> getAllSchools() {
        return schoolRepository.findAll();
    }
}
