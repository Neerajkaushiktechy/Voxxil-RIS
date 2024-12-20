import ListFormHoc from "../../../../utils/listFormHoc";
import List from "./list";
import Form from "./form";
import { useEffect } from "react";
import { setMainHeading } from "../../../../redux/modules/mainHeading/slice";
import { useDispatch } from "react-redux";

export default function Branches() {
    const dispatch = useDispatch();
    useEffect(() => {
        dispatch(setMainHeading("Branches"))
    }, [dispatch])
    return (
        <>
            <ListFormHoc List={List} Form={Form}></ListFormHoc>
        </>
    );
}
