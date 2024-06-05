import {paths} from "../enums/paths.tsx";
import {Button, FormGroup, Modal, Stack, TextField} from "@mui/material";
import {useFormik} from "formik";
import * as yup from "yup";
import React, {useState} from "react";
import {AddBox, Edit} from "@mui/icons-material";

type UserInformation = {
    email: string,
    username: string,
}

type FormDataType = { username: string; }

const validationSchema = yup.object({
    username: yup.string().max(50).required('This field is required')
});

const NavbarUser = () => {
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
                .then(result => result.json()
                    .then(asJson => {
                        // Todo, add toasts here
                        if (asJson.hasOwnProperty('alert')) console.log("username already in use");
                        else {
                            console.log("successfully edited username", asJson);
                            setGetDetailsCount(getDetailsCount + 1);
                            handleClose();
                        }
                    }));
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
                .then(result => result.json()
                    .then(user => {
                        console.log("got user", user);
                        setUserInformation({
                            email: user[0].email,
                            username: user[0].username ?? 'anonymous'
                        });
                    }));
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
                    <FormGroup className="md:w-7/12 w-11/12 h-fit items-center bg-anti-flash-white p-8 rounded-3xl">
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
            </div>
        )
    }
}

export default NavbarUser
