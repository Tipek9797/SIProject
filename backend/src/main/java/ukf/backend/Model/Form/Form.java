package ukf.backend.Model.Form;

import jakarta.persistence.*;
import lombok.*;
import ukf.backend.Model.Conference.Conference;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

@Data
@Entity
public class Form {
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;
    private String review;

    @OneToMany(mappedBy = "form", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Conference> conferences;
}
