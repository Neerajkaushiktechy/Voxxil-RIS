import { useEffect } from "react";
import { useDispatch } from "react-redux";
import ListFormHoc from "../../../utils/listFormHoc";
import List from "./patientList";
import Form from "./form/index";
import { setMainHeading } from "../../../redux/modules/mainHeading/slice";

export default function PatientManagement() {
    const dispatch = useDispatch();
    useEffect(()=>{
        dispatch(setMainHeading("Patient Management"))
    },[dispatch])

    return (
        <>
            <ListFormHoc List={List} Form={Form}></ListFormHoc>
        </>
    );
}
