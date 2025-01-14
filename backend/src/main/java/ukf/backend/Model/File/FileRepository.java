package ukf.backend.Model.File;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import ukf.backend.Model.User.User;
import ukf.backend.Model.Article.Article;

import java.util.List;
import java.util.Optional;

@Repository
public interface FileRepository extends JpaRepository<File, Long> {
    Optional<List<File>> findFilesByUser(User user);
    File findTopByArticleOrderByUploadDateDesc(Article article);
}
