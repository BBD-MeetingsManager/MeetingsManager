import {paths} from "../enums/paths.tsx";

export const getMeetingDetails = async (meetingID: string) => {
  const result = await fetch(`${paths.apiUrlLocal}/complex/getMeetingDetails?meetingID=${meetingID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`,
    },
  });

  return result.json();
};

export const cancelMeeting = async (meetingID: string) => {
  const result = await fetch(`${paths.apiUrlLocal}/meeting/cancelMeeting`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`,
    },
    body: JSON.stringify({
      meetingID: meetingID,
    }),
  });

  return result.json();
};
