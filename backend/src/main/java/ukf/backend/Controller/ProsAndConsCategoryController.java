
package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategory;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategoryRepository;

import java.util.List;
import java.util.Optional;

@RestController
@RequestMapping("/api/pros-and-cons-categories")
public class ProsAndConsCategoryController {

    @Autowired
    private ProsAndConsCategoryRepository categoryRepository;

    @GetMapping
    public List<ProsAndConsCategory> getAllCategories() {
        return categoryRepository.findAll();
    }

    @PostMapping
    public ResponseEntity<String> createCategory(@RequestBody ProsAndConsCategory category) {
        categoryRepository.save(category);
        return ResponseEntity.ok("Category created");
    }

    @GetMapping("/{id}")
    public ProsAndConsCategory getCategoryById(@PathVariable Long id) {
        return categoryRepository.findById(id).orElse(null);
    }

    @PutMapping("/{id}")
    public ResponseEntity<String> updateCategory(@PathVariable Long id, @RequestBody ProsAndConsCategory category) {
        Optional<ProsAndConsCategory> findCategory = categoryRepository.findById(id);
        if (findCategory.isEmpty()) {
            return ResponseEntity.notFound().build();
        }

        ProsAndConsCategory existingCategory = findCategory.get();
        existingCategory.setName(category.getName());

        categoryRepository.save(existingCategory);
        return ResponseEntity.ok("Category updated");
    }

    @DeleteMapping("/{id}")
    public void deleteCategory(@PathVariable Long id) {
        categoryRepository.deleteById(id);
    }
}