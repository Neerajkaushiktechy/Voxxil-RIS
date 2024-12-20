import { useEffect, useState } from "react"
import { useDispatch, useSelector } from "react-redux";
import { getStudiesImagesRequest, resetGetStudiesImages } from "../../../redux/modules/report/slice";
import {  Typography } from "@mui/material";

const ViewImages = ({itemData,setShowComponent,selectedStudy}) => {
    const dispatch = useDispatch();
    let { currentBranch } = useSelector(state => state.branch);
    let { loading, getStudiesImagesRes } = useSelector(state => state.report);
    const [studiesImagesList, setStudiesImagesList] = useState(null);
    
    useEffect(() => {
        if (!currentBranch) { return }
        if(selectedStudy?.ID){
          dispatch(getStudiesImagesRequest(selectedStudy?.ID));
        }
    }, [dispatch, currentBranch,selectedStudy])

    useEffect(() => {
        if (getStudiesImagesRes && getStudiesImagesRes.success) {
            setStudiesImagesList(getStudiesImagesRes.data[0].Instances)
            dispatch(resetGetStudiesImages()) 
        }
    }, [dispatch,getStudiesImagesRes])

  return (
    <div>
        {studiesImagesList && 
          studiesImagesList?.length > 0 ?
          studiesImagesList?.map(elem => (
                <a href={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/stone-webviewer/index.html?study=${selectedStudy.MainDicomTags.StudyInstanceUID}`} target="_blank" rel="noreferrer">
                    <img src={`${process.env.REACT_APP_ORTHANC_SERVER_URL}/instances/${elem}/preview`} alt="" srcset="" />
                </a>
            ))
            :
            <>
            {loading ?
                <Typography>loading...</Typography>
            :
                <Typography>There is no data to show</Typography>
            }
            </>
          }
    </div>
  )
}

export default ViewImages;