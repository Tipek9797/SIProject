package ukf.backend.dtos;

import lombok.AllArgsConstructor;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@AllArgsConstructor
public class FileDTO {
    private long id;
    private String fileNameDocx;
    private String fileTypeDocx;
    private String fileNamePdf;
    private String fileTypePdf;
    private long user;
    private LocalDateTime uploadDate;
}
