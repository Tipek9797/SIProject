package ukf.backend.Dto;

import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class FileDTO {
    private String fileName;
    private String downloadURL;
    private String fileType;
    private long fileSize;
}
