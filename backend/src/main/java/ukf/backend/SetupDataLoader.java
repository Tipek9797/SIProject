package ukf.backend;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.context.ApplicationListener;
import org.springframework.context.event.ContextRefreshedEvent;
import org.springframework.stereotype.Component;
import org.springframework.transaction.annotation.Transactional;
import ukf.backend.Model.AllowedEmailDomain.AllowedEmailDomain;
import ukf.backend.Model.AllowedEmailDomain.AllowedEmailDomainRepository;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Article.ArticleRepository;
import ukf.backend.Model.ArticleCategory.ArticleCategory;
import ukf.backend.Model.ArticleCategory.ArticleCategoryRepository;
import ukf.backend.Model.Conference.Conference;
import ukf.backend.Model.Conference.ConferenceRepository;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.Faculty.FacultyRepository;
import ukf.backend.Model.Form.Form;
import ukf.backend.Model.Form.FormRepository;
import ukf.backend.Model.Review.Review;
import ukf.backend.Model.Review.ReviewRepository;
import ukf.backend.Model.Role.Role;
import ukf.backend.Model.Role.RoleRepository;
import ukf.backend.Model.School.School;
import ukf.backend.Model.School.SchoolRepository;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import ukf.backend.Model.ArticleState.ArticleState;
import ukf.backend.Model.ArticleState.ArticleStateRepository;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategory;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategoryRepository;
import ukf.backend.Model.ProsAndCons.ProsAndCons;
import ukf.backend.Model.ProsAndCons.ProsAndConsRepository;

