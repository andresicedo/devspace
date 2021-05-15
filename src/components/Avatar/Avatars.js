import { Avatar, Button } from '@material-ui/core'
import React, { useEffect, useState } from 'react'
import { NavLink } from 'react-router-dom';
import { db } from '../../firebase';

export default function Avatars() {
    const [profileImage, setProfileImage] = useState(null);

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
        <div className="profilePic">
            {profileImage ? (
                <Button component={NavLink} to={`/${profileImage.user}/profile/`}>
                    <Avatar src={profileImage[0].profileImage.image} style={{ width: '25vh', height: '25vh', objectFit: 'contain' }} />
                </Button>
            ) : (
                <Button >
                    <Avatar style={{ width: '25vh', height: '25vh', objectFit: 'contain' }} />
                </Button>
            )}
        </div>
    )
}
