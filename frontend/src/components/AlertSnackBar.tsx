import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AlertSnackBarProps {
  open: boolean;
  setOpen: React.Dispatch<React.SetStateAction<boolean>>;
  displayDuration: number;
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
}

const AlertSnackBar: React.FC<AlertSnackBarProps> = (props) => {
  const handleClose = (
    event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
    if (reason === 'clickaway') {
      console.log(event);
      return;
    }

    props.setOpen(false);
  };

  return (
    <div>
      <Snackbar
        open={props.open}
        autoHideDuration={props.displayDuration}
        onClose={handleClose}
      >
        <Alert
          onClose={handleClose}
          severity={props.severity}
          variant="filled"
          sx={{ width: '100%' }}
        >
          {props.message}
        </Alert>
      </Snackbar>
    </div>
  );
};

export default AlertSnackBar;
