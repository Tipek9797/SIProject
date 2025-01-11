package ukf.backend.Model.ProsAndCons;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.ProsAndConsCategory.ProsAndConsCategory;

@Entity
@Data
public class ProsAndCons {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "category_id")
    private ProsAndConsCategory category;
    private String description;

    @ManyToOne
    @JoinColumn(name = "article_id")
    @JsonIgnore
    private Article article;
}
