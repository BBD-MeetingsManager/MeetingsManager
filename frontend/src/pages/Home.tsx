import { List, ListItemText, Typography } from "@mui/material"
import { CalendarComponent } from "../components/CalendarComponent"
import { dummyMeetings } from "../dummyData"
import dayjs from "dayjs"

const Home = () => {
    return (
        <main className="w-full h-screen pt-16 bg-anti-flash-white">
            <section className="w-full grid grid-cols-2 gap-4 p-8">
                <section className="w-10/12 h-full p-4 bg-paynes-gray-700/30 rounded-xl shadow-xl">
                    <h6 className="text-2xl">Upcoming meetings</h6>
                    <List className="gap-2">

                        { // n.sort((a, b) => (dayjs(a).isAfter(dayjs(b)) ? 1 : -1))
                            dummyMeetings.sort((a, b) => dayjs(a.date).isAfter(dayjs(b.date)) ? 1 : -1).map((meeting) => (
                                <ListItemText
                                    primary={`${meeting.title}`}
                                    secondary={
                                        <>
                                            <Typography
                                                sx={{ display: 'inline' }}
                                                component="span"
                                                variant="body2"
                                                color="text.primary"
                                            >
                                                {meeting.date}
                                            </Typography>
                                            {` — ${meeting.description} ...`}
                                        </>
                                    }
                                    className="bg-paynes-gray-700/50 rounded-md p-4 shadow-md"
                                />
                            ))}

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