import React, { useState } from 'react';
import firebase from 'firebase';
import { storage, db } from '../../firebase';
import './ImageUpload.css';


export default function ImageUpload({ username }) {
    const [caption, setCaption] = useState("");
    const [stack, setStack] = useState("");
    const [link, setLink] = useState("");
    const [image, setImage] = useState(null);
    const [progress, setProgress] = useState(0);
    
    const handleChange = (e) => {
        if(e.target.files[0]) {
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
                    db.collection("posts").add({
                        timestamp: firebase.firestore.FieldValue.serverTimestamp(),
                        caption: caption,
                        stack: stack,
                        link: link,
                        ImageUrl: url,
                        username: username
                    });
                    setProgress(0);
                    setCaption("");
                    setImage(null);
                });
            }
        )
    }


    return (
        <div className="imageUpload">
            {image && (
                <progress className="imageUpload__progress" value={progress} max="100"/>
            )}
            <input type="file" onChange={handleChange}/>
            <textarea 
                rows="3" 
                cols="50" 
                type="text" 
                placeholder="Enter a caption..." 
                onChange={event => setCaption(event.target.value)} 
                value={caption}
            />
            <input 
                type="text" 
                style={{marginTop: '2%'}} 
                placeholder="Tech stack (React, Node Js, Express, etc...)"
                onChange={event => setStack(event.target.value)} value={stack} 
            />
            <input 
                type="text" 
                style={{marginTop: '2%'}} 
                placeholder="www.website.com"
                onChange={event => setLink(event.target.value)} value={link}
            />
            <button className="imageUpload__button" onClick={handleUpload}>
                Upload
            </button>
        </div>
    )
}
