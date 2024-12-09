
package ukf.backend.dtos;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class ConferenceDTO {
    private Long id;
    private String name;
    private String state;
    private LocalDateTime startUpload;
    private LocalDateTime closeUpload;
    private LocalDateTime startReview;
    private LocalDateTime closeReview;
    private Long formId;
}