package ukf.backend.dtos;

import lombok.Data;

@Data
public class FacultyDTO {
    private Long facultyId;
    private String name;
    private Long schoolId;
    private String schoolName;
}