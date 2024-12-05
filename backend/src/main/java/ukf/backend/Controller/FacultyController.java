package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.Faculty.FacultyRepository;
import ukf.backend.Model.School.School;
import ukf.backend.Model.School.SchoolRepository;
import ukf.backend.dtos.FacultyDTO;

import java.util.List;
import java.util.stream.Collectors;

@RestController
@RequestMapping("/api/faculties")
public class FacultyController {

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @GetMapping
    public List<FacultyDTO> getAllFaculties() {
        List<Faculty> faculties = facultyRepository.findAll();
        return faculties.stream().map(faculty -> {
            FacultyDTO facultyDTO = new FacultyDTO();
            facultyDTO.setFacultyId(faculty.getId());
            facultyDTO.setName(faculty.getName());
            facultyDTO.setSchoolId(faculty.getSchool().getId());
            facultyDTO.setSchoolName(faculty.getSchool().getName());
            return facultyDTO;
        }).collect(Collectors.toList());
    }

    @PostMapping
    public Faculty createFaculty(@RequestBody FacultyDTO facultyDTO) {
        Faculty faculty = new Faculty();
        faculty.setName(facultyDTO.getName());
        if (facultyDTO.getSchoolId() != null) {
            School school = schoolRepository.findById(facultyDTO.getSchoolId()).orElse(null);
            faculty.setSchool(school);
        }
        return facultyRepository.save(faculty);
    }

    @GetMapping("/{id}")
    public Faculty getFacultyById(@PathVariable Long id) {
        return facultyRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public Faculty updateFaculty(@PathVariable Long id, @RequestBody FacultyDTO facultyDTO) {
        Faculty faculty = facultyRepository.findById(id).orElse(null);
        faculty.setName(facultyDTO.getName());
        if (facultyDTO.getSchoolId() != null) {
            School school = schoolRepository.findById(facultyDTO.getSchoolId()).orElse(null);
            faculty.setSchool(school);
        }
        return facultyRepository.save(faculty);
    }

    @DeleteMapping("/{id}")
    public void deleteFaculty(@PathVariable Long id) {
        facultyRepository.deleteById(id);
    }
}
