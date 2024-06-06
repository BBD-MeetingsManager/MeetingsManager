const BASE_URL = 'http://ec2-34-248-128-133.eu-west-1.compute.amazonaws.com:8080';

export const getMeetingDetails = async (meetingID: string) => {
  const result = await fetch(`${BASE_URL}/complex/getMeetingDetails?meetingID=${meetingID}`, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${localStorage.getItem('id_token')}`,
    },
  });

  return result.json();
};

export const cancelMeeting = async (meetingID: string) => {
  const result = await fetch(`${BASE_URL}/meeting/cancelMeeting`, {
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
