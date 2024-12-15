package ukf.backend.Model.User;

import jakarta.persistence.*;
import lombok.Data;
import lombok.ToString;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.Role.Role;
import ukf.backend.Model.School.School;

import java.util.Collection;
import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Data
public class User {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String name;
    private String surname;
    private String email;
    private String password;
    private boolean accountVerified;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
            name = "users_roles",
            joinColumns = @JoinColumn(
                    name = "user_id", referencedColumnName = "id"),
            inverseJoinColumns = @JoinColumn(
                    name = "role_id", referencedColumnName = "id"))
    private Collection<Role> roles;

    @ManyToOne
    @JoinColumn(name = "school_id")
    private School school;

    @ManyToOne
    @JoinColumn(name = "faculty_id")
    @ToString.Exclude
    private Faculty faculty;

    @ManyToMany(mappedBy = "users")
    @JsonIgnore
    private List<Article> articles;
}
