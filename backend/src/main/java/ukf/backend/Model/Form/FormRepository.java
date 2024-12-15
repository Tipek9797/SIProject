package ukf.backend.Model.Form;

import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;

public interface FormRepository extends JpaRepository<Form, Long> {
    Optional<Form> findByReview(String review);
}