import java.time.LocalDateTime;
import java.util.Collections;
import java.util.List;
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

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ConferenceRepository conferenceRepository;

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private FormRepository formRepository;

    @Autowired
    private ArticleCategoryRepository articleCategoryRepository;

    @Autowired
    private ArticleStateRepository articleStateRepository;

    @Autowired
    private ProsAndConsCategoryRepository prosAndConsCategoryRepository;

    @Autowired
    private ProsAndConsRepository prosAndConsRepository;

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

        createFacultyIfNotFound("INF", "UKF");
        createFacultyIfNotFound("BIO", "UKF");
        createFacultyIfNotFound("INF", "TRN");
        createFacultyIfNotFound("BIO", "TRN");

        createStateIfNotFound("Odoslané");
        createStateIfNotFound("Prebieha Hodnotenie");
        createStateIfNotFound("Ohodnotené");

        createCategoryIfNotFound("Kategoria 2");

        ProsAndConsCategory proCategory = createProsAndConsCategoryIfNotFound("PRO");
        ProsAndConsCategory conCategory = createProsAndConsCategoryIfNotFound("CON");

        Role adminRole = roleRepository.findByName("ROLE_ADMIN");
        School school = schoolRepository.findByName("ukf").orElseThrow();
        Faculty faculty = facultyRepository.findByNameAndSchool("inf", school).orElseThrow();
        Form form = createFormIfNotFound("Formular");
        Conference conference = createConferenceIfNotFound("Konferencia Test", "Otvorena", LocalDateTime.now(),
                LocalDateTime.now().plusDays(30), LocalDateTime.now().plusDays(40), LocalDateTime.now().plusDays(50), form);
        ArticleCategory articleCategory = createCategoryIfNotFound("Kategoria 1");
        ArticleState stateSubmitted = articleStateRepository.findByName("Odoslané").orElseThrow();
        User user = createUserIfNotFound("Test", "Test", "test", "test@student.ukf.sk", adminRole, school, faculty);
        Article article = createArticleIfNotFound("Praca1", LocalDateTime.now(), stateSubmitted, "/cesta",
                conference, List.of(articleCategory), List.of(user),null);

        createReviewIfNotFound(5, "Super", true, article);

        createProsAndConsIfNotFound(proCategory, "cool", article);
        createProsAndConsIfNotFound(conCategory, "very bad", article);

        alreadySetup = true;
    }

    @Transactional
    void createRoleIfNotFound(String name) {

        Role role = roleRepository.findByName(name);
        if (role == null) {
            role = new Role();
            role.setName(name);
            roleRepository.save(role);
            return;
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
    
    User createUserIfNotFound(String name, String surname, String password, String email, Role role, School school,
                              Faculty faculty) {

        Optional<User> users = userRepository.findByEmail(email);
        if (users.isEmpty()) {
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
            return user;
        }
        return users.get();
    }

    @Transactional
    void createReviewIfNotFound(int rating, String comment, boolean isAccepted, Article article) {
        List<Review> reviews = reviewRepository.findByRating(rating);
        boolean reviewExists = reviews.stream().anyMatch(review -> review.getComment().equals(comment) &&
                review.isAccepted() == isAccepted && review.getArticle().equals(article));
        if (!reviewExists) {
            Review review = new Review();
            review.setRating(rating);
            review.setComment(comment);
            review.setAccepted(isAccepted);
            review.setArticle(article);
            reviewRepository.save(review);
        }
    }

    @Transactional
    Form createFormIfNotFound(String review) {
        Optional<Form> formOptional = formRepository.findByReview(review);
        if (formOptional.isEmpty()) {
            Form form = new Form();
            form.setReview(review);
            formRepository.save(form);
            return form;
        }
        return formOptional.get();
    }

    @Transactional
    Conference createConferenceIfNotFound(String name, String state, LocalDateTime startUpload,
                                          LocalDateTime closeUpload, LocalDateTime startReview, LocalDateTime closeReview, Form form) {
        Optional<Conference> conferenceOptional = conferenceRepository.findByName(name);
        if (conferenceOptional.isEmpty()) {
            Conference conference = new Conference();
            conference.setName(name);
            conference.setState(state);
            conference.setStartUpload(startUpload);
            conference.setCloseUpload(closeUpload);
            conference.setStartReview(startReview);
            conference.setCloseReview(closeReview);
            conference.setForm(form);
            conferenceRepository.save(conference);
            return conference;
        }
        return conferenceOptional.get();
    }

    @Transactional
    Article createArticleIfNotFound(String name, LocalDateTime date, ArticleState state, String filePath,
                                    Conference conference, List<ArticleCategory> categories, List<User> users,Long reviewerId) {
        Optional<Article> articleOptional = articleRepository.findByName(name);
        if (articleOptional.isEmpty()) {
            Article article = new Article();
            article.setName(name);
            article.setDate(date);
            article.setState(state);
            article.setFilePath(filePath);
            article.setConference(conference);
            article.setCategories(categories);
            article.setUsers(users);
            article.setReviewerId(reviewerId);
            articleRepository.save(article);
            return article;
        }
        return articleOptional.get();
    }

    @Transactional
    ArticleCategory createCategoryIfNotFound(String name) {
        Optional<ArticleCategory> categoryOptional = articleCategoryRepository.findByName(name);
        if (categoryOptional.isEmpty()) {
            ArticleCategory category = new ArticleCategory();
            category.setName(name);
            articleCategoryRepository.save(category);
            return category;
        }
        return categoryOptional.get();
    }

    @Transactional
    ArticleState createStateIfNotFound(String name) {
        Optional<ArticleState> stateOptional = articleStateRepository.findByName(name);
        if (stateOptional.isEmpty()) {
            ArticleState state = new ArticleState();
            state.setName(name);
            articleStateRepository.save(state);
            return state;
        }
        return stateOptional.get();
    }

    @Transactional
    ProsAndConsCategory createProsAndConsCategoryIfNotFound(String name) {
        Optional<ProsAndConsCategory> categoryOptional = prosAndConsCategoryRepository.findByName(name);
        if (categoryOptional.isEmpty()) {
            ProsAndConsCategory category = new ProsAndConsCategory();
            category.setName(name);
            prosAndConsCategoryRepository.save(category);
            return category;
        }
        return categoryOptional.get();
    }

    @Transactional
    void createProsAndConsIfNotFound(ProsAndConsCategory category, String description, Article article) {
        List<ProsAndCons> prosAndConsList = prosAndConsRepository.findByCategoryAndArticle(category, article);
        boolean prosAndConsExists = prosAndConsList.stream().anyMatch(prosAndCons -> prosAndCons.getDescription().equals(description));
        if (!prosAndConsExists) {
            ProsAndCons prosAndCons = new ProsAndCons();
            prosAndCons.setCategory(category);
            prosAndCons.setDescription(description);
            prosAndCons.setArticle(article);
            prosAndConsRepository.save(prosAndCons);
        }
    }
}
