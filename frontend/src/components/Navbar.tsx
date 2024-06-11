import {CalendarMonth, Groups, Menu} from '@mui/icons-material';
import { Box, AppBar, Toolbar, IconButton, Typography, Button } from '@mui/material';
import React, { useEffect, useState } from 'react';
import './Navbar.css';
import MeetingInvite from './MeetingInvite.tsx';
import { paths } from '../enums/paths.tsx';
import NavbarUser from './NavbarUser.tsx';
import { NavbarProps } from '../enums/types.tsx';

const Navbar = (props: NavbarProps) => {
    const [getMeetingInvitesCount, setGetMeetingInvitesCount] = useState<number>(0);

  const hostedUiURL = 'https://meeting-manager.auth.eu-west-1.amazoncognito.com';
  const clientID = '5hv4ev8ff59uqven58ifeddtom';
  const scopes = 'email openid phone';

  const isLoggedIn = localStorage.getItem('id_token') != null;

  const buttonOnClick = () => {
    if (!isLoggedIn) {
      // If not logged in, follow flow to log in
      const url = new URL(`${hostedUiURL}/login`);
      const queryParams = new URLSearchParams();
      queryParams.append('client_id', clientID);
      queryParams.append('response_type', 'code');
      queryParams.append('scope', scopes);
      queryParams.append('redirect_uri', `${window.location.origin}${paths.redirect}`);
      url.search = queryParams.toString();

      window.location.href = url.toString();
      return;
    }

    // If logged in, follow flow to sign out
    const url = new URL(`${hostedUiURL}/logout`);
    const queryParams = new URLSearchParams();
    queryParams.append('client_id', clientID);
    queryParams.append('logout_uri', `${window.location.origin}${paths.signOut}`);
    url.search = queryParams.toString();

    window.location.href = url.toString();
    return;
  };

  const [meetingInvites, setMeetingInvites] = React.useState<JSX.Element[]>([]);
  const [showMenu, setShowMenu] = useState<boolean>(false);

  const handleMenuClick = () => {
    setShowMenu(!showMenu);
  };

  useEffect(() => {
    if (!isLoggedIn) {
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    };

    const url = `${paths.apiUrlLocal}/complex/pendingMeetings`;
    fetch(url, options).then((result) =>
      result.json().then((meetings) => {
        const tmpMeetings = [];

        if (!meetings.hasOwnProperty('alert')) {
          for (const meeting of meetings) {
            tmpMeetings.push(
              <MeetingInvite
                key={meeting.title}
                meetingID={meeting.meetingID}
                title={meeting.title}
                description={meeting.description}
                startTime={meeting.startTime}
                endTime={meeting.endTime}
                updateInvites={() => {
                  console.log('called update invite');
                  setGetMeetingInvitesCount((prevState) => prevState + 1);
                  props.updateStateFunction();
                }}
              />
            );
          }
        }

        setMeetingInvites(tmpMeetings);
      })
    );
  }, [getMeetingInvitesCount]);

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

          <div className="md:flex hidden flex-row">
            {isLoggedIn && (
              <section className="flex flex-row gap-4 items-center justify-end ">
                <NavbarUser />
                <div className="dropdown">
                  <Button
                      className="dropbtn"
                      color="inherit"
                      endIcon={<Groups />}
                  >
                    {`Meeting Invites`}
                  </Button>
                  <div className="dropdown-content text-charcoal-100">{meetingInvites}</div>
                </div>
              </section>
            )}
            <Button
              color="inherit"
              onClick={buttonOnClick}
            >{`${isLoggedIn ? 'Sign Out' : 'Log In'}`}</Button>
          </div>
          <div className="md:hidden flex flex-col text-charcoal-100">
            <Menu onClick={handleMenuClick} color="action" />
            {showMenu && (
              <div className="absolute bg-mint_cream rounded-md top-16 right-0 flex flex-col">
                {isLoggedIn && (
                  <section className="flex flex-col items-center justify-end ">
                    <NavbarUser />
                    <div className="dropdown">
                      <button className="dropbtn">Meeting Invites</button>
                      <div className="dropdown-content text-charcoal-100">{meetingInvites}</div>
                    </div>
                  </section>
                )}
                <Button
                  color="inherit"
                  onClick={buttonOnClick}
                >{`${isLoggedIn ? 'Sign Out' : 'Log In'}`}</Button>
              </div>
            )}
          </div>
        </Toolbar>
      </AppBar>
    </Box>
  );
};

export default Navbar;
