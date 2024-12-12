import { red } from '@mui/material/colors';

const PRIMARY = {
  light: '#F6FCFF',
  main: '#69CBF9',
  dark: '#052F5D',
  extralight: "#F2F2F2",
};
const SECONDARY = {
  main: '#f5f5f5',
  dark: "#BABABA",
  light: "#ffffff",
};
const BUTTONCOLOR = {
  main: '#26BAFF',
};

const INPUTBG = {
  main: '#F5F7F9',
}
const ERROR = {
  main: red[500]
}


const COMMON = {
  primary: { ...PRIMARY, contrastText: '#fff' },
  secondary: { ...SECONDARY, contrastText: '#052F5D' },
  btncolor: { ...BUTTONCOLOR },
  inputbg: { ...INPUTBG },
  error: {...ERROR},

};

const palette = {
  ...COMMON,
  mode: 'light',
  text: {
    primary: "#052F5D",
    secondary: "#797878",
    titleColor:"#383838"
  },
};

export default palette;
