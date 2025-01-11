package ukf.backend.Model.ProsAndCons;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

import ukf.backend.Model.Article.Article;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategory;
import java.util.List;

@Repository
public interface ProsAndConsRepository extends JpaRepository<ProsAndCons, Long> {
    Optional<ProsAndCons> findByCategory(ProsAndConsCategory category);
    List<ProsAndCons> findByCategoryAndArticle(ProsAndConsCategory category, Article article);
}