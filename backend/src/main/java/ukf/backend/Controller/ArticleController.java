package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Article.ArticleRepository;
import ukf.backend.Model.Conference.Conference;
import ukf.backend.Model.Conference.ConferenceRepository;
import ukf.backend.Model.ArticleState.ArticleState;
import ukf.backend.Model.ArticleState.ArticleStateRepository;
import ukf.backend.Model.ArticleCategory.ArticleCategory;
import ukf.backend.Model.ArticleCategory.ArticleCategoryRepository;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;
import ukf.backend.dtos.UpdateArticleDTO;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/articles")
public class ArticleController {

    @Autowired
    private ArticleRepository articleRepository;
    @Autowired
    private ConferenceRepository conferenceRepository;
    @Autowired
    private ArticleStateRepository articleStateRepository;
    @Autowired
    private ArticleCategoryRepository articleCategoryRepository;
    @Autowired
    private UserRepository userRepository;

    @GetMapping
    public List<Article> getAllArticles() {
        return articleRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<Article> getArticleById(@PathVariable Long id) {
        Optional<Article> article = articleRepository.findById(id);
        if (article.isPresent()) {
            return ResponseEntity.ok(article.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<Article> createArticle(@RequestBody UpdateArticleDTO articleDTO) {
        Article article = new Article();
        article.setName(articleDTO.getName());
        article.setDate(articleDTO.getDate());
        article.setFilePath(articleDTO.getFilePath());
        article.setReviewerId(articleDTO.getReviewerId());

        if (articleDTO.getConferenceId() != null) {
            Optional<Conference> conference = conferenceRepository.findById(articleDTO.getConferenceId());
            if (conference.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setConference(conference.get());
        }

        if (articleDTO.getStateId() != null) {
            Optional<ArticleState> state = articleStateRepository.findById(articleDTO.getStateId());
            if (state.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setState(state.get());
        }

        if (articleDTO.getUserIds() != null && !articleDTO.getUserIds().isEmpty()) {
            List<User> users = userRepository.findAllById(articleDTO.getUserIds());
            if (users.size() != articleDTO.getUserIds().size()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setUsers(users);
        }

        if (articleDTO.getCategoryIds() != null && !articleDTO.getCategoryIds().isEmpty()) {
            List<ArticleCategory> categories = articleCategoryRepository.findAllById(articleDTO.getCategoryIds());
            if (categories.size() != articleDTO.getCategoryIds().size()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setCategories(categories);
        }

        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.ok(savedArticle);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Article> updateArticle(@PathVariable Long id, @RequestBody UpdateArticleDTO articleDTO) {
        Optional<Article> findArticle = articleRepository.findById(id);
        if (findArticle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Article article = findArticle.get();
        article.setName(articleDTO.getName());
        article.setDate(articleDTO.getDate());
        article.setFilePath(articleDTO.getFilePath());
        article.setReviewerId(articleDTO.getReviewerId());

        if (articleDTO.getConferenceId() != null) {
            Optional<Conference> conference = conferenceRepository.findById(articleDTO.getConferenceId());
            if (conference.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setConference(conference.get());
        }

        if (articleDTO.getStateId() != null) {
            Optional<ArticleState> state = articleStateRepository.findById(articleDTO.getStateId());
            if (state.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setState(state.get());
        }

        if (articleDTO.getUserIds() != null && !articleDTO.getUserIds().isEmpty()) {
            List<User> users = userRepository.findAllById(articleDTO.getUserIds());
            if (users.size() != articleDTO.getUserIds().size()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setUsers(users);
        }

        if (articleDTO.getCategoryIds() != null && !articleDTO.getCategoryIds().isEmpty()) {
            List<ArticleCategory> categories = articleCategoryRepository.findAllById(articleDTO.getCategoryIds());
            if (categories.size() != articleDTO.getCategoryIds().size()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setCategories(categories);
        }

        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.ok(savedArticle);
    }

    @PatchMapping("/{id}")
    public ResponseEntity<Article> patchArticle(@PathVariable Long id, @RequestBody UpdateArticleDTO articleDTO) {
        Optional<Article> findArticle = articleRepository.findById(id);
        if (findArticle.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        Article article = findArticle.get();

        if (articleDTO.getName() != null) {
            article.setName(articleDTO.getName());
        }
        if (articleDTO.getDate() != null) {
            article.setDate(articleDTO.getDate());
        }
        if (articleDTO.getFilePath() != null) {
            article.setFilePath(articleDTO.getFilePath());
        }
        if (articleDTO.getReviewerId() != null) {
            article.setReviewerId(articleDTO.getReviewerId());
        }
        if (articleDTO.getConferenceId() != null) {
            Optional<Conference> conference = conferenceRepository.findById(articleDTO.getConferenceId());
            if (conference.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setConference(conference.get());
        }
        if (articleDTO.getStateId() != null) {
            Optional<ArticleState> state = articleStateRepository.findById(articleDTO.getStateId());
            if (state.isEmpty()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setState(state.get());
        }
        if (articleDTO.getUserIds() != null && !articleDTO.getUserIds().isEmpty()) {
            List<User> users = userRepository.findAllById(articleDTO.getUserIds());
            if (users.size() != articleDTO.getUserIds().size()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setUsers(users);
        }
        if (articleDTO.getCategoryIds() != null && !articleDTO.getCategoryIds().isEmpty()) {
            List<ArticleCategory> categories = articleCategoryRepository.findAllById(articleDTO.getCategoryIds());
            if (categories.size() != articleDTO.getCategoryIds().size()) {
                return ResponseEntity.badRequest().body(null);
            }
            article.setCategories(categories);
        }

        Article savedArticle = articleRepository.save(article);
        return ResponseEntity.ok(savedArticle);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticle(@PathVariable Long id) {
        Optional<Article> article = articleRepository.findById(id);
        if (article.isPresent()) {
            articleRepository.delete(article.get());
            return ResponseEntity.ok("Article deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}