import * as React from 'react';
import { Box, Typography, Button, Grid, Paper, Container, FormControl, FormLabel, OutlinedInput, FormHelperText } from '@mui/material/';
import { styled } from '@mui/system';
import { useForm } from 'react-hook-form';
import * as yup from 'yup';
import { yupResolver } from '@hookform/resolvers/yup';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'react-toastify';
import { postRequest, resetPost } from '../../redux/modules/home/slice'
import mainImage from "../../assets/images/main-image.png";
import aboutImage from "../../assets/images/about-us.png";
import abdomen from "../../assets/images/001-abdomen.png";
import urinaryTract from "../../assets/images/002-urinary-tract.png";
import gynaecology from "../../assets/images/003-gynaecology.png";
import headNeck from "../../assets/images/004-head-neck.png";
import mskJoints from "../../assets/images/006-msk-joints.png";
import mskBones from "../../assets/images/007-msk-bones.png";
import paediatrics from "../../assets/images/009-pediatrics.png";
import vessels from "../../assets/images/010-peripheral-vessels.png";
import feature1 from "../../assets/images/feature1.png";
import icon1 from "../../assets/images/icon1.png";
import feature2 from "../../assets/images/feature2.png";
import icon2 from "../../assets/images/icon2.png";
import feature3 from "../../assets/images/feature3.png";
import icon3 from "../../assets/images/icon3.png";
import feature4 from "../../assets/images/feature4.png";
import icon4 from "../../assets/images/icon4.png";

const getValidationSchema = () => {
  return yup.object().shape({
    fullName: yup.string().required('Name is required'),
    email: yup.string().email('Invalid email').required('Email is required'),
    companyName: yup.string(),
  });
};

