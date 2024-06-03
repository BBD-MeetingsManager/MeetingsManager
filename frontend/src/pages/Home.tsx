import { List, ListItemText, Typography } from '@mui/material';
import { CalendarComponent } from '../components/CalendarComponent';
import { paths } from '../enums/paths';
import { format } from 'date-fns';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.tsx';

const Home = () => {
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('id_token')) {
      navigate(paths.landingPage);
      return;
    }
  }, [navigate]);

  const [upcomingMeetings, setUpcomingMeetings] = useState<JSX.Element[]>([]);

  useEffect(() => {
    if (!localStorage.getItem('id_token')) {
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    };

    const url = `${paths.apiUrlLocal}/complex/getMeetings`;
    fetch(url, options).then((result) =>
      result.json().then((meetings) => {
        if (!meetings.hasOwnProperty('alert')) {
          const tmpMeetings = [];
          for (const meeting of meetings) {
            const formattedDate = format(new Date(meeting.startTime), 'yyyy-MM-dd');
            tmpMeetings.push(
              <ListItemText
                key={`upcoming-meeting-${meeting.meetingID}`}
                primary={`${meeting.title}`}
                secondary={
                  <>
                    <Typography
                      sx={{ display: 'inline' }}
                      component="span"
                      variant="body2"
                      color="text.primary"
                    >
                      {formattedDate.toString()}
                    </Typography>
                    {/*Todo, there is proper CSS to do this ellipsis*/}
                    {` — ${meeting.description || ''} ...`}
                  </>
                }
                className="bg-paynes-gray-700/50 rounded-md p-4 shadow-md"
              />
            );
          }

          setUpcomingMeetings(tmpMeetings);
        }
      })
    );
  }, []);

  return (
    <div>
      <Navbar />
      <main className="w-full h-screen pt-16 bg-anti-flash-white">
        <section className="w-full grid grid-cols-2 gap-4 p-8">
          <section className="w-10/12 h-full p-4 bg-paynes-gray-700/30 rounded-xl shadow-xl">
            <h6 className="text-2xl">Upcoming meetings</h6>
            <List className="gap-2">{upcomingMeetings}</List>
          </section>
          <section className="w-full">
            <CalendarComponent />
          </section>
        </section>
      </main>
    </div>
  );
};

export default Home;
