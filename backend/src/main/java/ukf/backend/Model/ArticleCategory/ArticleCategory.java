package ukf.backend.Model.ArticleCategory;

import jakarta.persistence.*;
import lombok.Data;
import ukf.backend.Model.Article.Article;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class ArticleCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;

    @ManyToMany(mappedBy = "categories")
    @JsonIgnore
    private List<Article> articles;
}