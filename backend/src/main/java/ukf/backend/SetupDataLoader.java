package ukf.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ukf.backend.Model.AllowedEmailDomain.AllowedEmailDomain;
import ukf.backend.Model.AllowedEmailDomain.AllowedEmailDomainRepository;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.Faculty.FacultyRepository;
import ukf.backend.Model.Role.Role;
import ukf.backend.Model.Role.RoleRepository;
import ukf.backend.Model.School.School;
import ukf.backend.Model.School.SchoolRepository;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.Collections;
import java.util.Optional;

@Component
public class SetupDataLoader implements
        ApplicationListener<ContextRefreshedEvent> {

    boolean alreadySetup = false;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoleRepository roleRepository;

    @Autowired
    private AllowedEmailDomainRepository allowedEmailDomainRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private FacultyRepository facultyRepository;

    @Autowired
    private SchoolRepository schoolRepository;

    @Override
    @Transactional
    public void onApplicationEvent(ContextRefreshedEvent event) {

        if (alreadySetup)
            return;

        createDomainIfNotFound("student.ukf.sk");
        createDomainIfNotFound("stu.sk");

        createRoleIfNotFound("ROLE_ADMIN");
        createRoleIfNotFound("ROLE_REVIEWER");
        createRoleIfNotFound("ROLE_USER");

        createSchoolIfNotFound("UKF");
        createSchoolIfNotFound("TRN");

        createFacultyIfNotFound("INF","UKF");
        createFacultyIfNotFound("BIO","UKF");
        createFacultyIfNotFound("INF","TRN");
        createFacultyIfNotFound("BIO","TRN");

        Role adminRole = roleRepository.findByName("ROLE_ADMIN");

        School school = schoolRepository.findByName("ukf").orElseThrow();
        Faculty faculty = facultyRepository.findByNameAndSchool("inf", school).orElseThrow();

        createUserIfNotFound("Test", "Test", "test", "test@student.ukf.sk", adminRole, school, faculty);

        alreadySetup = true;
    }

    @Transactional
    void createRoleIfNotFound(String name) {

        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role();
            role.setName(name);
            roleRepository.save(role);
        }
    }

    @Transactional
    void createDomainIfNotFound(String name) {

        Optional<AllowedEmailDomain> domains = allowedEmailDomainRepository.findByDomain(name);
        if (domains.isEmpty()) {
            AllowedEmailDomain allowedEmailDomain = new AllowedEmailDomain();
            allowedEmailDomain.setDomain(name);
            allowedEmailDomainRepository.save(allowedEmailDomain);
        }
    }

    @Transactional
    void createSchoolIfNotFound(String name) {
        School school = schoolRepository.findByName(name).orElse(null);
        if (school == null) {
            school = new School();
            school.setName(name);
            schoolRepository.save(school);
        }
    }

    @Transactional
    void createFacultyIfNotFound(String name, String schoolName) {
        School school = schoolRepository.findByName(schoolName).orElse(null);
        if (school != null) {
            Faculty faculty = facultyRepository.findByNameAndSchool(name, school).orElse(null);
            if (faculty == null) {
                faculty = new Faculty();
                faculty.setName(name);
                faculty.setSchool(school);
                facultyRepository.save(faculty);
            }
        }
    }

    @Transactional
    void createUserIfNotFound(String name, String surname, String password, String email, Role role,School school,Faculty faculty) {

        Optional<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()){
            User user = new User();
            user.setName(name);
            user.setSurname(surname);
            user.setPassword(passwordEncoder.encode(password));
            user.setEmail(email);
            user.setRoles(Collections.singletonList(role));
            user.setSchool(school);
            user.setFaculty(faculty);
            user.setAccountVerified(true);
            userRepository.save(user);
        }
    }
}
