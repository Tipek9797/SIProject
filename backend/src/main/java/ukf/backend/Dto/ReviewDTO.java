package ukf.backend.Dto;

import lombok.Data;

@Data
public class ReviewDTO {
    private int rating;
    private String comment;
    private boolean isAccepted;
    private Long articleId;
}