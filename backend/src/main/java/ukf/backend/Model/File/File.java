package ukf.backend.Model.File;

import jakarta.persistence.*;
import lombok.Data;
import org.springframework.format.annotation.DateTimeFormat;

import com.fasterxml.jackson.annotation.JsonIgnore;

import ukf.backend.Model.User.User;
import ukf.backend.Model.Article.Article;

import java.time.LocalDateTime;

@Entity
@Data
public class File {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private Long id;

    private String fileNameDocx;
    private String fileNamePdf;
    private String fileTypeDocx;
    private String fileTypePdf;

    @Lob
    private byte[] dataDocx;

    @Lob
    private byte[] dataPdf;

    @ManyToOne
    private User user;

    @ManyToOne
    @JoinColumn(name = "article_id")
    @JsonIgnore
    private Article article;

    @DateTimeFormat
    private LocalDateTime uploadDate;

}
