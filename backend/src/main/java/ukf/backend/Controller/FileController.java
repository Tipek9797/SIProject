package ukf.backend.Controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.ByteArrayResource;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.servlet.support.ServletUriComponentsBuilder;
import ukf.backend.Dto.FileDTO;
import ukf.backend.Model.File.File;
import ukf.backend.Model.File.FileService;

@RestController
public class FileController {

    @Autowired
    private FileService fileService;

    @PostMapping("/api/upload")
    public FileDTO uploadFile(@RequestParam("file") MultipartFile file) throws Exception {
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
    }

    @GetMapping("/api/download/{fileId}")
    public ResponseEntity<Resource> downloadFile(@PathVariable Long fileId) throws Exception {
        File attachment = null;
        attachment = fileService.getAttachment(fileId);
        return  ResponseEntity.ok()
                .contentType(MediaType.parseMediaType(attachment.getFileType()))
                .header(HttpHeaders.CONTENT_DISPOSITION,
                        "attachment; filename=\"" + attachment.getFileName()
                                + "\"")
                .body(new ByteArrayResource(attachment.getData()));
    }
}
