import { createTheme, ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import {orange, purple, red} from "@mui/material/colors";

const theme = createTheme({
    palette: {
        mode: 'dark',
        primary: orange,
    },
    components: {
        MuiCssBaseline: {
            styleOverrides: {
                html: {
                    width: '100vw',
                    height: '100vh',
                    overflow: 'hidden',
                },
                body: {
                    width: '100vw',
                    height: '100vh',
                    overflowX: 'hidden',
                },
                '#root': {
                    display: 'flex',
                    flexDirection: 'column',
                    width: '100vw',
                    height: '100vh',
                }
            }
        }
    }
});

export default ({ children }) => (
    <ThemeProvider theme={theme}>
        <CssBaseline />
        {children}
    </ThemeProvider>
);
