import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import Alert from '@mui/material/Alert';

interface AlertSnackBarProps {
  open: boolean | null;
  setOpen: React.Dispatch<React.SetStateAction<boolean | null>>;
  displayDuration: number;
  severity: 'success' | 'info' | 'warning' | 'error';
  message: string;
  position: {
    vertical: 'bottom' | 'top';
    horizontal: 'center' | 'left' | 'right';
  };
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
        open={props.open as boolean}
        autoHideDuration={props.displayDuration}
        onClose={handleClose}
        anchorOrigin={props.position}
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
