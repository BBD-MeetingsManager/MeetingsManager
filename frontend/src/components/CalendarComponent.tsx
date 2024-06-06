import React, { useEffect, useState, MouseEvent } from 'react';
import dayjs, { Dayjs } from 'dayjs';
import { AddBox, ExpandLess, ExpandMore } from '@mui/icons-material';
import { generateCalendar } from '../utils/calendar';
import {
  // Autocomplete,
  Button,
  CircularProgress,
  FormGroup,
  Modal,
  Stack,
  TextField,
} from '@mui/material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider, TimePicker, renderTimeViewClock } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { FieldArray, Formik, useFormik } from 'formik';
import * as yup from 'yup';
import 'dayjs/locale/en-gb';
import { paths } from '../enums/paths.tsx';
import { format } from 'date-fns';
import { CalendarComponentProps, UserMeeting } from '../enums/types.tsx';
import MeetingDetails from './MeetingDetails.tsx';
import { getMeetingDetails } from '../api/meeting.ts';
import { MeetingDetailsType } from '../api/types/meeting.ts';
import ToastComponent from './ToastComponent.tsx';

const monthsMap = new Map<number, string>([
  [0, 'JANUARY'],
  [1, 'FEBRUARY'],
  [2, 'MARCH'],
  [3, 'APRIL'],
  [4, 'MAY'],
  [5, 'JUNE'],
  [6, 'JULY'],
  [7, 'AUGUST'],
  [8, 'SEPTEMBER'],
  [9, 'OCTOBER'],
  [10, 'NOVEMBER'],
  [11, 'DECEMBER'],
]);

type FormDataType = {
  title: string;
  description: string;
  link: string;
  members: [string];
  date: Dayjs;
  from: Dayjs;
  to: Dayjs;
};

const validationSchema = yup.object({
  title: yup.string().max(50).required('This field is required'),
  description: yup.string().max(500).required('This field is required'),
  link: yup.string().max(500).required('This field is required'),
  // Todo, add this validation back
  // members: yup.string().max(50).email('Enter the email of the guest').required('This field is required')
});

