package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Article.ArticleRepository;
import ukf.backend.Model.ProsAndCons.ProsAndCons;
import ukf.backend.Model.ProsAndCons.ProsAndConsRepository;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategory;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategoryRepository;
import ukf.backend.dtos.ProsAndConsDTO;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pros-and-cons")
public class ProsAndConsController {

    @Autowired
    private ProsAndConsRepository prosAndConsRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @Autowired
    private ProsAndConsCategoryRepository categoryRepository;

    @GetMapping
    public List<ProsAndCons> getAllProsAndCons() {
        return prosAndConsRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<String> createProsAndCons(@RequestBody ProsAndConsDTO prosAndConsDTO) {
        if (prosAndConsDTO.getArticleId() == null || prosAndConsDTO.getCategoryId() == null) {
            return ResponseEntity.badRequest().body("Article ID and Category ID must not be null");
        }

        ProsAndCons prosAndCons = new ProsAndCons();
        prosAndCons.setDescription(prosAndConsDTO.getDescription());

        Optional<Article> findArticle = articleRepository.findById(prosAndConsDTO.getArticleId());
        if (findArticle.isEmpty()) {
            return ResponseEntity.badRequest().body("Wrong article ID");
        }
        prosAndCons.setArticle(findArticle.get());

        Optional<ProsAndConsCategory> findCategory = categoryRepository.findById(prosAndConsDTO.getCategoryId());
        if (findCategory.isEmpty()) {
            return ResponseEntity.badRequest().body("Wrong category ID");
        }
        prosAndCons.setCategory(findCategory.get());

        prosAndConsRepository.save(prosAndCons);
        return ResponseEntity.ok("Pro or Con created");
    }

    @GetMapping("/{id}")
    public ProsAndCons getProsAndConsById(@PathVariable Long id) {
        return prosAndConsRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateProsAndCons(@PathVariable Long id, @RequestBody ProsAndConsDTO prosAndConsDTO) {
        Optional<ProsAndCons> findProsAndCons = prosAndConsRepository.findById(id);
        if (findProsAndCons.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProsAndCons prosAndCons = findProsAndCons.get();
        prosAndCons.setDescription(prosAndConsDTO.getDescription());

        if (prosAndConsDTO.getArticleId() != null) {
            Optional<Article> findArticle = articleRepository.findById(prosAndConsDTO.getArticleId());
            if (findArticle.isEmpty()) {
                return ResponseEntity.badRequest().body("Wrong article ID");
            }
            prosAndCons.setArticle(findArticle.get());
        }

        if (prosAndConsDTO.getCategoryId() != null) {
            Optional<ProsAndConsCategory> findCategory = categoryRepository.findById(prosAndConsDTO.getCategoryId());
            if (findCategory.isEmpty()) {
                return ResponseEntity.badRequest().body("Wrong category ID");
            }
            prosAndCons.setCategory(findCategory.get());
        }

        prosAndConsRepository.save(prosAndCons);
        return ResponseEntity.ok("Pro or Con updated");
    }

    @PatchMapping("/{id}")
    public ResponseEntity<String> patchProsAndCons(@PathVariable Long id, @RequestBody ProsAndConsDTO prosAndConsDTO) {
        Optional<ProsAndCons> findProsAndCons = prosAndConsRepository.findById(id);
        if (findProsAndCons.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProsAndCons prosAndCons = findProsAndCons.get();

        if (prosAndConsDTO.getDescription() != null) {
            prosAndCons.setDescription(prosAndConsDTO.getDescription());
        }

        if (prosAndConsDTO.getArticleId() != null) {
            Optional<Article> findArticle = articleRepository.findById(prosAndConsDTO.getArticleId());
            if (findArticle.isEmpty()) {
                return ResponseEntity.badRequest().body("Wrong article ID");
            }
            prosAndCons.setArticle(findArticle.get());
        }

        if (prosAndConsDTO.getCategoryId() != null) {
            Optional<ProsAndConsCategory> findCategory = categoryRepository.findById(prosAndConsDTO.getCategoryId());
            if (findCategory.isEmpty()) {
                return ResponseEntity.badRequest().body("Wrong category ID");
            }
            prosAndCons.setCategory(findCategory.get());
        }

        prosAndConsRepository.save(prosAndCons);
        return ResponseEntity.ok("Pro or Con patched");
    }

    @DeleteMapping("/{id}")
    public void deleteProsAndCons(@PathVariable Long id) {
        prosAndConsRepository.deleteById(id);
    }
}
