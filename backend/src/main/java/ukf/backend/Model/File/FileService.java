package ukf.backend.Model.File;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;
import ukf.backend.dtos.FileDTO;
import ukf.backend.Model.Article.Article;
import ukf.backend.Model.User.User;
import ukf.backend.Model.User.UserRepository;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;
import java.util.zip.ZipEntry;
import java.util.zip.ZipOutputStream;

@Service
public class FileService {

    @Autowired
    private FileRepository fileRepository;

    @Autowired
    private UserRepository userRepository;

    public File saveAttachments(MultipartFile fileDocx, MultipartFile filePdf, User user, Article article, LocalDateTime uploadDate) throws Exception {
        String fileNameDocx = fileDocx.getOriginalFilename();
        String fileNamePdf = filePdf.getOriginalFilename();
        String fileTypeDocx = fileDocx.getContentType();
        String fileTypePdf = filePdf.getContentType();
        byte[] dataDocx = fileDocx.getBytes();
        byte[] dataPdf = filePdf.getBytes();

        File newFile = new File();
        newFile.setFileNameDocx(fileNameDocx);
        newFile.setFileTypeDocx(fileTypeDocx);
        newFile.setDataDocx(dataDocx);
        newFile.setFileNamePdf(fileNamePdf);
        newFile.setFileTypePdf(fileTypePdf);
        newFile.setDataPdf(dataPdf);
        newFile.setUser(user);
        newFile.setArticle(article);
        newFile.setUploadDate(uploadDate);

        return fileRepository.save(newFile);
    }

    public File getAttachment(Long fileId) throws Exception {
        return fileRepository
                .findById(fileId)
                .orElseThrow(
                        () -> new Exception("File not found with Id: " + fileId));
    }

    private FileDTO convertToDTO(File file) {
        return new FileDTO(
                file.getId(),
                file.getFileNameDocx(),
                file.getFileTypeDocx(),
                file.getFileNamePdf(),
                file.getFileTypePdf(),
                file.getUser().getId(),
                file.getUploadDate()
        );
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

    public byte[] createZipWithMostRecentFiles(List<Article> articles) throws IOException {
        ByteArrayOutputStream baos = new ByteArrayOutputStream();
        ZipOutputStream zos = new ZipOutputStream(baos);
        Set<String> fileNames = new HashSet<>();

        for (Article article : articles) {
            File mostRecentFile = fileRepository.findTopByArticleOrderByUploadDateDesc(article);
            if (mostRecentFile != null) {
                addFileToZip(zos, mostRecentFile.getFileNameDocx(), mostRecentFile.getDataDocx(), fileNames);
                addFileToZip(zos, mostRecentFile.getFileNamePdf(), mostRecentFile.getDataPdf(), fileNames);
            }
        }

        zos.close();
        return baos.toByteArray();
    }

    private void addFileToZip(ZipOutputStream zos, String fileName, byte[] data, Set<String> fileNames) throws IOException {
        if (data != null && fileName != null) {
            String uniqueFileName = fileName;
            int counter = 1;
            while (fileNames.contains(uniqueFileName)) {
                uniqueFileName = fileName.replaceFirst("(\\.[^.]*)?$", "_" + counter++ + "$1");
            }
            fileNames.add(uniqueFileName);

            ZipEntry entry = new ZipEntry(uniqueFileName);
            zos.putNextEntry(entry);
            zos.write(data);
            zos.closeEntry();
        }
    }
}
