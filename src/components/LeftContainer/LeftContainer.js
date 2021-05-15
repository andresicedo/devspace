import { Button, IconButton } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { auth, db, storage } from '../../firebase';
import './LeftContainer.css';
import firebase from 'firebase';
import Avatars from '../Avatar/Avatars';
import { NavLink } from 'react-router-dom';
import { makeStyles } from '@material-ui/core/styles';


const useStyles = makeStyles((theme) => ({
    root: {
        '& > *': {
            margin: theme.spacing(1),
        },
    },
    input: {
        display: 'none',
    },
}));



export default function LeftContainer({ posts }) {
    const classes = useStyles();
    const [user, setUser] = useState(null);
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);

    let date = (string) => {
        let raw = string.split(" ");
        let creation = `${raw[2]} ${raw[1]}, ${raw[3]}`
        return creation;
    }

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


    const handleChange = (e) => {
        if (e.target.files[0]) {
            setImage(e.target.files[0]);
        }
    };

    const handleUpload = () => {
        const uploadTask = storage.ref(`images/${image.name}`).put(image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                //progress function...
                const progress = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setProgress(progress);
            },
            (error) => {
                //Error function...
                alert(error.message)
            },
            () => {
                //complete function...
                storage
                    .ref("images")
                    .child(image.name)
                    .getDownloadURL()
                    .then(url => {
                        //post image inside db
                        db.collection("profileImage").add({
                            timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                            image: url,
                            imageName: image.name,
                            user: user.displayName
                        });
                        setImage(null);
                        setProgress(0);
                    });
            }
        )
    }


    return (
        <div className="leftContainer">
            {user ? (
                <>
                    <div className="left1">
                        <div className="profilePic">
                            <Avatars />
                        </div>
                        <div className={classes.root}>
                            <input onChange={handleChange} accept="image/*" className={classes.input} id="icon-button-file" type="file" />
                            <label htmlFor="icon-button-file">
                                <IconButton aria-label="upload picture" component="span">
                                    <i style={{ color: 'black' }} className="fas fa-camera"></i>
                                </IconButton>
                            </label>
                        </div>
                        {image && (
                            <div>
                                <progress className="imageUpload__progress" value={progress} max="100" />
                                <button onClick={handleUpload}>Upload Profile Image</button>
                            </div>
                        )}
                        {user.displayName && (
                            <Button component={NavLink} to={`/${user.displayName}/profile/`}>
                                <h2><strong>@{user.displayName}</strong></h2>
                            </Button>
                        )}

                        <p>Signed Up: {date(user.metadata.creationTime)}</p>
                        <p>Posts: {posts.length}</p>
                        <div className="purpose">
                            <p>Show your work.</p>
                            <p>Get inspired.</p>
                            <p>Keep on coding.</p>
                        </div>
                    </div>
                </>
            ) : (
                <div>
                    <div className="purpose">
                        <p>Show your work.</p>
                        <p>Get inspired.</p>
                        <p>Keep on coding.</p>
                    </div>
                </div>
            )}

        </div>
    )
}
