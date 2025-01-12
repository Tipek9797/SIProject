package ukf.backend.Model.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;
import ukf.backend.dtos.FileDTO;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    public File saveAttachment(MultipartFile file, User user, Article article, LocalDateTime uploadDate) throws Exception {
        String fileName = StringUtils.cleanPath(file.getOriginalFilename());
        try {
            if(fileName.contains("..")) {
                throw  new Exception("Filename contains invalid path sequence "
                        + fileName);
            }

            File newFile = new File();
            newFile.setFileName(fileName);
            newFile.setFileType(file.getContentType());
            newFile.setData(file.getBytes());
            newFile.setUser(user);
            newFile.setArticle(article);
            newFile.setUploadDate(uploadDate);
            return fileRepository.save(newFile);

        } catch (Exception e) {
            throw new Exception("Could not save File: " + fileName);
        }
    }

    public File getAttachment(Long fileId) throws Exception {
        return fileRepository
                .findById(fileId)
                .orElseThrow(
                        () -> new Exception("File not found with Id: " + fileId));
    }

    private FileDTO convertToDTO(File file) {
        return new FileDTO(file.getId() ,file.getFileName(), file.getFileType(), file.getUser().getId(), file.getUploadDate());
    }

    private List<FileDTO> convertToDTOs(List<File> files) {
        List<FileDTO> filesDTO = new ArrayList<>();
        for (File file : files) {
            filesDTO.add(convertToDTO(file));
        }
        return filesDTO;
    }

    public List<FileDTO> getAllFiles() {
        List<File> files = fileRepository.findAll();
        return convertToDTOs(files);
    }

    public List<FileDTO> getAllFilesByUser(Long userId) {
        User user = userRepository.findById(userId).orElseThrow();
        List<File> files = fileRepository.findFilesByUser(user).orElseThrow();
        return convertToDTOs(files);
    }
}
