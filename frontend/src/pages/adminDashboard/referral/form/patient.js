import { Button, Chip, FormHelperText, Grid, Paper, Typography } from "@mui/material"
import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getPatientRequest } from "../../../../redux/modules/radiology/slice";
import SearchPatient from "./searchPatient";
import AddPatient from "./AddPatientDialog";
import searchDebounce from "../../../../utils/searchDebouncing";
import { getPatientDataRequest, resetPatientData } from "../../../../redux/modules/admin/patientProfile/slice";
import moment from "moment";

const Patient = ({ setValue, errors, trigger, defaultPatient, setSelectedPatient, clearErrors }) => {
    const dispatch = useDispatch();
    let { getPatientRes } = useSelector(state => state.radiology);
    let { getPatientDataRes } = useSelector(state => state.patientProfile);
    const [openModal, setOpenModal] = useState(false);
    const [openAddPatientModal, setOpenAddPatientModal] = useState(false);
    const [searchQuery, setSearchQuery] = useState({
        name:'',
        page:1,
        limit:10
    });
    const [selectedPatient, setPatientData] = useState(defaultPatient || {});
    const [page, setPage] = useState(1);
    const [limit, setLimit] = useState(10);
    useEffect(() => {
        if (defaultPatient?._id) {
            setPatientData(defaultPatient);
            dispatch(getPatientDataRequest({ type: "medicalHistory", id: defaultPatient?._id }))
        }
    }, [dispatch, defaultPatient]);

    useEffect(() => {
        if (!getPatientDataRes) { return }
        if (getPatientDataRes?.success && getPatientDataRes?.patientData?.imagingStudies) {
            setPatientData(prevalue => {
                return {
                    ...prevalue,
                    imagingStudies: getPatientDataRes?.patientData?.imagingStudies
                }
            })

        }
        dispatch(resetPatientData());
    }, [dispatch, getPatientDataRes]);



    const performSearch = (query) => {
        dispatch(getPatientRequest(query));
    };
    const debouncedSearch = searchDebounce(performSearch, 300);

    const handleSearchInputChange = (event) => {
        const query = event.target.value;
        const searchQueryData = {
            name:query,
            page:1,
            limit:10
        }
        setPage(1);
        setSearchQuery(searchQueryData);
        debouncedSearch(searchQueryData);
    };

    const handlePageChange = (page) => {
        setPage(page);
        const updatedQueryData = {...searchQuery, page:page};
        setSearchQuery(updatedQueryData);
        debouncedSearch(updatedQueryData);
    }

    const setPatient = (data) => {
        setPatientData(data);
        setSelectedPatient(data);
        setValue('patientId', data._id);
        trigger("patientId")
    }
    return (
        <Paper sx={{ padding: 2 }} className='cardStyle'>
            <Typography variant="h5" className='title'>Patient <span className="MuiFormLabel-asterisk">*</span></Typography>
            {selectedPatient?._id ?
                <>
                    <Grid container spacing={2}>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">First Name </Typography>
                            <Typography>{selectedPatient.fName}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">Last Name </Typography>
                            <Typography>{selectedPatient.lName || "-"}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">Email </Typography>
                            <Typography>{selectedPatient.email || "-"}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">D.O.B </Typography>
                            <Typography>{selectedPatient.dob ? moment.utc(selectedPatient.dob).format('DD-MM-YYYY') : "-"}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">Gender </Typography>
                            <Typography className = {"patient-gender"}>{selectedPatient.gender || "-"}</Typography>
                        </Grid>
                        <Grid item lg={4} md={6} sm={6} xs={12}>
                            <Typography color="text.secondary">Previous X-Rays or Scans </Typography>
                            {selectedPatient?.imagingStudies?.length > 0 ?
                                <div>
                                    {selectedPatient?.imagingStudies?.map((item, index) => (
                                        <Chip key={index} label={item.fileName} />
                                    ))}
                                </div>
                                :
                                "-"
                            }
                        </Grid>
                    </Grid>
                    <Button className="commonBtn" variant="contained" sx={{ mt: 2 }} onClick={() => { setPatient({}); setSelectedPatient({}); clearErrors(); setValue('lmp', 0)}}>Remove Patient</Button>
                </>
                :
                <>
                    <Button className="commonBtn" variant="contained" sx={{ marginRight: "30px", marginBottom: { sm: "0", xs: "10px" } }} onClick={() => { setOpenModal(!openModal); dispatch(getPatientRequest("")); setSearchQuery(""); }}>Select Patient</Button>
                    <Button className="commonBtn" variant="contained" onClick={() => { setOpenAddPatientModal(!openAddPatientModal); }}>Add New Patient</Button>
                </>
            }

            <SearchPatient openModal={openModal} setOpenModal={setOpenModal} searchQuery={searchQuery} handleSearchInputChange={handleSearchInputChange} setPatient={setPatient} getPatientRes={getPatientRes} setOpenAddPatientModal={setOpenAddPatientModal}
                limit={limit}
                page={page}
                setPage = {handlePageChange}
            />
            {openAddPatientModal && <AddPatient openAddPatientModal={openAddPatientModal} setOpenAddPatientModal={setOpenAddPatientModal} setPatient={setPatient} />}

            {errors?.patientId?.message && <FormHelperText>{errors?.patientId?.message}</FormHelperText>}
        </Paper>
    )
}




export default Patient