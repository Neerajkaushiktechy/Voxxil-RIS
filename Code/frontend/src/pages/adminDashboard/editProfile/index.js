import ListFormHoc from "../../../utils/listFormHoc";
import ViewProfile from "./viewProfile";
import Form from "./form";
import PatientForm from '../patient-management/form';
import { useSelector } from "react-redux";
import { USER_ROLE_DEFAULT } from "../../../constants/Constant";

const EditProfile = () => {
  const { userData } = useSelector(state => state.auth);
  const isPatient = userData.role === USER_ROLE_DEFAULT.PATIENT;
  return (
    <>
      <ListFormHoc showBtn={false} List={ViewProfile} Form={isPatient ? PatientForm : Form}></ListFormHoc>
    </>
  )
}

export default EditProfile; 