export const CalendarComponent = (props: CalendarComponentProps) => {
  const daysOfTheWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const currentDate: Dayjs = dayjs();

  const [today, setToday] = useState<Dayjs>(currentDate);
  const [selected, setSelected] = useState<Dayjs>();
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [showMeetingDetailsModal, setShowMeetingDetailsModal] = useState<boolean>(false);
  const [meetingDetails, setMeetingDetails] = useState<MeetingDetailsType>();
  const [showToast, setShowToast] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string>('');
  const [showLoader, setShowLoader] = useState<boolean>(false);
  const [getFriendsCount, setGetFriendsCount] = useState<number>(0);
  const [getUpcomingMeetingsCount, setGetUpcomingMeetingsCount] = useState<number>(0);

  React.useEffect(() => {
    console.log('caught on calendar');
    setGetUpcomingMeetingsCount((prevState) => prevState + 1);
  }, [props.updateTrigger]);

  const [upcomingMeetings, setUpcomingMeetings] = useState<JSX.Element[]>();

  useEffect(() => {
    if (!localStorage.getItem('id_token')) {
      return;
    }

    setShowLoader(true);
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    };

    const url = `${paths.apiUrlLocal}/complex/getMeetings`;
    fetch(url, options).then((result) =>
      result.json().then((meetings) => {
        const calendarMeetings = generateCalendar(today.month(), today.year()).map(
          (dateObject, index) => {
            const { date, isToday, isCurrentMonth } = dateObject;
            return (
              <section
                key={index}
                className={`${isCurrentMonth ? '' : 'text-charcoal-800'} ${isToday ? 'bg-princeton_orange/90 text-mint_cream-800' : ''} ${selected?.toDate().toDateString() === date.toDate().toDateString() ? 'bg-charcoal-900 text-night' : ''} h-16 text-sm flex flex-row border border-charcoal-900 px-2 py-1 cursor-pointer hover:bg-charcoal-900 hover:text-night transition-all overflow-hidden`}
                onClick={() => {
                  handleCardClick(date);
                }}
              >
                <p className="h-full w-3/12">{date.date()}</p>
                <section className="w-9/12 space-y-1">
                  {Array.isArray(meetings) &&
                    meetings
                      .filter(
                        (meeting: UserMeeting) =>
                          format(new Date(meeting.startTime), 'dd-MM-yyyy') ===
                          format(date.toDate(), 'dd-MM-yyyy')
                      )
                      .map((meeting: UserMeeting, index: Number) => (
                        <p
                          key={`${index}`}
                          className="text-[0.5rem] text-night truncate bg-charcoal-700/50 rounded-md px-2 hover:scale-105 z-10"
                          onClick={(event: MouseEvent<HTMLElement>) =>
                            handleMeetingClickInCalendar(event, meeting.meetingID)
                          }
                        >
                          • {meeting.title}
                        </p>
                      ))}
                </section>
              </section>
            );
          }
        );

        setUpcomingMeetings(calendarMeetings);
      })
    );
  }, [today, getUpcomingMeetingsCount]);

  useEffect(() => {
    setShowLoader(false);
  }, [upcomingMeetings]);

  const [userFriends, setUserFriends] = useState<string[]>([]);

  React.useEffect(() => {
    if (!localStorage.getItem('id_token')) {
      return;
    }

    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
    };

    const url = `${paths.apiUrlLocal}/complex/getFriendsForUser`;
    fetch(url, options).then((result) =>
      result.json().then((friends) => {
        const tmpFriends = [];

        if (Array.isArray(friends)) {
          for (const friend of friends) {
            tmpFriends.push(friend.email);
          }
        }

        setUserFriends(tmpFriends);
      })
    );
  }, [getFriendsCount]);

  const mergeDateTime = (date: Dayjs, time: Dayjs) => {
    const [year, month, day] = format(new Date(date.toDate()), 'yyyy-MM-dd')
      .toString()
      .split('-')
      .map((numStr) => parseInt(numStr, 10));
    const [hours, minutes, seconds] = format(new Date(time.toDate()), 'HH:mm:ss')
      .toString()
      .split(':')
      .map((numStr) => parseInt(numStr, 10));

    return format(
      new Date(year, month - 1, day, hours, minutes, seconds).toString(),
      'yyyy-MM-dd HH:mm:ss'
    );
  };

  const handleCardClick = (date: Dayjs) => {
    setSelected(date);
    handleOpen();
    setModalOpen(true);
  };

  const handleMeetingClickInCalendar = async (
    event: MouseEvent<HTMLElement>,
    meetingId: string
  ) => {
    if (event && event.stopPropagation) event.stopPropagation();

    const result = await getMeetingDetails(meetingId);

    setMeetingDetails(result[0]);
    setShowMeetingDetailsModal(true);
  };

  const formik = useFormik<FormDataType>({
    initialValues: {
      title: '',
      description: '',
      link: '',
      members: [''],
      date: selected!,
      from: dayjs(),
      to: dayjs().add(1, 'hour'),
    },
    validationSchema: validationSchema,
    onSubmit: (values: any) => {
      values.members = values.members.filter((guest: string) => guest !== '');
      const url = `${paths.apiUrlLocal}/complex/createMeeting`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('id_token')}`,
        },
        body: JSON.stringify({
          title: values.title,
          description: values.description,
          link: values.link,
          startTime: mergeDateTime(values.date, values.from),
          endTime: mergeDateTime(values.date, values.to),
          members: values.members,
        }).toString(),
      };

      fetch(url.toString(), options).then((result) =>
        result.json().then((asJson) => {
          handleClose();
          setGetUpcomingMeetingsCount((prevState) => prevState + 1);
        })
      );

      setShowToast(true);
      setToastMessage('Meeting added successfully.');
    },
  });

  const handleOpen = () => {
    setGetFriendsCount((prevState) => prevState + 1);
    setModalOpen(true);
  };

  const handleClose = () => {
    formik.resetForm();
    setModalOpen(false);
  };

  useEffect(() => {
    formik.setFieldValue('date', selected, true);
  }, [selected]);

  // @ts-ignore
  return (
    <article>
      <section className="flex justify-between items-center p-4 text-sm font-thin border border-charcoal-900">
        <p>
          {monthsMap.get(today.month())}, {today.year()}
        </p>
        <div className="flex items-center gap-2">
          <ExpandMore
            className="rotate-90 cursor-pointer"
            onClick={() => {
              setToday(today.month(today.month() - 1));
            }}
          />
          <p
            className="cursor-pointer text-sm font-thin"
            onClick={() => {
              setToday(currentDate);
            }}
          >
            TODAY
          </p>
          <ExpandLess
            className="rotate-90 cursor-pointer"
            onClick={() => {
              setToday(today.month(today.month() + 1));
            }}
          />
        </div>
      </section>
      <section className="w-full grid grid-cols-7">
        {daysOfTheWeek.map((day, index) => (
          <section
            key={index}
            className="h-16 border border-charcoal-900 text-sm font-semibold text-center pt-2 shadow-bottom-border"
          >
            <p>{day}</p>
          </section>
        ))}
      </section>
      <section className="w-full grid grid-cols-7 shadow-xl">
        {upcomingMeetings}
        <Modal
          open={showLoader || !upcomingMeetings}
          disableAutoFocus
          className="absolute flex justify-center items-center"
        >
          <CircularProgress />
        </Modal>
      </section>

      <Modal
        open={modalOpen}
        onClose={handleClose}
        disableAutoFocus
        className="absolute flex items-center justify-center"
      >
        <FormGroup className="flex lg:w-6/12 md:w-8/12 w-11/12 max-h-[80vh] overflow-hidden items-center bg-mint_cream py-8 rounded-3xl">
          <LocalizationProvider adapterLocale="en-gb" dateAdapter={AdapterDayjs}>
            <section className="w-full flex justify-center px-4 overflow-y-auto">
              <form onSubmit={formik.handleSubmit} className="md:w-8/12 w-full justify-center">
                <h3 className="text-3xl flex justify-center">Add a meeting</h3>
                <Stack direction={'column'} className="flex flex-col gap-4 p-8">
                  <TextField
                    autoComplete={'off'}
                    label="Title"
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.title && Boolean(formik.errors.title)}
                    helperText={formik.touched.title && formik.errors.title}
                    required
                  />
                  <TextField
                    autoComplete={'off'}
                    label="Description"
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.description && Boolean(formik.errors.description)}
                    helperText={formik.touched.description && formik.errors.description}
                  />
                  <TextField
                    autoComplete={'off'}
                    label="Link"
                    name="link"
                    value={formik.values.link}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    error={formik.touched.link && Boolean(formik.errors.link)}
                    helperText={formik.touched.link && formik.errors.link}
                    required
                  />

                  <Formik initialValues={formik.initialValues} onSubmit={() => {}}>
                    {({ values }) => (
                      // @ts-ignore
                      <FieldArray name="members" value={formik.values.members}>
                        {({ push, remove }) => (
                          <>
                            {values.members.map((guest, index) => (
                              <div key={`guest-${index}`}>
                                <div key={index} className="flex flex-row">
                                  <TextField
                                    autoComplete={'off'}
                                    label="guest"
                                    name={`members.${index}`}
                                    type="email"
                                    value={formik.values.members[index]}
                                    onChange={(e) => {
                                      const updatedMembers = [...formik.values.members];
                                      updatedMembers[index] = e.target.value;
                                      formik.setFieldValue('members', updatedMembers);
                                    }}
                                  />
                                  <datalist id="friendOptions">{userFriends}</datalist>

                                  {/* <Autocomplete
                                  value={formik.values.members[index]}
                                  options={userFriends}
                                  renderInput={(params) => (
                                    <TextField
                                      {...params}
                                      label="guest"
                                      name={`members.${index}`}
                                      type="email"
                                      onChange={(e) => {
                                        const updatedMembers = [...formik.values.members];
                                        updatedMembers[index] = e.target.value;
                                        formik.setFieldValue('members', updatedMembers);
                                      }}
                                    />
                                  )}
                                /> */}

                                  <datalist id="friendOptions">{userFriends}</datalist>

                                  <Button
                                    type="button"
                                    onClick={() => {
                                      formik.values.members.splice(index);
                                      remove(index);
                                    }}
                                  >
                                    Remove
                                  </Button>
                                </div>

                                <Button
                                  type="button"
                                  onClick={() => {
                                    formik.values.members.push(guest);
                                    push('');
                                  }}
                                >
                                  Add Guest
                                </Button>
                              </div>
                            ))}
                          </>
                        )}
                      </FieldArray>
                    )}
                  </Formik>

                  <DatePicker
                    label="Date"
                    name="date"
                    value={formik.values.date ? formik.values.date : dayjs()}
                    onChange={(value) => formik.setFieldValue('date', value, true)}
                  />

                  <TimePicker
                    label="From"
                    name="from"
                    value={formik.values.from || dayjs()}
                    onChange={(value) => formik.setFieldValue('from', value, true)}
                    timezone={'system'}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                    }}
                  />
                  <TimePicker
                    label="To"
                    name="to"
                    value={formik.values.to || dayjs()}
                    onChange={(value) => formik.setFieldValue('to', value, true)}
                    timezone={'system'}
                    viewRenderers={{
                      hours: renderTimeViewClock,
                      minutes: renderTimeViewClock,
                    }}
                  />
                </Stack>
                <Stack direction={'row'} className="w-full flex justify-between gap-2 px-8 pb-8">
                  <Button variant={'outlined'} onClick={handleClose} className="w-full">
                    Cancel
                  </Button>
                  <Button
                    variant={'contained'}
                    type="submit"
                    endIcon={<AddBox />}
                    className="w-full"
                  >
                    Add
                  </Button>
                </Stack>
              </form>
            </section>
          </LocalizationProvider>
        </FormGroup>
      </Modal>

      {meetingDetails && (
        <MeetingDetails
          showModal={showMeetingDetailsModal}
          onClose={() => setShowMeetingDetailsModal(false)}
          meeting={meetingDetails}
        />
      )}
      <ToastComponent
        message={toastMessage}
        open={showToast}
        onClose={() => {
          setShowToast(false);
        }}
      />
    </article>
  );
};
