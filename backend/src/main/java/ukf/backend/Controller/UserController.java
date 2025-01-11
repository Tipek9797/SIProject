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
import ukf.backend.Model.Role.Role;
import ukf.backend.Model.Role.RoleRepository;
import ukf.backend.dtos.UpdateUserDTO;
import ukf.backend.dtos.SchoolDTO;
import ukf.backend.dtos.FacultyDTO;

import java.util.List;
import java.util.Optional;
import java.util.Collection;

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
    @Autowired
    private RoleRepository roleRepository;

    @GetMapping
    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User> getUserById(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            return ResponseEntity.ok(user.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @GetMapping("/reviewers")
    public List<User> getReviewers() {
        Role reviewerRole = roleRepository.findByName("ROLE_REVIEWER");
        if (reviewerRole != null) {
            return userRepository.findByRoles(reviewerRole);
        }
        return List.of();
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) {
        Optional<User> findUser = userRepository.findById(id);
        if (findUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = findUser.get();

        user.setName(updateUserDTO.getName());
        user.setSurname(updateUserDTO.getSurname());
        user.setEmail(updateUserDTO.getEmail());

        if (updateUserDTO.getPassword() != null && !updateUserDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateUserDTO.getPassword()));
        }

        if (updateUserDTO.getSchoolId() != null) {
            Optional<School> findSchool = schoolRepository.findById(updateUserDTO.getSchoolId());
            if (findSchool.isEmpty()) {
                return ResponseEntity.badRequest().body("bad school id");
            }
            user.setSchool(findSchool.get());
        }

        if (updateUserDTO.getFacultyId() != null) {
            Optional<Faculty> findFaculty = facultyRepository.findById(updateUserDTO.getFacultyId());
            if (findFaculty.isEmpty()) {
                return ResponseEntity.badRequest().body("bad faculty id");
            }
            user.setFaculty(findFaculty.get());
        }

        if (updateUserDTO.getRoleIds() != null && !updateUserDTO.getRoleIds().isEmpty()) {
            Collection<Role> roles = roleRepository.findAllById(updateUserDTO.getRoleIds());
            if (roles.size() != updateUserDTO.getRoleIds().size()) {
                return ResponseEntity.badRequest().body("bad role id");
            }
            user.setRoles(roles);
        }

        userRepository.save(user);
        return ResponseEntity.ok("user updated");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> patchUser(@PathVariable Long id, @RequestBody UpdateUserDTO updateUserDTO) {
        Optional<User> findUser = userRepository.findById(id);
        if (findUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = findUser.get();

        if (updateUserDTO.getName() != null) {
            user.setName(updateUserDTO.getName());
        }
        if (updateUserDTO.getSurname() != null) {
            user.setSurname(updateUserDTO.getSurname());
        }
        if (updateUserDTO.getEmail() != null) {
            user.setEmail(updateUserDTO.getEmail());
        }
        if (updateUserDTO.getPassword() != null && !updateUserDTO.getPassword().isEmpty()) {
            user.setPassword(passwordEncoder.encode(updateUserDTO.getPassword()));
        }
        if (updateUserDTO.getSchoolId() != null) {
            Optional<School> findSchool = schoolRepository.findById(updateUserDTO.getSchoolId());
            if (findSchool.isEmpty()) {
                return ResponseEntity.badRequest().body("bad school id");
            }
            user.setSchool(findSchool.get());
        }
        if (updateUserDTO.getFacultyId() != null) {
            Optional<Faculty> findFaculty = facultyRepository.findById(updateUserDTO.getFacultyId());
            if (findFaculty.isEmpty()) {
                return ResponseEntity.badRequest().body("bad faculty id");
            }
            user.setFaculty(findFaculty.get());
        }
        if (updateUserDTO.getRoleIds() != null && !updateUserDTO.getRoleIds().isEmpty()) {
            Collection<Role> roles = roleRepository.findAllById(updateUserDTO.getRoleIds());
            if (roles.size() != updateUserDTO.getRoleIds().size()) {
                return ResponseEntity.badRequest().body("bad role id");
            }
            user.setRoles(roles);
        }

        userRepository.save(user);
        return ResponseEntity.ok("user updated");
    }

    @PutMapping("/{id}/roles")
    public ResponseEntity<String> updateUserRoles(@PathVariable Long id, @RequestBody List<Long> roleIds) {
        Optional<User> findUser = userRepository.findById(id);
        if (findUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = findUser.get();
        Collection<Role> roles = roleRepository.findAllById(roleIds);
        if (roles.size() != roleIds.size()) {
            return ResponseEntity.badRequest().body("bad id");
        }

        user.setRoles(roles);
        userRepository.save(user);
        return ResponseEntity.ok("roles updated");
    }

    @PutMapping("/{id}/school")
    public ResponseEntity<String> updateUserSchool(@PathVariable Long id, @RequestBody SchoolDTO request) {
        Optional<User> findUser = userRepository.findById(id);
        if (findUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = findUser.get();
        Optional<School> findSchool = schoolRepository.findById(request.getSchoolId());
        if (findSchool.isEmpty()) {
            return ResponseEntity.badRequest().body(" bad ID.");
        }

        user.setSchool(findSchool.get());
        userRepository.save(user);
        return ResponseEntity.ok("school updated");
    }

    @PutMapping("/{id}/faculty")
    public ResponseEntity<String> updateUserFaculty(@PathVariable Long id, @RequestBody FacultyDTO request) {
        Optional<User> findUser = userRepository.findById(id);
        if (findUser.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        User user = findUser.get();
        Optional<Faculty> findFaculty = facultyRepository.findById(request.getFacultyId());
        if (findFaculty.isEmpty()) {
            return ResponseEntity.badRequest().body("bad id.");
        }

        user.setFaculty(findFaculty.get());
        userRepository.save(user);
        return ResponseEntity.ok("faculty updated");
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteUser(@PathVariable Long id) {
        Optional<User> user = userRepository.findById(id);
        if (user.isPresent()) {
            userRepository.delete(user.get());
            return ResponseEntity.ok("user deleted");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}
