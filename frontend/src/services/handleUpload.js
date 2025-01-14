import axios from 'axios';

export const handleUpload = async (files, toast, articleId) => {

    if (files.length < 2) {
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Musíte vybrať oba súbory (DOCX a PDF).' });
        return;
    }

    const fileDocx = files.find(file => file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    const filePdf = files.find(file => file.type === 'application/pdf');

    if (!fileDocx || !filePdf) {
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Musíte vybrať platné súbory (DOCX a PDF).' });
        return;
    }

    try {
        const formData = new FormData();
        formData.append('fileDocx', fileDocx);
        formData.append('filePdf', filePdf);

        //const userID = localStorage.getItem("userId");
        //await axios.post(`http://localhost:8080/api/files/upload/${userID}/${articleId}`, formData);


        const jwtToken = localStorage.getItem('jwtToken');
        const config = {
            headers: { Authorization: `Bearer ${jwtToken}` }
        };
        await axios.post(`http://localhost:8080/api/files/upload/${articleId}`, formData, config);

        toast.current.show({ severity: 'success', summary: 'Úspech', detail: 'Úspešne ste nahrali súbory.' });

    } catch (error) {
        console.error("Error during file upload:", error);
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa nahrať súbory.' });
    }
};