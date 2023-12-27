import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';

export default function Toast() {
  const [open, setOpen] = React.useState(true);


  return (

    <Snackbar
      open={open}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      autoHideDuration={5000}
      message="Punto enviado correctamente"
      onClose={() => setOpen(false)}

    />
  );
}
