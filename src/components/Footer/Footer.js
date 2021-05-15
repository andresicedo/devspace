import React, { useEffect, useState } from 'react'
import { auth } from '../../firebase';
import ImageUpload from '../ImageUpload/ImageUpload';
import './Footer.css';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Button } from '@material-ui/core';


function rand() {
    return Math.round(Math.random() * 20) - 10;
}

function getModalStyle() {
    const top = 50 + rand();
    const left = 50 + rand();

    return {
        top: `${top}%`,
        left: `${left}%`,
        transform: `translate(-${top}%, -${left}%)`,
    };
}

const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 650,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    root: {
        '& > *': {
          margin: theme.spacing(1),
        },
      },
}));


export default function Footer() {
    const [user, setUser] = useState(null);
    const classes = useStyles();
    const [modalStyle] = React.useState(getModalStyle);
    const [open, setOpen] = React.useState(false);


    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((authUser) => {
            if (authUser) {
                //user has logged in...
                setUser(authUser);
            } else {
                //user has logged out...
                setUser(null);
            }
        })
        return () => {
            //perform some cleanup actions
            unsubscribe();
        }
    }, [user]);

    return (
        <div className="footer_upload">
            <div className={classes.root}>
                <Button 
                onClick={handleOpen} 
                variant="contained" 
                style={{fontSize: '27px', fontWeight: 'bold', backgroundColor: 'black', color: 'white'}}>
                    ++
                </Button>
            </div>
            <Modal
                open={open}
                onClose={handleClose}
            >
                <div style={modalStyle} className={classes.paper}>
                    {user?.displayName ? (
                        <ImageUpload username={user.displayName} />
                    ) : (
                        <h3>Login to upload</h3>
                    )}
                </div>
            </Modal>
        </div>
    )
}