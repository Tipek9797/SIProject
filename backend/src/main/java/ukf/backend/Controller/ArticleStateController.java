
package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.ArticleState.ArticleState;
import ukf.backend.Model.ArticleState.ArticleStateRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/article-states")
public class ArticleStateController {

    @Autowired
    private ArticleStateRepository articleStateRepository;

    @GetMapping
    public List<ArticleState> getAllArticleStates() {
        return articleStateRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleState> getArticleStateById(@PathVariable Long id) {
        Optional<ArticleState> articleState = articleStateRepository.findById(id);
        if (articleState.isPresent()) {
            return ResponseEntity.ok(articleState.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ArticleState> createArticleState(@RequestBody ArticleState articleState) {
        ArticleState savedArticleState = articleStateRepository.save(articleState);
        return ResponseEntity.ok(savedArticleState);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleState> updateArticleState(@PathVariable Long id, @RequestBody ArticleState updatedArticleState) {
        Optional<ArticleState> findArticleState = articleStateRepository.findById(id);
        if (findArticleState.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ArticleState articleState = findArticleState.get();
        articleState.setName(updatedArticleState.getName());

        ArticleState savedArticleState = articleStateRepository.save(articleState);
        return ResponseEntity.ok(savedArticleState);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticleState(@PathVariable Long id) {
        Optional<ArticleState> articleState = articleStateRepository.findById(id);
        if (articleState.isPresent()) {
            articleStateRepository.delete(articleState.get());
            return ResponseEntity.ok("Article state deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}