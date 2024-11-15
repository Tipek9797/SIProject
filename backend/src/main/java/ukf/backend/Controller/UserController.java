package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.Faculty.FacultyRepository;
import ukf.backend.Model.School.School;
import ukf.backend.Model.School.SchoolRepository;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/users")
public class UserController {

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private SchoolRepository schoolRepository;
    @Autowired
    private FacultyRepository facultyRepository;
    @Autowired
    private PasswordEncoder passwordEncoder;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser( @PathVariable Long id, @RequestBody User updatedUser,
            @RequestParam(required = false) Long schoolId, @RequestParam(required = false) Long facultyId) {
        Optional<User> findUser = userRepository.findById(id);
        if (findUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = findUser.get();

        user.setName(updatedUser.getName());
        user.setSurname(updatedUser.getSurname());
        user.setEmail(updatedUser.getEmail());

        if (updatedUser.getPassword() != null && !updatedUser.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updatedUser.getPassword()));
        }

        if (schoolId != null) {
            Optional<School> findSchool = schoolRepository.findById(schoolId);
            if (findSchool.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid school ID.");
            }
            user.setSchool(findSchool.get());
        }

        if (facultyId != null) {
            Optional<Faculty> findFaculty = facultyRepository.findById(facultyId);
            if (findFaculty.isEmpty()) {
                return ResponseEntity.badRequest().body("Invalid faculty ID.");
            }
            user.setFaculty(findFaculty.get());
        }

        userRepository.save(user);
        return ResponseEntity.ok("User updated successfully.");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("User deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
