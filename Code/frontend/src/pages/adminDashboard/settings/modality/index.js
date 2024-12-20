import ListFormHoc from "../../../../utils/listFormHoc";
import List from "./list";
import Form from "./form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainHeading } from "../../../../redux/modules/mainHeading/slice";

const ModalityList = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setMainHeading("Modality List"))
},[dispatch])

  return (
    <>
        <ListFormHoc List={List} Form={Form}></ListFormHoc>
    </>
  )
}

export default ModalityList;