package ukf.backend.dtos;

import lombok.Data;
import ukf.backend.Model.ProsAndCons.ProsAndCons;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class UpdateArticleDTO {
    private String name;
    private LocalDateTime date;
    private String filePath;
    private Long reviewerId;
    private Long conferenceId;
    private Long stateId;
    private List<Long> userIds;
    private List<Long> categoryIds;
    private List<ProsAndCons> prosAndConsList;
    private List<Long> fileIds;
}