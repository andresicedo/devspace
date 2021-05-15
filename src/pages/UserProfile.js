import { Avatar, Grid, makeStyles, Paper } from '@material-ui/core';
import React, { useEffect, useState } from 'react';
import { auth, db } from '../firebase';
import './UserProfile.css';

const useStyles = makeStyles((theme) => ({
    root: {
        flexGrow: 1,
    },
    paper: {
        padding: theme.spacing(2),
        textAlign: 'center',
        color: theme.palette.text.secondary,
        marginLeft: '5%',
        width: '100%',
    },
}));

export default function UserProfile() {
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);
    const [profileImage, setProfileImage] = useState(null);

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

    useEffect(() => {
        //this is where the code runs
        db.collection('posts').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            //every time a new post is added, run this code
            setPosts(snapshot.docs.map(doc => ({
                id: doc.id,
                post: doc.data()
            })));
        })
    }, []);

    useEffect(() => {
        //this is where the code runs
        db.collection('profileImage').orderBy('timestamp', 'desc').onSnapshot(snapshot => {
            //every time a new post is added, run this code
            setProfileImage(snapshot.docs.map(doc => ({
                id: doc.id,
                profileImage: doc.data()
            })));
        })
    }, []);


    return (
        <div>
            <div className="userProfile__col1">
                <div className="col1__leftSide">
                    {profileImage && (
                        <Avatar src={profileImage[0].profileImage.image} style={{ width: '35vh', height: '35vh', objectFit: 'contain' }} />
                    )}
                </div>
                <div className="col1__rightSide">
                    <div className="rightSide__1">
                        {profileImage && (
                            <p className="rightSide__1__name">@{profileImage[0].profileImage.user}</p>
                        )}
                    </div>
                </div>
            </div>
            <div className="userProfile__col2">
                <div className={classes.root}>
                    <Grid container spacing={3}>
                        {posts && (
                            posts.map(({ id, post }) => (
                                <Grid item xs={12} sm={6} md={4} lg={4} xl={4}>
                                    <Paper className={classes.paper}>
                                        <div key={id} className="postCard">
                                            <Avatar className="postImage" src={post.ImageUrl} alt="PostImage" style={{ height: '50vh', width: '50vh' }} />
                                            <div className="postContainer">
                                                <h4><strong>@{post.username}</strong></h4>
                                                <p className="postCap">{post.caption}</p>
                                            </div>
                                        </div>
                                    </Paper>
                                </Grid>)))
                        }
                    </Grid>
                </div>
            </div>
        </div>
    )
}
