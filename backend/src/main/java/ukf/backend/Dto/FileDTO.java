package ukf.backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;
import ukf.backend.Model.User.User;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FileDTO {
    private long id;
    private String fileName;
    private String fileType;
    private long user;
    private LocalDateTime uploadDate;
}
