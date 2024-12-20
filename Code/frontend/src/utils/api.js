
export const updatePatientImagingAttachement = async (fileArray, id) => {
    const requestURL = `${process.env.REACT_APP_SERVER_API}api/post-patient-medical-history/${id}`;
    const params = {
        method: "PUT",
        body: fileArray,
        headers: {
            "Authorization": localStorage.getItem("item"),
        }
    };
    try {
        const res = await fetch(requestURL, params);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error, "errrr");
        throw error;
    }
}



export const uploadPatientFiles = async (files,currentBranch, id) => {
    const requestURL = `${process.env.REACT_APP_SERVER_API}api/post-patient-medical-images/${id}`;
    const params = {
        method: "post",
        body: files,
        headers: {
            "Authorization": localStorage.getItem("item"),
            "X-Current-Branch": currentBranch
        }
    };
    try {
        const res = await fetch(requestURL, params);
        const data = await res.json();
        return data;
    } catch (error) {
        console.log(error, "errrr");
        throw error;
    }
}
