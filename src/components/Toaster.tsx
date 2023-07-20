import { makeStyles } from '@material-ui/core/styles';
import { Snackbar, SnackbarContent } from '@material-ui/core';

const useStyles = makeStyles(theme => ({
  success: {
    backgroundColor: theme.palette.success.main,
  },
  error: {
    // backgroundColor: theme.palette.error.main,
    backgroundColor: '#FFA500',
  },
  message: {
    display: 'flex',
    alignItems: 'center',
  },
}));

const Toaster = ({ open, onClose, message, type }) => {
  const classes = useStyles();

  return (
    <Snackbar open={open} autoHideDuration={3000} onClose={onClose} style={{ zIndex: 9999 }}>
      <SnackbarContent
        className={type === 'success' ? classes.success : classes.error}
        // className={type === 'success' ? classes.success : type === 'error' ? classes.error : classes.orange}
        message={<span className={classes.message}>{message}</span>}
      />
    </Snackbar>
  );
};

export default Toaster;