package ukf.backend.Model.File;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;
import ukf.backend.Model.User.User;

import java.time.LocalDateTime;

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

    @ManyToOne
    private User user;

    @DateTimeFormat
    private LocalDateTime uploadDate;

}
