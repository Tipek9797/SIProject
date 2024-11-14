package ukf.backend.Model.User;

import jakarta.persistence.*;
import lombok.Data;
import ukf.backend.Model.Faculty.Faculty;
import ukf.backend.Model.Role.Role;
import ukf.backend.Model.School.School;

import java.util.Collection;

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

    @ManyToMany
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
    private Faculty faculty;
}
