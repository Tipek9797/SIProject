package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import ukf.backend.dtos.FileDTO;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.Article.ArticleRepository;
import ukf.backend.Model.File.File;
import ukf.backend.Model.File.FileRepository;
import ukf.backend.Model.File.FileService;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;

import java.time.LocalDateTime;
import java.time.ZoneId;
import java.util.List;
import java.util.Objects;
import java.util.Optional;

@RestController
@RequestMapping("/api/files")
public class FileController {

    @Autowired
    private FileService fileService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private ArticleRepository articleRepository;

    @PostMapping("/upload/{articleId}")
    public ResponseEntity<String> uploadFiles(@PathVariable Long articleId,
                                              @RequestParam("fileDocx") MultipartFile fileDocx,
                                              @RequestParam("filePdf") MultipartFile filePdf) throws Exception {
        //Optional<User> user = userRepository.findById(userId);

        UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication()
                .getPrincipal();
        String email = userDetails.getUsername();
        Optional<User> user = userRepository.findByEmail(email);

        Optional<Article> article = articleRepository.findById(articleId);


        if (user.isEmpty()) {
            return new ResponseEntity<>("User doesn't exist.", HttpStatus.BAD_REQUEST);
        }

        if (article.isEmpty()) {
            return new ResponseEntity<>("Article doesn't exist.", HttpStatus.BAD_REQUEST);
        }

        String contentTypeDocx = fileDocx.getContentType();
        String contentTypePdf = filePdf.getContentType();

        if (!Objects.equals(contentTypeDocx, "application/vnd.openxmlformats-officedocument.wordprocessingml.document") ||
            !Objects.equals(contentTypePdf, "application/pdf")) {
            return new ResponseEntity<>("File type is not supported.", HttpStatus.BAD_REQUEST);
        }

        LocalDateTime localDateTime = LocalDateTime.now(ZoneId.of("GMT+01:00"));

        fileService.saveAttachments(fileDocx, filePdf, user.get(), article.get(), localDateTime);

        return new ResponseEntity<>("Files uploaded successfully.", HttpStatus.OK);
    }

    @GetMapping("/download/{fileId}/{fileType}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId, @PathVariable String fileType) throws Exception {
        File attachment = fileService.getAttachment(fileId);
        byte[] data;
        String fileName;
        String contentType;

        if ("docx".equalsIgnoreCase(fileType)) {
            data = attachment.getDataDocx();
            fileName = attachment.getFileNameDocx();
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if ("pdf".equalsIgnoreCase(fileType)) {
            data = attachment.getDataPdf();
            fileName = attachment.getFileNamePdf();
            contentType = "application/pdf";
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }

        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(new ByteArrayResource(data));
    }

    @GetMapping("/download/recent/{articleId}/{fileType}")
    public ResponseEntity<Resource> downloadMostRecentFile(@PathVariable Long articleId, @PathVariable String fileType) throws Exception {
        Optional<Article> article = articleRepository.findById(articleId);
        if (article.isEmpty()) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        File mostRecentFile = fileRepository.findTopByArticleOrderByUploadDateDesc(article.get());
        if (mostRecentFile == null) {
            return new ResponseEntity<>(HttpStatus.NOT_FOUND);
        }

        byte[] data;
        String fileName;
        String contentType;

        if ("docx".equalsIgnoreCase(fileType)) {
            data = mostRecentFile.getDataDocx();
            fileName = mostRecentFile.getFileNameDocx();
            contentType = "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
        } else if ("pdf".equalsIgnoreCase(fileType)) {
            data = mostRecentFile.getDataPdf();
            fileName = mostRecentFile.getFileNamePdf();
            contentType = "application/pdf";
        } else {
            return new ResponseEntity<>(HttpStatus.BAD_REQUEST);
        }
        
        return ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(contentType))
                .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                .header(HttpHeaders.ACCESS_CONTROL_EXPOSE_HEADERS, HttpHeaders.CONTENT_DISPOSITION)
                .body(new ByteArrayResource(data));
    }

    @GetMapping
    public List<FileDTO> getAllFiles() {
        return fileService.getAllFiles();
    }

    @GetMapping("/{userId}")
    public List<FileDTO> getAllFilesByUser(@PathVariable Long userId) {

        return fileService.getAllFilesByUser(userId);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteFile(@PathVariable Long id) {
        Optional<File> file = fileRepository.findById(id);
        if (file.isPresent()) {
            fileRepository.delete(file.get());
            return ResponseEntity.ok("File deleted successfully.");
        } else {
            return ResponseEntity.notFound().build();
        }
    }

    @DeleteMapping("/user/{userId}")
    public ResponseEntity<String> deleteAllFilesByUser(@PathVariable Long userId) {
        Optional<User> user = userRepository.findById(userId);
        if (user.isEmpty()) {return ResponseEntity.notFound().build();}
        Optional<List<File>> files = fileRepository.findFilesByUser(user.get());
        if (files.isEmpty()) {return ResponseEntity.notFound().build();}

        fileRepository.deleteAll(files.get());

        return ResponseEntity.ok("Files deleted successfully.");
    }
}
