package ukf.backend.Model.ProsAndConsCategory;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class ProsAndConsCategory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String name;
}
