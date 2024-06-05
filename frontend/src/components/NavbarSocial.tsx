import { paths } from '../enums/paths.tsx';
import { Button, FormGroup, Modal, Stack, TextField } from '@mui/material';
import { useFormik } from 'formik';
import * as yup from 'yup';
import React, { useState } from 'react';
import { AddBox, CircleNotifications } from '@mui/icons-material';
import './Navbar.css';

type FormDataType = { email: string };

const validationSchema = yup.object({
  email: yup.string().max(255).required('This field is required'),
});

const NavbarSocial = () => {
  const token = localStorage.getItem('id_token');

  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const formik = useFormik<FormDataType>({
    initialValues: {
      email: '',
    },
    validationSchema: validationSchema,
    onSubmit: (values: FormDataType) => {
      const url = `${paths.apiUrlLocal}/friends/makeRequest`;
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          targetEmail: values.email,
        }).toString(),
      };

      fetch(url, options).then((result) => {
        if (!result.ok) {
          console.log('Unsuccessfully sent friend request', result);
          handleClose();
        } else {
          result.json().then((asJson) => {
            //Todo, add toast
            console.log('Successfully sent friend request', asJson);
            handleClose();
          });
        }
      });
    },
  });

  const handleClose = () => {
    formik.resetForm();
    setModalOpen(false);
  };

  const handleFriendRequest = (isRejected: boolean, senderEmail: string) => {
    const url = `${paths.apiUrlLocal}/friends/handleRequest`;
    const options = {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${localStorage.getItem('id_token')}`,
      },
      body: JSON.stringify({
        senderEmail: senderEmail,
        status: `${isRejected ? 'rejected' : 'accepted'}`,
      }).toString(),
    };

    fetch(url.toString(), options).then((result) =>
      result.json().then((asJson) => {
        console.log('response, friend request changed', asJson);
      })
    );
  };

  const [friendInvites, setFriendInvites] = useState<JSX.Element[]>([]);

  React.useEffect(() => {
    const options = {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    };

    const url = `${paths.apiUrlLocal}/complex/getFriendRequests`;
    fetch(url, options).then((result) =>
      result.json().then((friends) => {
        const tmpFriends = [];

        if (Array.isArray(friends)) {
          for (const friend of friends) {
            tmpFriends.push(
              <div key={`friend-${friend.email}`} style={{ border: '1px solid black' }}>
                <p>{`From: ${friend.email}`}</p>
                <button onClick={() => handleFriendRequest(true, friend.email)} type="button">
                  Reject
                </button>
                <button onClick={() => handleFriendRequest(false, friend.email)} type="button">
                  Accept
                </button>
              </div>
            );
          }
        }

        setFriendInvites(tmpFriends);
      })
    );
  }, []);

  return (
    <div>
      <div className="dropdown">
        <Button
          color="inherit"
          onClick={() => setModalOpen(true)}
          endIcon={<CircleNotifications />}
        >
          Social
        </Button>

        <div className="dropdown-content">{friendInvites}</div>
      </div>

      <Modal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        disableAutoFocus
        className="absolute flex items-center justify-center"
      >
        <FormGroup className="md:w-7/12 w-11/12 h-fit items-center bg-mint_cream p-8 rounded-3xl">
          <h3 className="text-3xl">Edit Username</h3>
          <form onSubmit={formik.handleSubmit} className="md:w-8/12 w-full justify-center">
            <Stack direction={'column'} className="flex flex-col gap-4 p-8">
              <TextField
                label="Email"
                name="email"
                value={formik.values.email}
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                error={formik.touched.email && Boolean(formik.errors.email)}
                helperText={formik.touched.email && formik.errors.email}
                required
              />
            </Stack>

            <Stack direction={'row'} className="w-full flex justify-between gap-2 px-8 pb-8">
              <Button variant={'outlined'} onClick={handleClose} className="w-full">
                Cancel
              </Button>
              <Button variant={'contained'} type="submit" endIcon={<AddBox />} className="w-full">
                Submit
              </Button>
            </Stack>
          </form>
        </FormGroup>
      </Modal>
    </div>
  );
};

export default NavbarSocial;
