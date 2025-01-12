import axios from 'axios';

export const handleUpload = async (files, toast, articleId) => {
    console.log(files);

    if (files.length === 0) {
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nevybrali ste žiaden súbor.' });
        return;
    }

    try {
        const formData = new FormData();
        formData.append('file', files[0]);

        const userID = localStorage.getItem("userId");
        await axios.post(`http://localhost:8080/api/files/upload/${userID}/${articleId}`, formData);
        console.log("Uploading file " + files);

        toast.current.show({ severity: 'success', summary: 'Úspech', detail: 'Úspešne ste nahrali súbor.' });

    } catch (error) {
        console.error("Error during file upload:", error);
        toast.current.show({ severity: 'error', summary: 'Chyba', detail: 'Nepodarilo sa nahrať súbor.' });
    }
};