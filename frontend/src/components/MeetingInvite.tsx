// Todo, styling please

import { Button, Divider } from '@mui/material';
import { paths } from '../enums/paths.tsx';
import { MeetingInviteType } from '../enums/types.tsx';
import dayjs from 'dayjs';

const MeetingInvite = (props: MeetingInviteType) => {
  const handleMeeting = (isRejected: boolean) => {
    const url = `${paths.apiUrlLocal}/meeting-members/handleRequest`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
      body: JSON.stringify({
        meetingID: props.meetingID,
        status: `${isRejected ? 'rejected' : 'accepted'}`,
      }).toString(),
    };

        fetch(url, options)
            .then(result => result.json()
                .then(asJson => {
                    console.log("response, meeting changed", asJson);
                    props.updateInvites();
                }));
    }

  return (
    <div className="w-full outline-none p-4 text-sm">
      <h1 className="font-semibold text-lg">{props.title}</h1>
      <h2 className="font-thin py-2">{props.description}</h2>
      <p>{dayjs(props.startTime).format('DD-MM-YYYY')}</p>
      <p>
        {dayjs(props.startTime).format('HH:mm')} - {dayjs(props.endTime).format('HH:mm')}
      </p>
      <div className='flex flex-row gap-1 py-2'>
        <Button variant="outlined" size="small" onClick={() => handleMeeting(true)} type="button">
          Reject
        </Button>
        <Button variant="contained" size="small" onClick={() => handleMeeting(false)} type="button">
          Accept
        </Button>
      </div>
      <Divider />
    </div>
  );
};

export default MeetingInvite;
