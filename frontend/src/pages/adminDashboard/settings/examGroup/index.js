import ListFormHoc from "../../../../utils/listFormHoc";
import List from "./list";
import Form from "./form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainHeading } from "../../../../redux/modules/mainHeading/slice";

const ExamGroup = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setMainHeading("Exam Group"))
},[dispatch])
  return (
    <>
        <ListFormHoc List={List} Form={Form}></ListFormHoc>
    </>
  )
}

export default ExamGroup;