import {useEffect} from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import { setMainHeading } from '../../../redux/modules/mainHeading/slice';
import { useDispatch } from 'react-redux';
import { Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';


export default function Settings() {
  const dispatch = useDispatch();
  useEffect(()=>{
    dispatch(setMainHeading("Setting"))
},[dispatch])

  return (
    <Grid container spacing={2}>
      <Grid item xs={12}>
        <Card component={Link} to="branches" sx={{ textDecoration: "unset" }}>
          <CardContent sx={{ borderRadius: "4px", background: "#fff", boxShadow: "0px 4px 18px 0px #E2E6FE", marginBottom: "20px", paddingBottom: "16px !important", display: "flex", justifyContent: "space-between", alignItems: "center"}}>
            <Typography sx={{ fontSize: "20px" }}>1) Branches</Typography>
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
        <Card component={Link} to="exam-list" sx={{ textDecoration: "unset" }}>
          <CardContent sx={{ borderRadius: "4px", background: "#fff", boxShadow: "0px 4px 18px 0px #E2E6FE", marginBottom: "20px", paddingBottom: "16px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "20px" }}>2) Exams List</Typography>
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
        <Card component={Link} to="exam-group" sx={{ textDecoration: "unset" }}>
          <CardContent sx={{ borderRadius: "4px", background: "#fff", boxShadow: "0px 4px 18px 0px #E2E6FE", marginBottom: "20px", paddingBottom: "16px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "20px" }}>3) Exams Group</Typography>
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
        <Card component={Link} to="modality-list" sx={{ textDecoration: "unset" }}>
          <CardContent sx={{ borderRadius: "4px", background: "#fff", boxShadow: "0px 4px 18px 0px #E2E6FE", marginBottom: "20px", paddingBottom: "16px !important", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <Typography sx={{ fontSize: "20px" }}>4) Modality List</Typography>
            <ArrowForwardIosIcon />
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
}