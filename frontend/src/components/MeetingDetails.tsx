import { Close } from '@mui/icons-material';
import { Button, Modal } from '@mui/material';
import { MeetingDetailsType } from '../api/types/meeting';
import { cancelMeeting } from '../api/meeting';
import dayjs from 'dayjs';

type MeetingDetailsProps = {
  showModal: boolean;
  meeting: MeetingDetailsType;
  onClose?: () => void;
};

const MeetingDetails = (props: MeetingDetailsProps) => {
  const handleCancel = async () => {
    await cancelMeeting(props.meeting.meetingID);
    props.onClose && props.onClose();
  };

  console.log(props.meeting.isCancelled);

  return (
    <Modal
      open={props.showModal}
      onClose={props.onClose}
      disableAutoFocus
      className="absolute flex items-center justify-center"
    >
      <section className="relative md:w-5/12 w-11/12 h-fit flex flex-col bg-anti-flash-white rounded-3xl p-8 space-y-2 text-base">
        <Close className="absolute right-5 top-5 cursor-pointer" onClick={props.onClose} />
        <h5 className="text-2xl font-thin self-center">Meeting details</h5>
        <h6 className="text-xl py-2">{props.meeting.title}</h6>
        <p>{props.meeting.description}</p>
        <a href="" className="text-sm hover:underline">
          {props.meeting.link}
        </a>
        <p>guests</p>
        <p>{dayjs(props.meeting.startTime).format('DD-MM-YYYY').toString()}</p>

        <div className="self-center pt-4 w-full flex justify-center">
          <Button variant="outlined" onClick={handleCancel}>
            Cancel Meeting
          </Button>
          {/* <Button variant="contained">Update Meeting</Button> */}
        </div>
      </section>
    </Modal>
  );
};

export default MeetingDetails;
