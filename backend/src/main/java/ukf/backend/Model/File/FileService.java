package ukf.backend.Model.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.util.StringUtils;
import org.springframework.web.multipart.MultipartFile;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    public File saveAttachment(MultipartFile file) throws Exception {
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
}
