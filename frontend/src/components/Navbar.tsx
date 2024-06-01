import { CalendarMonth } from "@mui/icons-material"
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material"
import React from "react";

const Navbar = () => {
    const hostedUiURL = "https://meeting-manager.auth.eu-west-1.amazoncognito.com";
    const clientID = '5hv4ev8ff59uqven58ifeddtom';
    const scopes = "email openid phone";
    const redirectUriLogIn = 'http://localhost:5173/redirect';
    const redirectUriSignOut = 'http://localhost:5173/sign-out';

    const isLoggedIn = localStorage.getItem("id_token") != null;
    const buttonOnClick = () => {
        if (!isLoggedIn){
            // If not logged in, follow flow to log in
            const url = new URL(`${hostedUiURL}/login`);
            const queryParams = new URLSearchParams();
            queryParams.append('client_id', clientID);
            queryParams.append('response_type', 'code');
            queryParams.append('scope', scopes);
            queryParams.append('redirect_uri', redirectUriLogIn);
            url.search = queryParams.toString();

            window.location.href = url.toString();
            return;
        }

        // If logged in, follow flow to sign out
        const url = new URL(`${hostedUiURL}/logout`);
        const queryParams = new URLSearchParams();
        queryParams.append('client_id', clientID);
        queryParams.append('logout_uri', redirectUriSignOut);
        url.search = queryParams.toString();

        window.location.href = url.toString();
        return;
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
                    <Button color="inherit" onClick={buttonOnClick}>{`${isLoggedIn ? 'Sign Out' : 'Log In'}`}</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
