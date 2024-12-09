package ukf.backend.Dto;

import lombok.Data;
import java.util.List;

@Data
public class UpdateUserDTO {
    private String name;
    private String surname;
    private String email;
    private String password;
    private Long schoolId;
    private Long facultyId;
    private List<Long> roleIds;
}