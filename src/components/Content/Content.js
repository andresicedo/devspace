import React, { useEffect, useState } from 'react';
import {auth, db} from '../../firebase';
import { makeStyles } from '@material-ui/core/styles';
import { Grid, Hidden, Paper } from '@material-ui/core';
import LeftContainer from '../LeftContainer/LeftContainer';
import Post from '../Post/Post';


const useStyles = makeStyles((theme) => ({
    paper: {
        position: 'absolute',
        width: 400,
        backgroundColor: theme.palette.background.paper,
        border: '2px solid #000',
        boxShadow: theme.shadows[5],
        padding: theme.spacing(2, 4, 3),
    },
    postPaper: {
        padding: theme.spacing(2),
        textAlign: 'center',
    }
}));

export default function Content() {
    const classes = useStyles();
    const [posts, setPosts] = useState([]);
    const [user, setUser] = useState(null);


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

    return (
        <div>
            <Grid container spacing={5}>
                <Hidden xsDown smDown>
                <Grid item md={3} lg={3} xl={3}>
                    <Paper className={classes.postPaper}><LeftContainer posts={posts}/></Paper>
                </Grid>
                </Hidden>
                <Grid item xs={12} sm={12} md={7} lg={7} xl={7} className="app__posts">
                    {
                        posts.map(({ id, post }) => (
                            <Paper key={id}>
                                <Post key={id} user={user} postLink={post.link} postStack={post.stack} postId={id} username={post.username} caption={post.caption} imageUrl={post.ImageUrl} />
                            </Paper>
                        ))
                    }
                </Grid>
            </Grid>
        </div>
    )
}

