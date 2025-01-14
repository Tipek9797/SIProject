
package ukf.backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;
import ukf.backend.Model.Article.Article;

@Data
public class ConferenceDTO {
    private Long id;
    private String name;
    private String state;
    private List<Article> articles;
    private LocalDateTime startUpload;
    private LocalDateTime closeUpload;
    private LocalDateTime startReview;
    private LocalDateTime closeReview;
    private Long formId;
}