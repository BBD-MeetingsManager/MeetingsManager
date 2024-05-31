import { CalendarMonth } from "@mui/icons-material"
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material"

const Navbar = () => {
    const buttonOnClick = () => {
        const hostedUiURL = "https://meeting-manager.auth.eu-west-1.amazoncognito.com";
        const clientID = '5hv4ev8ff59uqven58ifeddtom';
        const scopes = encodeURI("email openid phone");
        const redirectUri = encodeURIComponent('http://localhost:5173/redirect');
        window.location.href = `${hostedUiURL}/login?client_id=${clientID}&response_type=code&scope=${scopes}&redirect_uri=${redirectUri}`;
    };

    return (
        <Box>
            <AppBar className="absolute top-0">
                <Toolbar>
                    <IconButton
                        size="large"
                        // edge="end"
                        color="inherit"
                        sx={{ mr: 2 }}
                        href="/"
                    >
                        <CalendarMonth />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        Meeting Manager
                    </Typography>
                    <Button color="inherit" onClick={buttonOnClick}>Sign in</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
