import { Snackbar } from '@mui/material';

type ToastProps = {
  message: string;
  open: boolean;
  onClose: () => void;
};

const ToastComponent = (props: ToastProps) => {
  return (
    <Snackbar
      autoHideDuration={1000}
      open={props.open}
      onClose={props.onClose}
      anchorOrigin={{ vertical: 'top', horizontal: 'right' }}
      className="bg-charcoal-900 mt-14 rounded-md px-4 py-2"
    >
      <p>{props.message}</p>
    </Snackbar>
  );
};

export default ToastComponent;
