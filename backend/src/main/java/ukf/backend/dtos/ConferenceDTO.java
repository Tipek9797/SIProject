
package ukf.backend.dtos;

import java.time.LocalDateTime;
import java.util.List;

import lombok.Data;

@Data
public class ConferenceDTO {
    private Long id;
    private List<Long> userIds;
    private String name;
    private String state;
    private String description;
    private LocalDateTime startUpload;
    private LocalDateTime closeUpload;
    private LocalDateTime startReview;
    private LocalDateTime closeReview;
    private Long formId;
}