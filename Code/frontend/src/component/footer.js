import { Box, Container, Grid, Typography, Paper } from '@mui/material/';
import { styled } from '@mui/system';
import icon1 from "../../src/assets/images/footer-icon1.png";
import icon2 from "../../src/assets/images/footer-icon2.png";
import { Link } from 'react-router-dom';
const Item = styled(Paper)(({ theme }) => ({
  boxShadow: "unset",
  background: "transparent"
}));

const Footer = () => {
  return (
    <Box sx={{ background: "#E8F7FE", padding: "40px 20px" }}>
      <Container>
        <Grid container spacing={2} alignItems={"center"}>
          <Grid item md={6} sm={12} xs={12}>
            <Item sx={{ textAlign: { md: "left", sm: "center", xs: "center" } }}>
              <Typography variant="h5" sx={{ fontSize: "20px", color: "#052F5D" }}>© Voxxil 2023. All rights reserved.</Typography>
            </Item>
          </Grid>
          <Grid item md={6} sm={12} xs={12}>
            <Item sx={{ textAlign: { md: "end", sm: "center", xs: "center" } }}>
              <Box>
                <Link to="mailto:voxxilgy@gmail.com">
                  <img src={icon1} alt="Voxxil" style={{ marginRight: "20px" }} />
                </Link>
                <Link to="https://www.linkedin.com/company/voxxil/">
                  <img src={icon2} alt="Voxxil"/>
                </Link>
              </Box>
            </Item>
          </Grid>
        </Grid>
      </Container>
    </Box>
  )
}

export default Footer;