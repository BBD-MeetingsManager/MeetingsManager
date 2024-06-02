// Todo, styling please

import {paths} from "../enums/paths.tsx";
import {MeetingInviteType} from "../enums/types.tsx";

const MeetingInvite = (props: MeetingInviteType) => {
    // console.log("my props", pe)
    const handleMeeting = (isRejected: boolean) => {
        const url = `${paths.apiUrlLocal}/meeting-members/handleRequest`
        const options = {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${localStorage.getItem('id_token')}`,
            },
            body: JSON.stringify({
                meetingID: props.meetingID,
                status: `${isRejected ? 'rejected' : 'accepted'}`,
            }).toString()
        };

        fetch(url.toString(), options)
            .then(result => result.json()
                .then(asJson => {
                    console.log("response, meeting changed", asJson);
                }));
    }

    return (
        <div className="box" style={{border: '1px solid black'}}>
            <h1>{props.title}</h1>
            <h2>{props.description}</h2>
            <p>{`${props.startTime} - ${props.endTime}`}</p>
            <button onClick={() => handleMeeting(true)} type="button">Reject</button>
            <button onClick={() => handleMeeting(false)} type="button">Accept</button>
        </div>
    )
}

export default MeetingInvite
