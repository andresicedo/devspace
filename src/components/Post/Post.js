import React, { useEffect, useState } from 'react';
import './Post.css';
import { makeStyles } from '@material-ui/core/styles';
import Avatar from '@material-ui/core/Avatar';
import { db } from '../../firebase';
import firebase from 'firebase';
import { Button } from '@material-ui/core';
import { NavLink } from 'react-router-dom';


const useStyles = makeStyles((theme) => ({
    root: {
        display: 'flex',
        '& > *': {
            margin: theme.spacing(1),
        },
    },
}));



export default function Post({ user, username, caption, imageUrl, postId, postLink, postStack }) {
    const [comments, setComments] = useState([]);
    const [comment, setComment] = useState("");
    const [profileImage, setProfileImage] = useState(null);
    const classes = useStyles();

    useEffect(() => {
        let unsubscribe;
        if (postId) {
            unsubscribe = db
                .collection("posts")
                .doc(postId)
                .collection("comments")
                .orderBy("timestamp", "desc")
                .onSnapshot((snapshot) => {
                    setComments(snapshot.docs.map((doc) => doc.data()));
                });
        }

        return () => {
            unsubscribe();
        };
    }, [postId]);


    const postComment = (e) => {
        e.preventDefault();
        db
            .collection("posts")
            .doc(postId)
            .collection("comments")
            .add({
                text: comment,
                username: user.displayName,
                timestamp: firebase.firestore.FieldValue.serverTimestamp()
            });
        setComment("");
    }

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
        <div className="post">
            {/* header -> avatar & username */}
            <div className="post__header">
                {user ? (
                    <Button component={NavLink} to={`/${user.displayName}/profile/`}>
                        <div className={classes.root}>
                            {profileImage ? (
                                <Avatar
                                className="post__avatar"
                                src={profileImage[0].profileImage.image}
                                alt="Avatar"
                                style={{width: '12vh', height: '12vh'}}
                                />
                            ) : (
                                <Avatar
                                className="post__avatar"
                                src="/broken-image.jpg"
                                alt="Avatar"
                                style={{width: '12vh', height: '12vh'}}
                                />
                            )}
                            
                        </div>
                        <h3>@{username}</h3>
                    </Button>
                ) : (
                    <Button >
                        <div className={classes.root}>
                            {profileImage ? (
                                <Avatar
                                className="post__avatar"
                                src={profileImage[0].profileImage.image}
                                alt="Avatar"
                                style={{width: '12vh', height: '12vh'}}
                                />
                            ) : (
                                <Avatar
                                className="post__avatar"
                                src="/broken-image.jpg"
                                alt="Avatar"
                                style={{width: '12vh', height: '12vh'}}
                                />
                            )}
                            
                        </div>
                        <h3>@{username}</h3>
                    </Button>
                )}
            </div>
            {/* image */}
            <img className="post__image" src={imageUrl} alt="PostImage" />

            {/* username & caption */}
            <div className="post__text">
                {user ? (
                    <p>
                        <Button style={{fontSize: '20px'}} component={NavLink} to={`/${user.displayName}/profile/`}><strong>@{username}</strong></Button>
                    </p>
                ) : (
                    <p>
                        <Button style={{fontSize: '20px'}}><strong>@{username}</strong></Button>
                    </p>
                )}
                <p className="postCap">{caption}</p>
                <p style={{marginTop: '10px'}}><strong>Tech Stack: </strong>{postStack}</p>
                <p style={{marginTop: '10px'}}><strong>Link: </strong><a rel="noreferrer" target="_blank" href={postLink} style={{color: 'black'}}>{postLink}</a></p>
            </div>
            {/* comments */}
            <div className="post_comments">
                {comments.map((comment) => (
                    <p>
                        <strong>{comment.username}</strong> {comment.text}
                    </p>
                ))}
            </div>

            {user && (
                <form className="post_commentBox">
                    <input
                        className="post__input"
                        type="text"
                        placeholder="Add a comment..."
                        value={comment}
                        onChange={(e) => setComment(e.target.value)}
                    />
                    <button
                        className="post__button"
                        disabled={!comment}
                        type="submit"
                        onClick={postComment}
                    >
                        Post
                </button>
                </form>
            )}
        </div>
    )
}
