import * as React from 'react';
import Snackbar, { SnackbarCloseReason } from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';


interface AppToastProps {
    setContent: (new_content:React.ReactNode | null) => void,
    content: React.ReactNode | null
}

export default function AppToast({content, setContent}:AppToastProps) {


    const handleClose = (
        _: React.SyntheticEvent | Event,
        reason?: SnackbarCloseReason,
    ) => {
        if (reason === 'clickaway') {
            return;
        }

        setContent(null);
    };

    const action = (
        <React.Fragment>
            <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={handleClose}
            >
                <CloseIcon fontSize="small" />
            </IconButton>
        </React.Fragment>
    );

    return (
        <Snackbar
            open={content !== null}
            autoHideDuration={6000}
            onClose={handleClose}
            message={content}
            action={action}
        />
    );
}