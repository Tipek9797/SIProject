package ukf.backend.Model.File;

import jakarta.persistence.*;
import lombok.Data;

@Entity
@Data
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fileName;
    private String fileType;

    @Lob
    private byte[] data;
}
