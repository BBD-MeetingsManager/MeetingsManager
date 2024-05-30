
import { useEffect, useState } from "react";
import dayjs, { Dayjs } from "dayjs";
import { AddBox, ExpandLess, ExpandMore } from "@mui/icons-material";
import { generateCalendar } from "../utils/calendar";
import { Button, FormGroup, Modal, Stack, TextField } from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider, TimePicker, renderTimeViewClock } from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
import { useFormik } from "formik";
import * as yup from 'yup';
import 'dayjs/locale/en-gb'

const monthsMap = new Map<number, string>([
    [0, 'January'],
    [1, 'February'],
    [2, 'March'],
    [3, 'April'],
    [4, 'May'],
    [5, 'June'],
    [6, 'July'],
    [7, 'August'],
    [8, 'September'],
    [9, 'October'],
    [10, 'November'],
    [11, 'December'],
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
    title: yup.string().required('This field is required'),
    description: yup.string().max(500).required('This field is required'),
    guests: yup.string().email('Enter the email of the guest').required('This field is required')
})

export const CalendarComponent = () => {
    const daysOfTheWeek: string[] = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    const currentDate: Dayjs = dayjs();

    const [today, setToday] = useState<Dayjs>(currentDate);
    const [selected, setSelected] = useState<Dayjs>();
    const [modalOpen, setModalOpen] = useState<boolean>(false);



    const handleCardClick = (date: Dayjs) => {
        setSelected(date);
        setModalOpen(true);
    }
    const handleClose = () => {
        setModalOpen(false);
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
            <section className="flex justify-between p-4 text-sm font-semibold">
                <p>
                    {monthsMap.get(today.month())}, {today.year()}
                </p>
                <div className="flex items-center gap-2">
                    <ExpandMore className="rotate-90 cursor-pointer" onClick={() => { setToday(today.month(today.month() - 1)) }} />
                    <p className="cursor-pointer" onClick={() => { setToday(currentDate) }}>Today</p>
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
            <section className="w-full grid grid-cols-7">
                {generateCalendar(today.month(), today.year()).map((dateObject, index) => {
                    const { date, isToday, isCurrentMonth } = dateObject
                    return (
                        <section key={index} className={`${isCurrentMonth ? '' : 'text-paynes-gray-800'} ${isToday ? 'bg-dark_orange text-anti-flash-white-800' : ''} ${selected?.toDate().toDateString() === date.toDate().toDateString() ? 'bg-paynes-gray-900 text-night' : ''} h-16 text-sm border border-paynes-gray-900 px-2 py-1 cursor-pointer hover:bg-paynes-gray-900 hover:text-night transition-all`} onClick={() => { handleCardClick(date) }}>
                            <p>
                                {date.date()}
                            </p>
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
