package ukf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

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
