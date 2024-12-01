package ukf.backend.Model.Article;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import ukf.backend.Model.ArticleCategory.ArticleCategory;
import ukf.backend.Model.Conference.Conference;
import ukf.backend.Model.Review.Review;
import ukf.backend.Model.User.User;
import ukf.backend.Model.ArticleState.ArticleState;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Article {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private LocalDateTime date;
    private String filePath;
    private Long reviewerId;

    @ManyToOne
    @JoinColumn(name = "conference_id")
    @JsonIgnore
    private Conference conference;

    @OneToMany(mappedBy = "article")
    @JsonManagedReference
    private List<Review> reviews;

    @ManyToOne
    @JoinColumn(name = "state_id")
    private ArticleState state;

    @ManyToMany
    @JoinTable(
        name = "user_articles",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users;

    @ManyToMany
    @JoinTable(
        name = "article_article_category",
        joinColumns = @JoinColumn(name = "article_id"),
        inverseJoinColumns = @JoinColumn(name = "category_id")
    )
    private List<ArticleCategory> categories;
}
