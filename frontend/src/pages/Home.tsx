import { List, ListItemText, Typography } from "@mui/material"
import { CalendarComponent } from "../components/CalendarComponent"

const Home = () => {
    return (
        <main className="w-full pt-16 bg-anti-flash-white">
            <section className="w-full grid grid-cols-2 gap-4 p-8">
                <section className="w-10/12 my-14 p-4 bg-paynes-gray-700/30 rounded-xl">
                    <h6 className="text-2xl">Upcoming meetings</h6>
                    <List className="gap-2">
                        <ListItemText
                            primary="Overview"
                            secondary={
                                <>
                                    <Typography
                                        sx={{ display: 'inline' }}
                                        component="span"
                                        variant="body2"
                                        color="text.primary"
                                    >
                                        02 January 2025
                                    </Typography>
                                    {" — Description of the overview ..."}
                                </>
                            }
                            className="bg-paynes-gray-700/50 rounded-md p-4"
                        />
                    </List>
                </section>
                <section className="w-full">
                    <CalendarComponent />
                </section>
            </section>
        </main>
    )
}

export default Home