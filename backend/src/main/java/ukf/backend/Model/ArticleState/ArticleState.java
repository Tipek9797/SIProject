package ukf.backend.Model.ArticleState;

import jakarta.persistence.*;
import lombok.Data;
import ukf.backend.Model.Article.Article;

import java.util.List;
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class ArticleState {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;

    @OneToMany(mappedBy = "state")
    @JsonIgnore
    private List<Article> articles;
}