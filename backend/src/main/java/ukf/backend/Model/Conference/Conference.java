package ukf.backend.Model.Conference;

import jakarta.persistence.*;
import lombok.Data;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Form.Form;
import ukf.backend.Model.User.User;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Data
public class Conference {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String state;
    private String name;
    private String description;
    private LocalDateTime startUpload;
    private LocalDateTime closeUpload;
    private LocalDateTime startReview;
    private LocalDateTime closeReview;
    private LocalDateTime conferenceStart;
    private LocalDateTime conferenceEnd;

    @ManyToOne
    @JoinColumn(name = "form_id", nullable = false)
    private Form form;

    @OneToMany(mappedBy = "conference", cascade = CascadeType.ALL)
    private List<Article> articles;

    @ManyToMany
    @JoinTable(
            name = "conference_users",
            joinColumns = @JoinColumn(name = "conference_id"),
            inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> users;

}