const Item = styled(Paper)(({ theme }) => ({
  boxShadow: "unset"
}));
const Home = () => {
    const dispatch = useDispatch();
    const validationSchema = getValidationSchema();
    let { loading, postRes } = useSelector(state => state.enquiry);

    const { register, handleSubmit, reset, formState: { errors } } = useForm({
      resolver: yupResolver(validationSchema),
    });

    React.useEffect(() => {
      if (postRes) {
        const {status, message} = postRes;
        toast(message)
        // setTimeout(()=> {
        //   dispatch(resetPost());
        //   reset()
        // }, 20000)
        dispatch(resetPost());
        reset()
      }
    }, [postRes, dispatch])

    const onSubmit = (data) => {
      dispatch(postRequest(data));
    };

  return (
    <>

      {/* main-section */}
      <Box sx={{ marginBottom: "108px", background: "#F6FCFF", paddingTop: "40px" }}>
        <Container>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item md={6} sm={12}>
              <Item sx={{ background: "#F6FCFF" }}>
                <Box sx={{ textAlign: { sm: "left", xs: "center" } }}>
                  <Typography variant="h5" sx={{ fontSize: "20px", color: "#26BAFF", marginBottom: "20px" }}>Voxxil - RIS</Typography>
                  <Typography variant="h1" sx={{ fontSize: { sm: "50px", xs: "30px" }, color: "#052F5D", marginBottom: "30px" }}>Revolutionizing Radiology with Precision and Speed</Typography>
                  <Typography variant="h5" sx={{ fontSize: "22px", color: "#052F5D", marginBottom: "30px" }}>At Voxxil, we're committed to transforming the future of radiology through the unmatched accuracy and efficiency of AI-powered imaging solutions.</Typography>
                  <Button className='commonBtn' variant="contained"> Book an Appointment </Button>
                </Box>
              </Item>
            </Grid>
            <Grid item md={6} xs={12}>
              <Item sx={{ background: "#F6FCFF", marginRight: "-30px" }}>
                <img src={mainImage} alt="Voxxil" className='main-img' />
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* about-us */}
      <Box sx={{ marginBottom: { sm: "108px", xs: "40px" } }}>
        <Container>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item md={6} sm={12} sx={{ position: { sm: "relative" }, order: { md: "unset", xs: "2" } }}>
              <Item sx={{ display: { sm: "block", xs: "none" } }}>
                <img src={aboutImage} alt="Voxxil" className='about-img' />
              </Item>
            </Grid>
            <Grid item md={6} sm={12}>
              <Item>
                <Box sx={{ textAlign: { sm: "left", xs: "center" } }}>
                  <Typography variant="h1" sx={{ fontSize: { sm: "50px", xs: "40px" }, color: "#052F5D", marginBottom: "30px" }}>About Us</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D", marginBottom: "40px" }}>Our dedicated team of experts combines extensive experience in medical technology, radiology, and AI-driven solutions to develop an innovative Radiology Information System (RIS) that transforms how medical institutions and diagnostic centres operate.<br></br><br></br>

                    Our AI-powered RIS streamlines workflows, optimizes efficiency, and enhances the accuracy of diagnostic processes. By integrating cutting-edge AI algorithms into the core of our system, we aim to provide unparalleled precision in chest X-ray validation and comprehensive support in areas such as scheduling, patient analytics, reporting, and billing.<br></br><br></br>

                    Based in the Caribbean, Voxxil is committed to serving medical institutions and diagnostic centers in the region with a scalable, customizable, and affordable solution that meets their unique needs. Our vision is to elevate the quality of patient care and empower healthcare professionals with state-of-the-art technology, driving positive change in the radiology industry.</Typography>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* departments */}
      <Box sx={{ marginBottom: "108px", background: "#E8F7FE", padding: "100px 20px" }}>
        <Container>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { sm: "1px solid #052F5D" }, borderBottom: { xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingBottom: { xs: "20px" } }}>
                  <img src={abdomen} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Abdomen and retroperitoneum</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { md: "1px solid #052F5D", sm: "unset" }, borderBottom: { xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingBottom: { xs: "20px" } }}>
                  <img src={urinaryTract} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Urinary Tract and Male Reproductive System</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { lg: "1px solid #052F5D", md: "unset", sm: "1px solid #052F5D" }, borderBottom: { xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingBottom: { md: "20px", sm: "0", xs: "20px" }, paddingTop: { md: "0", sm: "20px" } }}>
                  <img src={gynaecology} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Gynaecology</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { lg: "unset", md: "1px solid #052F5D" }, borderBottom: { xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingBottom: { lg: "20px", md: "0", sm: "0", xs: "20px" }, paddingTop: { lg: "0", sm: "20px" } }}>
                  <img src={headNeck} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Head and neck</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { sm: "1px solid #052F5D" }, borderBottom: { lg: "unset", xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingTop: "20px", paddingBottom: { sm: "0", xs: "20px" } }}>
                  <img src={mskJoints} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Musculoskeletal Joints and Tendons</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { lg: "1px solid #052F5D", md: "unset" }, borderBottom: { lg: "unset", xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingTop: "20px", paddingBottom: { sm: "0", xs: "20px" } }}>
                  <img src={mskBones} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Musculoskeletal, bone, muscle, nerves and other soft tissues</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { sm: "1px solid #052F5D" }, borderBottom: { sm: "unset", xs: "1px solid #052F5D" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingTop: "20px", paddingBottom: { sm: "0", xs: "20px" } }}>
                  <img src={paediatrics} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Paediatrics</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item lg={3} md={4} sm={6} xs={12} sx={{ borderRight: { lg: "unset", md: "1px solid #052F5D" }, borderBottom: { sm: "unset" } }}>
              <Item sx={{ background: "transparent" }}>
                <Box sx={{ textAlign: "center", paddingTop: "20px" }}>
                  <img src={vessels} alt="Voxxil" style={{ marginBottom: "16px" }} />
                  <Typography className="dept-title" variant="h5" sx={{ fontSize: "22px", color: "#052F5D" }}>Peripheral Vessels</Typography>
                </Box>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* features */}
      <Box sx={{ marginBottom: "108px" }}>
        <Container>
          <Typography variant="h1" sx={{ fontSize: { sm: "50px", xs: "40px" }, color: "#052F5D", marginBottom: { sm: "80px", xs: "40px" }, textAlign: "center" }}>Features</Typography>
          <Grid container spacing={2} alignItems={"center"} sx={{ marginBottom: "80px" }}>
            <Grid item md={6} sm={4} xs={12}>
              <Item>
                <img src={feature1} alt="Voxxil" className='feature-img' />
              </Item>
            </Grid>
            <Grid item md={6} sm={8} xs={12}>
              <Item>
                <Box sx={{ paddingLeft: { sm: "20px", xs: "0" }, textAlign: { sm: "left", xs: "center" } }}>
                  <img src={icon1} alt="Voxxil" style={{ marginBottom: "30px" }} />
                  <Typography variant="h4" sx={{ fontSize: { sm: "30px", xs: "22px" }, fontWeight: "600", color: "#052F5D", marginBottom: { sm: "26px", xs: "18px" } }}>Automated Scheduling & Worklist Creation</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D", marginBottom: "20px" }}>Streamlined Workflow, Unmatched Efficiency</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D" }}>Effortlessly manage appointments and worklists with Voxxil's scheduling system, optimizing your institution's productivity</Typography>
                </Box>
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={"center"} sx={{ marginBottom: "80px" }}>
            <Grid item md={6} sm={8} xs={12} sx={{ position: { xs: "relative" }, order: { sm: "unset", xs: "2" } }}>
              <Item>
                <Box sx={{ paddingRight: { sm: "20px", xs: "0" }, textAlign: { sm: "left", xs: "center" } }}>
                  <img src={icon2} alt="Voxxil" style={{ marginBottom: "30px" }} />
                  <Typography variant="h4" sx={{ fontSize: { sm: "30px", xs: "22px" }, fontWeight: "600", color: "#052F5D", marginBottom: "26px" }}>Patient Analytics & Reporting</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D", marginBottom: "20px" }}>Transforming Data into Insights</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D" }}>Harness the power of advanced analytics to track patient progress, identify trends, and elevate your clinical decision-making</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item md={6} sm={4} xs={12}>
              <Item>
                <img src={feature2} alt="Voxxil" className='feature-img' />
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={"center"} sx={{ marginBottom: "80px" }}>
            <Grid item md={6} sm={4} xs={12}>
              <Item>
                <img src={feature3} alt="Voxxil" className='feature-img' />
              </Item>
            </Grid>
            <Grid item md={6} sm={8} xs={12}>
              <Item>
                <Box sx={{ paddingLeft: { sm: "20px", xs: "0" }, textAlign: { sm: "left", xs: "center" } }}>
                  <img src={icon3} alt="Voxxil" style={{ marginBottom: "30px" }} />
                  <Typography variant="h4" sx={{ fontSize: { sm: "30px", xs: "22px" }, fontWeight: "600", color: "#052F5D", marginBottom: "26px" }}>Seamless Patient Billing</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D", marginBottom: "20px" }}>Simplifying Financial Management</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D" }}>Navigate the complexities of billing with ease, ensuring accuracy and timely processing for a stress-free experience</Typography>
                </Box>
              </Item>
            </Grid>
          </Grid>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item md={6} sm={8} xs={12} sx={{ position: { xs: "relative" }, order: { sm: "unset", xs: "2" } }}>
              <Item>
                <Box sx={{ paddingRight: { sm: "20px", xs: "0" }, textAlign: { sm: "left", xs: "center" } }}>
                  <img src={icon4} alt="Voxxil" style={{ marginBottom: "30px" }} />
                  <Typography variant="h4" sx={{ fontSize: { sm: "30px", xs: "22px" }, fontWeight: "600", color: "#052F5D", marginBottom: "26px" }}>AI-Powered X-ray Intelligence</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D", marginBottom: "20px" }}>Redefining Radiology with Unrivaled Precision</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "18px" }, color: "#052F5D" }}>Experience the future of diagnostics with Voxxil's cutting-edge AI, instantly validating chest X-ray usability and providing a user-friendly DICOM viewer, elevating accuracy to unprecedented levels.</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item md={6} sm={4} xs={12}>
              <Item>
                <img src={feature4} alt="Voxxil" className='feature-img' />
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* contact */}
      <Box sx={{ marginBottom: "108px" }}>
        <Container>
          <Grid container spacing={2} alignItems={"center"}>
            <Grid item md={6} sm={12}>
              <Item>
                <Box sx={{ textAlign: { sm: "left", xs: "center" } }}>
                  <Typography variant="h1" sx={{ fontSize: { sm: "50px", xs: "40px" }, color: "#052F5D", marginBottom: { sm: "30px", xs: "16px" } }}>Get Notified</Typography>
                  <Typography variant="h5" sx={{ fontSize: { sm: "22px", xs: "20px" }, color: "#052F5D", marginBottom: "40px" }}>Stay ahead of the curve! Be the first to know when Voxxil launches – simply enter your email below and we'll occasionally update you with the latest news.</Typography>
                </Box>
              </Item>
            </Grid>
            <Grid item md={6} sm={12}>
              <Item>
                <form onSubmit={handleSubmit(onSubmit)}>
                  <Box sx={{ borderRadius: "16px", background: "#fff", boxShadow: "0px 1px 20px 0px rgba(128, 128, 128, 0.40)", padding: "40px" }}>
                    <Grid container spacing={2}>
                      <Grid item xs={12} mb="20px">
                        <FormControl fullWidth>
                          <FormLabel>Full Name</FormLabel>
                          <OutlinedInput className="inputfield" size='small' placeholder="Enter your name" {...register('fullName')} />
                          {errors?.fullName?.message && <FormHelperText>{errors?.fullName?.message}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} mb="20px">
                        <FormControl fullWidth>
                          <FormLabel>Company Name (Optional)</FormLabel>
                          <OutlinedInput className="inputfield" size='small' placeholder="Enter company name" {...register('companyName')} />
                          
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} mb="30px">
                        <FormControl fullWidth>
                          <FormLabel>Email Address</FormLabel>
                          <OutlinedInput className="inputfield" size='small' placeholder="Enter your email" {...register('email')} />
                          {errors?.email?.message && <FormHelperText>{errors?.email?.message}</FormHelperText>}
                        </FormControl>
                      </Grid>
                      <Grid item xs={12}>
                        <Button type="submit" className='commonBtn' variant="contained" fullWidth disabled={loading}> Subscribe </Button>
                      </Grid>
                    </Grid>
                  </Box>
                </form>
              </Item>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </>
  )
}

export default Home;