import { CalendarMonth } from "@mui/icons-material"
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from "@mui/material"

const Navbar = () => {
    return (
        <Box>
            <AppBar>
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
                    <Button color="inherit" href="/home">Sign in</Button>
                </Toolbar>
            </AppBar>
        </Box>
    )
}

export default Navbar
