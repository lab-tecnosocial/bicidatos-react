import React from 'react';
import Button from '@material-ui/core/Button';
import Snackbar from '@material-ui/core/Snackbar';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import { truncate } from 'fs';

export default function Toast(props) {
  const [open, setOpen] = React.useState(false);

  return (

      <Snackbar
        open={props.open}
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
