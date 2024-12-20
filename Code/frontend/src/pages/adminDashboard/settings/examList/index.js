import ListFormHoc from "../../../../utils/listFormHoc";
import List from "./list";
import Form from "./form";
import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { setMainHeading } from "../../../../redux/modules/mainHeading/slice";

const ExamList = () => {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setMainHeading("Exam List"))
},[dispatch])

  return (
    <>
        <ListFormHoc List={List} Form={Form}></ListFormHoc>
    </>
  )
}

export default ExamList;