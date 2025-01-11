package ukf.backend.Model.ProsAndConsCategory;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.Optional;

@Repository
public interface ProsAndConsCategoryRepository extends JpaRepository<ProsAndConsCategory, Long> {
    Optional<ProsAndConsCategory> findByName(String name);
}