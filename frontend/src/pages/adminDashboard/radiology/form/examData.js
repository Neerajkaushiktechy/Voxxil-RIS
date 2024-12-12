import styled from "@emotion/styled";
import { Box, Button, Checkbox, FormControlLabel, FormHelperText, Grid, Paper, Table, TableBody, TableHead, TableRow, Typography, Radio, RadioGroup } from "@mui/material"
import TableCell, { tableCellClasses } from '@mui/material/TableCell';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getExamGroupIdRequest } from "../../../../redux/modules/exam/slice";

const StyledTableCell = styled(TableCell)(({ theme }) => ({
    [`&.${tableCellClasses.head}`]: {
        backgroundColor: theme.palette.primary.main,
        color: theme.palette.common.white,
    },
    [`&.${tableCellClasses.body}`]: {
        fontSize: 14,
    },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
    '&:nth-of-type(odd)': {
        backgroundColor: theme.palette.action.hover,
    },
    '&:last-child td, &:last-child th': {
        border: 0,
    },
}));
const ExamData = ({ errors, setValue, trigger, defaultExam }) => {
    const dispatch = useDispatch();
    let { getGroupIdRes } = useSelector(state => state.exam);
    const [selectedExam, setSelectedExam] = useState([]);
    const [showselectedExamData, setShowselectedExamData] = useState([]);
    let [searchQueryChanged, setSearchQueryChanged] = useState(false);
    let [showBodySide, setShowBodySide] = useState({
        front: true
    });
    const [examObj, setExamObj] = useState({
        Heart: null,
        Stomach: null,
        Liver: null,
        FemourBone: null,
        FibulaBone: null
    });

    useEffect(() => {
        if (defaultExam) {
            let Obj = {};
            const selectedExam = defaultExam.flatMap(elem => {
                Obj[elem?.group?.name] = true;
                return elem.list.map(obj => obj._id);
            });
            setSelectedExam(selectedExam);
            setExamObj(Obj);
            setSearchQueryChanged(true)
            setShowselectedExamData(defaultExam);
        }
    }, [defaultExam]);

    useEffect(() => {
        if (searchQueryChanged) {
            const arrayOfTrueValues = Object.keys(examObj).filter(key => (examObj[key] === true));
            dispatch(getExamGroupIdRequest(arrayOfTrueValues));
        } else {
            setSearchQueryChanged(true);
        }
    }, [dispatch, examObj, searchQueryChanged]);


    const handleExamObj = (event, key) => {
        const newDataArr = JSON.parse(JSON.stringify(showselectedExamData));
        const groupIndex = newDataArr.findIndex(item => item.group.name === key);
        if (groupIndex !== -1 && examObj[key]) {
            newDataArr.splice(groupIndex, 1)
        }

        setShowselectedExamData(newDataArr);
        const selectedExam = newDataArr.flatMap(elem => {
            return elem.list.map(obj => obj._id);
        });

        setSelectedExam(selectedExam)
        setValue("examList", newDataArr);
        trigger("examList")
        setExamObj(preValue => {
            return {
                ...preValue, [key]: !preValue[key]
            }
        });
    };


    const handleSelectedData = (event, selectedObj) => {
        const { checked } = event.target;
        const newDataArr = JSON.parse(JSON.stringify(showselectedExamData));
        const groupIndex = newDataArr.findIndex(item => item.group._id === selectedObj.group._id);
        if (groupIndex === -1 && checked) {
            newDataArr.push({
                group: {
                    _id: selectedObj.group._id,
                    name: selectedObj.group.name,
                },
                list: [selectedObj.elem],
                examListModality:[]
            });
        } else if (groupIndex !== -1) {
            if (checked) {
                newDataArr[groupIndex].list.push(selectedObj.elem);
            } else {
                let filterArr = newDataArr[groupIndex].list.filter(item => item._id !== selectedObj.elem._id)
                let examListModality = newDataArr[groupIndex].examListModality.filter(item => item.examId !== selectedObj.elem._id)
                newDataArr[groupIndex].list = filterArr;
                newDataArr[groupIndex].examListModality = examListModality;
                if (newDataArr[groupIndex].list.length === 0) {
                    newDataArr.splice(groupIndex, 1);
                }
            }
        }

        setShowselectedExamData(newDataArr);
        const selectedExam = newDataArr.flatMap(elem => {
            return elem.list.map(obj => obj._id);
        });
        setSelectedExam(selectedExam)
        setValue("examList", newDataArr);
        trigger("examList")
    };

    
    const handleSelectedModality = async (event, exam, modality, groupId) => {
        const { checked } = event.target;
        const newDataArr = JSON.parse(JSON.stringify(showselectedExamData));
        const groupIndex = newDataArr.findIndex(item => item.group._id === groupId);
        const modalityObj = {
            examId: exam._id,
            examName: exam.name,
            modalityId: modality._id,
            modalityName: modality.term,
            modalityDescription: modality.decription,
        }
        if(groupIndex !== -1) {
            let updatedList = newDataArr[groupIndex].examListModality;

            let existingIndex = updatedList.findIndex(data => data.examId == exam._id);

            if(existingIndex === -1){
                newDataArr[groupIndex].examListModality.push(modalityObj)
            } else {
                newDataArr[groupIndex].examListModality[existingIndex] = modalityObj;
            }
            setShowselectedExamData(newDataArr);
            setValue("examList", newDataArr);
        }
        
    }
    
    const renderModalityList = (modalitiles, group, elem) => {
        const newDataArr = JSON.parse(JSON.stringify(showselectedExamData));
        const groupIndex = newDataArr.findIndex(item => item.group._id === group._id);
        let examListModality = newDataArr[groupIndex]?.examListModality?.map(item => ({modalityId:item.modalityId, examId:item.examId}))
        return(
            <>
            <div>Modality</div>
            <RadioGroup
                aria-labelledby="demo-radio-buttons-group-label"
                defaultValue="female"
                name="radio-buttons-group"
            >
                { modalitiles.map(modality => <FormControlLabel  value={modality.term} control={<Radio 
                    checked={examListModality?.findIndex(mod => mod.modalityId == modality._id && mod.examId == elem._id) !== -1}
                />} label={`${modality.term} (${modality.decription})`}
                    onChange={event => { handleSelectedModality(event, elem, modality, group._id) }}
                />)}
            </RadioGroup>
            </>
        )
    }

    return (
        <Paper sx={{ padding: 2, mt: 3 }} className='cardStyle'>
            <Typography variant="h5" className='title'>Exams <span className="MuiFormLabel-asterisk">*</span></Typography>
            <Grid container spacing={2} className='examination'>
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12} className='bodyPosture' sx={{ textAlign: "center" }}>
                    <Box sx={{ position: "relative", display: "inline-block" }}>
                        <Box position={"relative"} >
                            {showBodySide.front && <img src={require('../../../../assets/images/HumanBodyFront.png')} alt='body posture' />}
                            {showBodySide.back && <img src={require('../../../../assets/images/HumanBodyBack.png')} alt='body posture' />}
                            {showBodySide.side && <img src={require('../../../../assets/images/HumanBodySide.png')} alt='body posture' />}
                            {showBodySide.front &&
                                <>
                                    <Box>
                                        <span className={`${examObj.Heart ? "circle" : "lightCircle"} heart`} aria-describedby={'heart'}
                                            onClick={(e) => { handleExamObj(e, "Heart") }}></span>
                                        {examObj.Heart && <Typography className='heart bodyPartTitle'>Heart and Great Vessels</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Stomach and GI Tract"] ? "circle" : "lightCircle"} stomach`} aria-describedby={'Stomach and GI Tract'}
                                            onClick={(e) => { handleExamObj(e, "Stomach and GI Tract") }}></span>

                                        {examObj["Stomach and GI Tract"] && <Typography className='stomach bodyPartTitle'>Stomach and GI Tract</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj.Abdomen ? "circle" : "lightCircle"} abdomen`} aria-describedby={'abdomen'}
                                            onClick={(e) => { handleExamObj(e, "Abdomen") }}></span>

                                        {examObj.Abdomen && <Typography className='abdomen bodyPartTitle'>Abdomen</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Knee"] ? "circle" : "lightCircle"} kneeLeft`} aria-describedby={'knee Left'}
                                            onClick={(e) => { handleExamObj(e, "Left Knee") }}></span>

                                        {examObj["Left Knee"] && <Typography className='kneeLeft bodyPartTitle'>Left Knee</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Knee"] ? "circle" : "lightCircle"} kneeRight`} aria-describedby={'kneeRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Knee") }}></span>

                                        {examObj["Right Knee"] && <Typography className='kneeRight bodyPartTitle'>Right Knee</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Thigh"] ? "circle" : "lightCircle"} thighLeft`} aria-describedby={'thighLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Thigh") }}></span>

                                        {examObj["Left Thigh"] && <Typography className='thighLeft bodyPartTitle'>Left Thigh</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Thigh"] ? "circle" : "lightCircle"} thighRight`} aria-describedby={'thighRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Thigh") }}></span>

                                        {examObj["Right Thigh"] && <Typography className='thighRight bodyPartTitle'>Right Thigh</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Ankle"] ? "circle" : "lightCircle"} ankleLeft`} aria-describedby={'ankleLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Ankle") }}></span>

                                        {examObj["Left Ankle"] && <Typography className='ankleLeft bodyPartTitle'>Left Ankle</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Ankle"] ? "circle" : "lightCircle"} ankleRight`} aria-describedby={'ankleRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Ankle") }}></span>

                                        {examObj["Right Ankle"] && <Typography className='ankleRight bodyPartTitle'>Right Ankle</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Foot"] ? "circle" : "lightCircle"} footLeft`} aria-describedby={'footLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Foot") }}></span>

                                        {examObj["Left Foot"] && <Typography className='footLeft bodyPartTitle'>Left Foot</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Foot"] ? "circle" : "lightCircle"} footRight`} aria-describedby={'footRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Foot") }}></span>

                                        {examObj["Right Foot"] && <Typography className='footRight bodyPartTitle'>Right Foot</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj.Head ? "circle" : "lightCircle"} head`} aria-describedby={'head'}
                                            onClick={(e) => { handleExamObj(e, "Head") }}></span>

                                        {examObj.Head && <Typography className='head bodyPartTitle'>Head</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj.Face ? "circle" : "lightCircle"} face`} aria-describedby={'face'}
                                            onClick={(e) => { handleExamObj(e, "Face") }}></span>

                                        {examObj.Face && <Typography className='face bodyPartTitle'>Face</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj.Neck ? "circle" : "lightCircle"} neck`} aria-describedby={'neck'}
                                            onClick={(e) => { handleExamObj(e, "Neck") }}></span>

                                        {examObj.Neck && <Typography className='neck bodyPartTitle'>Neck</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj.Chest ? "circle" : "lightCircle"} chest`} aria-describedby={'chest'}
                                            onClick={(e) => { handleExamObj(e, "Chest") }}></span>

                                        {examObj.Chest && <Typography className='chest bodyPartTitle'>Chest</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj.Pelvis ? "circle" : "lightCircle"} pelvis`} aria-describedby={'pelvis'}
                                            onClick={(e) => { handleExamObj(e, "Pelvis") }}></span>

                                        {examObj.Pelvis && <Typography className='pelvis bodyPartTitle'>Pelvis</Typography>}
                                    </Box>
                                </>
                            }
                            {showBodySide.back &&
                                <>
                                    <Box>
                                        <span className={`${examObj["Cervical Spine"] ? "circle" : "lightCircle"} spineCervical`} aria-describedby={'spineCervical'}
                                            onClick={(e) => { handleExamObj(e, "Cervical Spine") }}></span>

                                        {examObj["Cervical Spine"] && <Typography className='spineCervical bodyPartTitle'>Cervical Spine</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Thoracic Spine"] ? "circle" : "lightCircle"} spineThoracic`} aria-describedby={'spineThoracic'}
                                            onClick={(e) => { handleExamObj(e, "Thoracic Spine") }}></span>

                                        {examObj["Thoracic Spine"] && <Typography className='spineThoracic bodyPartTitle'>Thoracic Spine</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Lumbar Spine"] ? "circle" : "lightCircle"} spineLumbar`} aria-describedby={'spineLumbar'}
                                            onClick={(e) => { handleExamObj(e, "Lumbar Spine") }}></span>

                                        {examObj["Lumbar Spine"] && <Typography className='spineLumbar bodyPartTitle'>Lumbar Spine</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Elbow"] ? "circle" : "lightCircle"} elbowLeft`} aria-describedby={'elbowLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Elbow") }}></span>

                                        {examObj["Left Elbow"] && <Typography className='elbowLeft bodyPartTitle'>Left Elbow</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Elbow"] ? "circle" : "lightCircle"} elbowRight`} aria-describedby={'elbowRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Elbow") }}></span>

                                        {examObj["Right Elbow"] && <Typography className='elbowRight bodyPartTitle'>Right Elbow</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Arm"] ? "circle" : "lightCircle"} armLeft`} aria-describedby={'armLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Arm") }}></span>

                                        {examObj["Left Arm"] && <Typography className='armLeft bodyPartTitle'>Left Arm</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Arm"] ? "circle" : "lightCircle"} armRight`} aria-describedby={'armRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Arm") }}></span>

                                        {examObj["Right Arm"] && <Typography className='armRight bodyPartTitle'>Right Arm</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Shoulder"] ? "circle" : "lightCircle"} shoulderLeft`} aria-describedby={'shoulderLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Shoulder") }}></span>

                                        {examObj["Left Shoulder"] && <Typography className='shoulderLeft bodyPartTitle'>Left Shoulder</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Shoulder"] ? "circle" : "lightCircle"} shoulderRight`} aria-describedby={'shoulderRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Shoulder") }}></span>

                                        {examObj["Right Shoulder"] && <Typography className='shoulderRight bodyPartTitle'>Right Shoulder</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Wrist"] ? "circle" : "lightCircle"} wristLeft`} aria-describedby={'wristLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Wrist") }}></span>

                                        {examObj["Left Wrist"] && <Typography className='wristLeft bodyPartTitle'>Left Wrist</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Wrist"] ? "circle" : "lightCircle"} wristRight`} aria-describedby={'wristRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Wrist") }}></span>

                                        {examObj["Right Wrist"] && <Typography className='wristRight bodyPartTitle'>Right Wrist</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Hand"] ? "circle" : "lightCircle"} handLeft`} aria-describedby={'handLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Hand") }}></span>

                                        {examObj["Left Hand"] && <Typography className='handLeft bodyPartTitle'>Left Hand</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Hand"] ? "circle" : "lightCircle"} handRight`} aria-describedby={'handRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Hand") }}></span>

                                        {examObj["Right Hand"] && <Typography className='handRight bodyPartTitle'>Right Hand</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Left Hip"] ? "circle" : "lightCircle"} hipLeft`} aria-describedby={'hipLeft'}
                                            onClick={(e) => { handleExamObj(e, "Left Hip") }}></span>

                                        {examObj["Left Hip"] && <Typography className='hipLeft bodyPartTitle'>Left Hip</Typography>}
                                    </Box>
                                    <Box>
                                        <span className={`${examObj["Right Hip"] ? "circle" : "lightCircle"} hipRight`} aria-describedby={'hipRight'}
                                            onClick={(e) => { handleExamObj(e, "Right Hip") }}></span>

                                        {examObj["Right Hip"] && <Typography className='hipRight bodyPartTitle'>Right Hip</Typography>}
                                    </Box>
                                </>
                            }
                            {showBodySide.side &&
                                <>

                                </>
                            }
                        </Box>
                        <ZoomInIcon sx={{ position: "absolute", top: "20px", right: "26px", width: "30px", height: "30px", color: "secondary.darkGrey" }}></ZoomInIcon>
                        <Box className="bodyPostures">
                            <Button variant="contained" className={showBodySide.front ? "active" : ""} onClick={() => { setShowBodySide({ front: true }); }} sx={{ mr: 2 }}>Anterior</Button>
                            <Button variant="contained" className={showBodySide.back ? "active" : ""} onClick={() => { setShowBodySide({ back: true }); }} sx={{ mr: 2 }}>Poterior</Button>
                            <Button variant="contained" className={showBodySide.side ? "active" : ""} onClick={() => { setShowBodySide({ side: true }); }}>Lateral</Button>
                        </Box>
                    </Box>
                </Grid>
                <Grid item xl={8} lg={8} md={8} sm={12} xs={12} className='examsGrid'>
                    {getGroupIdRes?.data?.length > 0 ?
                        getGroupIdRes?.data?.map(item => (
                            <Paper sx={{ padding: "20px", mb: 3, border: "1px solid #cfcfcf" }} className='cardStyle' key={item._id}>
                                <Typography sx={{ fontSize: "30px", fontWeight: "600", marginBottom: "20px" }}>{item.name}</Typography>
                                <Table className='commonTable'>
                                    <TableHead>
                                        <TableRow>
                                            <StyledTableCell>Tick/Exam</StyledTableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {item?.list?.length > 0 ?
                                            item?.list?.map(elem => (
                                                <StyledTableRow key={elem._id}>
                                                    <StyledTableCell align="left">
                                                        <FormControlLabel control={<Checkbox
                                                            checked={selectedExam.includes(elem._id)}
                                                            onChange={event => { handleSelectedData(event, { group: { name: item.name, _id: item._id }, elem }) }}
                                                        />} label={elem.name} />
                                                        {selectedExam.includes(elem._id) ? renderModalityList(elem.modality, { name: item.name, _id: item._id, examListModality:item }, elem):null}
                                                    </StyledTableCell>
                                                </StyledTableRow>
                                            ))
                                            :
                                            <StyledTableRow>
                                                <StyledTableCell align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                                            </StyledTableRow>
                                        }
                                    </TableBody>
                                </Table>
                            </Paper>
                        ))
                        :
                        <Paper sx={{ padding: 2, mt: 0, border: "1px solid #cfcfcf" }} className='cardStyle' >
                            <Typography>There is no data to show</Typography>
                        </Paper>
                    }
                </Grid>
            </Grid>

            {errors?.examList?.message && <FormHelperText>{errors?.examList?.message}</FormHelperText>}


            <Grid container spacing={2} className='examination'>
                <Grid item xl={12} lg={12} xs={12}>
                    <Box className='cardStyle' sx={{ mt: 2 }}>
                        <Table className='commonTable'>
                            <TableHead>
                                <TableRow>
                                    <StyledTableCell>Tick/Exam</StyledTableCell>
                                    <StyledTableCell>Modality</StyledTableCell>
                                    <StyledTableCell>Group</StyledTableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody >
                                {showselectedExamData?.length > 0 ?
                                    showselectedExamData?.map((item, index) => (
                                        item?.examListModality?.length > 0 &&
                                        item?.examListModality?.map(elem => (
                                            <StyledTableRow key={elem.examId}>
                                                <StyledTableCell align="left">
                                                    <Typography>{elem.examName}</Typography>
                                                    {/* <FormControlLabel control={<Checkbox checked={true} />} label={elem.name} /> */}
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <Typography>{elem.modalityName}({elem.modalityDescription})</Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="left">
                                                    <Typography>{item.group.name}</Typography>
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        ))
                                    ))
                                    :
                                    <StyledTableRow>
                                        <StyledTableCell colSpan={3} align="left"><Typography>There is no data to show</Typography></StyledTableCell>
                                    </StyledTableRow>
                                }
                            </TableBody>
                        </Table>
                    </Box>
                </Grid>
            </Grid>
        </Paper>
    )
}

export default ExamData