
package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.ArticleCategory.ArticleCategory;
import ukf.backend.Model.ArticleCategory.ArticleCategoryRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/article-categories")
public class ArticleCategoryController {

    @Autowired
    private ArticleCategoryRepository articleCategoryRepository;

    @GetMapping
    public List<ArticleCategory> getAllArticleCategories() {
        return articleCategoryRepository.findAll();
    }

    @GetMapping("/{id}")
    public ResponseEntity<ArticleCategory> getArticleCategoryById(@PathVariable Long id) {
        Optional<ArticleCategory> articleCategory = articleCategoryRepository.findById(id);
        if (articleCategory.isPresent()) {
            return ResponseEntity.ok(articleCategory.get());
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @PostMapping
    public ResponseEntity<ArticleCategory> createArticleCategory(@RequestBody ArticleCategory articleCategory) {
        ArticleCategory savedArticleCategory = articleCategoryRepository.save(articleCategory);
        return ResponseEntity.ok(savedArticleCategory);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ArticleCategory> updateArticleCategory(@PathVariable Long id, @RequestBody ArticleCategory updatedArticleCategory) {
        Optional<ArticleCategory> findArticleCategory = articleCategoryRepository.findById(id);
        if (findArticleCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ArticleCategory articleCategory = findArticleCategory.get();
        articleCategory.setName(updatedArticleCategory.getName());

        ArticleCategory savedArticleCategory = articleCategoryRepository.save(articleCategory);
        return ResponseEntity.ok(savedArticleCategory);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteArticleCategory(@PathVariable Long id) {
        Optional<ArticleCategory> articleCategory = articleCategoryRepository.findById(id);
        if (articleCategory.isPresent()) {
            articleCategoryRepository.delete(articleCategory.get());
            return ResponseEntity.ok("Article category deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }
}