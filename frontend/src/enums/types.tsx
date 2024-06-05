export interface UserMeeting {
    meetingID: string,
    title: string,
    description: string,
    link: string,
    startTime: string,
    endTime: string,
    isCancelled: boolean
}

export interface MeetingInviteType {
    meetingID: string,
    title: string,
    description: string,
    startTime: string,
    endTime: string,
    updateInvites: () => void
}