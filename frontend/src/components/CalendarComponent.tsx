
import { useEffect, useState, MouseEvent } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AddBox, ExpandLess, ExpandMore } from "@mui/icons-material";
import { generateCalendar } from "../utils/calendar";
import { Box, Button, FormGroup, Modal, Stack, Tab, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider, TimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useFormik } from "formik";
import * as yup from 'yup';
import 'dayjs/locale/en-gb'
import { TabContext, TabList } from "@mui/lab";
import { dummyMeetings } from "../dummyData";

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
    guests: string;
    date: Dayjs;
    from: Dayjs;
    to: Dayjs;
}

const validationSchema = yup.object({
    title: yup.string().max(50).required('This field is required'),
    description: yup.string().max(500).required('This field is required'),
    guests: yup.string().max(50).email('Enter the email of the guest').required('This field is required')
})

export const CalendarComponent = () => {
    const daysOfTheWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate: Dayjs = dayjs();

    const [today, setToday] = useState<Dayjs>(currentDate);
    const [selected, setSelected] = useState<Dayjs>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);
    const [tabValue, setTabValue] = useState<string>('3');


    const handleCardClick = (date: Dayjs) => {
        setSelected(date);
        setModalOpen(true);
    }
    const handleClose = () => {
        setModalOpen(false);
    }

    const handleTabChange = (_event: React.SyntheticEvent, newTabValue: string) => {
        setTabValue(newTabValue);
    };

    const handleMeetingClickInCalendar = (e: MouseEvent<HTMLElement>) => {
        if (e && e.stopPropagation) e.stopPropagation();

        console.log('go to the meeting');

    }

    const formik = useFormik<FormDataType>({
        initialValues: {
            title: '',
            description: '',
            guests: '',
            date: selected!,
            from: dayjs(),
            to: dayjs().add(1, 'hour'),
        },
        validationSchema: validationSchema,
        onSubmit: (values: any) => {
            console.log(JSON.stringify(values, null, 2));
            alert(JSON.stringify(values, null, 2));
        },
    },);

    useEffect(() => {
        formik.setFieldValue('date', selected, true)
    }, [selected])

    return (
        <article>
            <section className="flex justify-between items-center p-4 text-sm font-thin border border-paynes-gray-900">
                <p>
                    {monthsMap.get(today.month())}, {today.year()}
                </p>
                <Box>
                    <TabContext value={tabValue}>
                        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                            <TabList onChange={handleTabChange} >
                                <Tab disabled label="Day" value="1" />
                                <Tab disabled label="Week" value="2" />
                                <Tab label="Month" value="3" />
                            </TabList>
                        </Box>
                        {/* <TabPanel value="1">Item One</TabPanel>
                        <TabPanel value="2">Item Two</TabPanel>
                        <TabPanel value="3">Item Three</TabPanel> */}
                    </TabContext>
                </Box>
                <div className="flex items-center gap-2">
                    <ExpandMore className="rotate-90 cursor-pointer" onClick={() => { setToday(today.month(today.month() - 1)) }} />
                    <p className="cursor-pointer text-sm font-thin" onClick={() => { setToday(currentDate) }}>TODAY</p>
                    <ExpandLess className="rotate-90 cursor-pointer" onClick={() => { setToday(today.month(today.month() + 1)) }} />
                </div>
            </section>
            <section className="w-full grid grid-cols-7">
                {daysOfTheWeek.map((day, index) => (
                    <section key={index} className="h-16 border border-paynes-gray-900 text-sm font-semibold text-center pt-2 shadow-bottom-border">
                        <p>
                            {day}
                        </p>
                    </section>
                ))}
            </section>
            <section className="w-full grid grid-cols-7  shadow-xl">
                {generateCalendar(today.month(), today.year()).map((dateObject, index) => {
                    const { date, isToday, isCurrentMonth } = dateObject
                    return (
                        <section key={index} className={`${isCurrentMonth ? '' : 'text-paynes-gray-800'} ${isToday ? 'bg-dark_orange text-anti-flash-white-800' : ''} ${selected?.toDate().toDateString() === date.toDate().toDateString() ? 'bg-paynes-gray-900 text-night' : ''} h-16 text-sm flex flex-row border border-paynes-gray-900 px-2 py-1 cursor-pointer hover:bg-paynes-gray-900 hover:text-night transition-all`} onClick={() => { handleCardClick(date) }}>
                            <p className="h-full w-3/12">
                                {date.date()}
                            </p>
                            <section className="w-9/12 space-y-1">
                                {dummyMeetings.filter((meeting) => meeting.date === date.format('DD-MM-YYYY')).map((meeting, index) => (
                                    <p key={index} className="text-[0.5rem] text-night truncate bg-paynes-gray-700/50 rounded-md px-2 hover:scale-105 z-10" onClick={handleMeetingClickInCalendar}>
                                        • {meeting.title}
                                    </p>
                                ))}

                            </section>

                        </section>
                    )
                })}
            </section>

            <Modal open={modalOpen} onClose={handleClose} disableAutoFocus className="absolute flex items-center justify-center">
                <FormGroup className="md:w-7/12 w-11/12 h-fit items-center bg-anti-flash-white p-8 rounded-3xl">
                    <h3 className="text-3xl">Add a meeting</h3>
                    <LocalizationProvider adapterLocale="en-gb" dateAdapter={AdapterDayjs}>
                        <form onSubmit={formik.handleSubmit} className="md:w-8/12 w-full justify-center">
                            <Stack direction={'column'} className="flex flex-col gap-4 p-8">
                                <TextField label='Title' name="title" value={formik.values.title} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.title && Boolean(formik.errors.title)} helperText={formik.touched.title && formik.errors.title} required />
                                <TextField label='Description' name="description" value={formik.values.description} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.description && Boolean(formik.errors.description)} helperText={formik.touched.description && formik.errors.description} required />
                                <TextField label='Guests' name="guests" value={formik.values.guests} onChange={formik.handleChange} onBlur={formik.handleBlur} error={formik.touched.guests && Boolean(formik.errors.guests)} helperText={formik.touched.guests && formik.errors.guests} required />
                                <DatePicker label='Date' name="date" value={formik.values.date ? formik.values.date : dayjs()} onChange={(value) => formik.setFieldValue("date", value, true)} />

                                <TimePicker label='From' name="from" value={formik.values.from} onChange={formik.handleChange} timezone={"system"} viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                }} />
                                <TimePicker label='To' name="to" value={formik.values.to} onChange={formik.handleChange} timezone={"system"} viewRenderers={{
                                    hours: renderTimeViewClock,
                                    minutes: renderTimeViewClock,
                                }}
                                />
                            </Stack>
                            <Stack direction={'row'} className="w-full flex justify-between gap-2 px-8 pb-8">
                                <Button variant={'outlined'} onClick={handleClose} className='w-full'>Cancel</Button>
                                <Button variant={'contained'} type="submit" endIcon={<AddBox />} className='w-full'>Add</Button>
                            </Stack>
                        </form>
                    </LocalizationProvider>
                </FormGroup>
            </Modal>
        </article>
    )
}
