package ukf.backend.Model.School;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import lombok.Data;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.User.User;

import java.util.Collection;

@Entity
@Data
public class School {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;

    @OneToMany(mappedBy = "school")
    @JsonIgnore
    private Collection<User> users;

    @OneToMany(mappedBy = "school")
    private Collection<Faculty> faculties;
}
