const FONT_PRIMARY = "'Founders Grotesk', sans-serif"; 
const typography = {
  fontFamily: FONT_PRIMARY,
  fontWeightRegular: 400,
  fontWeightMedium: 600,
  fontWeightBold: 700,
  h1: {
    fontWeight: 700,
    lineHeight: 80 / 64,
    margin: 0,
    fontSize: "30px",
    '@media (min-width:600px)': {
      fontSize: "40px",
    },
    '@media (min-width:900px)': {
      fontSize: "45px",
    },
    '@media (min-width:1200px)': {
      fontSize: "54px",
    },
  },
  body1: {
    fontWeight: 400,
    fontSize: "20px",
  },
  body2: {
    fontWeight: 400,
    fontSize: "18px",
  },
  sidebarlistitem: {
    fontSize: "22px",
    fontWeight: 600 ,
    lineHeight: "normal",
  },
};
export default typography;