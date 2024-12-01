package ukf.backend.Model.ArticleState;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ArticleStateRepository extends JpaRepository<ArticleState, Long> {
    Optional<ArticleState> findByName(String name);
}