import { createTheme, ThemeProvider, StyledEngineProvider } from "@mui/material/styles";
import palette from "./palette";
import typography from "./typography";


export default function CustomTheme({ children }) {
   const theme= createTheme({
      palette,
      typography
   });

   return (
      <StyledEngineProvider injectFirst>
         <ThemeProvider theme={theme}>{children}</ThemeProvider>
      </StyledEngineProvider>
   );
}