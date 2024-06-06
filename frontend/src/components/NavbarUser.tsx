import {paths} from "../enums/paths.tsx";
import {Button, FormGroup, Modal, Stack, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import React, {useState} from "react";
import {AddBox, Edit} from "@mui/icons-material";
import ToastComponent from "./ToastComponent.tsx";

type UserInformation = {
    email: string,
    username: string,
}

type FormDataType = { username: string; }

const validationSchema = yup.object({
    username: yup.string().max(50).required('This field is required')
});

const NavbarUser = () => {
    const [showToast, setShowToast] = useState<boolean>(false);
    const [toastMessage, setToastMessage] = useState<string>('');

    const token = localStorage.getItem("id_token");

    const [userInformation, setUserInformation] = useState<UserInformation>({
        email: '',
        username: '',
    });

    const [getDetailsCount, setGetDetailsCount] = useState<number>(0);
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const formik = useFormik<FormDataType>({
        initialValues: {
            username: userInformation.username,
        },
        validationSchema: validationSchema,
        onSubmit: (values: FormDataType) => {
            const url = `${paths.apiUrlLocal}/user/editUsername`
            const options = {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`,
                },
                body: JSON.stringify({
                    username: values.username,
                }).toString()
            };

            fetch(url, options)
                .then(result => {
                    if (!result.ok) {
                        setShowToast(true);
                        setToastMessage('There was an error trying to change your username. Please try again later.');

                        handleClose();
                    }
                    else {
                        result.json()
                            .then(asJson => {
                                if (asJson.hasOwnProperty('alert')) {
                                    setShowToast(true);
                                    setToastMessage('That username is already in use.');

                                    handleClose();
                                }
                                else {
                                    setShowToast(true);
                                    setToastMessage('Successfully changed your username.');

                                    setGetDetailsCount(prevState => prevState + 1);
                                    handleClose();
                                }
                            });
                    }
                });
        },
    },);

    const handleClose = () => {
        formik.resetForm();
        setModalOpen(false);
    }

    React.useEffect(
        () => {
            if (!token){
                return;
            }

            const options = {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            };

            const url = `${paths.apiUrlLocal}/user/getMyDetails`;
            fetch(url, options)
                .then(result => {
                    if (!result.ok) {
                        setShowToast(true);
                        setToastMessage('There was an error getting your user details. Please try again later.');
                    }
                    else {
                        result.json()
                            .then(user => {
                                setUserInformation({
                                    email: user[0].email,
                                    username: user[0].username ?? 'anonymous'
                                });
                            });
                    }
                });
        },
        [getDetailsCount]
    );

    if (token){
        return (
            <div>
                <Button
                    color="inherit"
                    onClick={() => setModalOpen(true)}
                    endIcon={<Edit />}
                >
                        {`Hello ${userInformation.username}`}
                </Button>

                <Modal open={modalOpen} onClose={() => setModalOpen(false)} disableAutoFocus className="absolute flex items-center justify-center">
                    <FormGroup className="md:w-7/12 w-11/12 h-fit items-center bg-mint_cream p-8 rounded-3xl">
                        <h3 className="text-3xl">Edit Username</h3>
                        <form onSubmit={formik.handleSubmit} className="md:w-8/12 w-full justify-center">
                            <Stack direction={'column'} className="flex flex-col gap-4 p-8">
                                <TextField label='New Username' name="username" value={formik.values.username}
                                           onChange={formik.handleChange} onBlur={formik.handleBlur}
                                           error={formik.touched.username && Boolean(formik.errors.username)}
                                           helperText={formik.touched.username && formik.errors.username} required/>
                            </Stack>

                            <Stack direction={'row'} className="w-full flex justify-between gap-2 px-8 pb-8">
                                <Button variant={'outlined'} onClick={handleClose} className='w-full'>Cancel</Button>
                                <Button variant={'contained'} type="submit" endIcon={<AddBox />} className='w-full'>Submit</Button>
                            </Stack>
                        </form>
                    </FormGroup>
                </Modal>

                <ToastComponent
                    duration={1500}
                    message={toastMessage}
                    open={showToast}
                    onClose={() => {
                        setShowToast(false);
                    }}
                />
            </div>
        )
    }
}

export default NavbarUser
