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

    /*@PostMapping("/upload")
    public FileDTO uploadFile(@RequestParam("file") MultipartFile file) throws Exception {

        //UserDetails userDetails = (UserDetails) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
        //String username = userDetails.getUsername();

        //Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        //UserDetails userDetails = (UserDetails) authentication.getPrincipal();

        File attachment = null;
        String downloadURl = "";
        attachment = fileService.saveAttachment(file);
        downloadURl = ServletUriComponentsBuilder.fromCurrentContextPath()
                .path("/download/")
                .path(Long.toString(attachment.getId()))
                .toUriString();

        return new FileDTO(attachment.getFileName(),
                downloadURl,
                file.getContentType(),
                file.getSize());
    }*/

    @PostMapping("/upload/{userId}/{articleId}")
    public ResponseEntity<String> uploadFile(@PathVariable Long userId, @PathVariable Long articleId, @RequestParam("file") MultipartFile file) throws Exception {
        Optional<User> user = userRepository.findById(userId);
        Optional<Article> article = articleRepository.findById(articleId);

        if (user.isEmpty()) {
            return new ResponseEntity<>("User doesn't exist.", HttpStatus.BAD_REQUEST);
        }

        if (article.isEmpty()) {
            return new ResponseEntity<>("Article doesn't exist.", HttpStatus.BAD_REQUEST);
        }

        String contentType = file.getContentType();

        if (!Objects.equals(contentType, "application/vnd.openxmlformats-officedocument.wordprocessingml.document") &&
                !Objects.equals(contentType, "application/pdf")) {
            return new ResponseEntity<>("File type is not supported.", HttpStatus.BAD_REQUEST);
        }

        LocalDateTime localDateTime = LocalDateTime.now(ZoneId.of("GMT+01:00"));

        fileService.saveAttachment(file, user.get(), article.get(), localDateTime);

        return new ResponseEntity<>("File uploaded successfully.", HttpStatus.OK);
    }

    @GetMapping("/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws Exception {
        File attachment;
        attachment = fileService.getAttachment(fileId);
        return  ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName()
                                + "\"")
                .body(new ByteArrayResource(attachment.getData()));
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
