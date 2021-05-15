import React, { useEffect, useState } from 'react';
import { auth, db } from '../../firebase';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import { Avatar, Button, Checkbox, Container, CssBaseline, FormControlLabel, TextField, Typography } from '@material-ui/core';
import { NavLink } from 'react-router-dom';
import logo from '../../assets/images/devExpo.png';
import logoff from '../../assets/images/logoff.png';


const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: 'white',
    width: '10vh',
    height: '10vh',
    color: 'black',
    fontSize: '45px',
    paddingBottom: '2%',
  },
  form: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(1),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
}));


export default function Navbar() {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [openSignIn, setOpenSignIn] = useState(false);
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [user, setUser] = useState(null);
  const [profileImage, setProfileImage] = useState(null)

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
  }, [user, username]);

  const signUp = (e) => {
    e.preventDefault();

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((authUser) => {
        return authUser.user.updateProfile({
          displayName: username
        })
      })
      .catch((error) => alert(error.message))
  };

  const signIn = (e) => {
    e.preventDefault();

    auth
      .signInWithEmailAndPassword(email, password)
      .catch((error) => alert(error.message))

    setOpenSignIn(false);
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
    <div>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        style={{ backgroundColor: 'white' }}
        >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <p>{'=>'}</p>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
        </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="Username"
                label="Username"
                name="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={signUp}
              >
                Sign Up
              </Button>
              {/* <Grid container>
                <Grid item xs>
                  <Link href="#" variant="body2">
                    Forgot password?
                  </Link>
                </Grid>
                <Grid item>
                  <Link href="#" variant="body2">
                    {"Don't have an account? Sign Up"}
                  </Link>
                </Grid>
              </Grid> */}
            </form>
          </div>
        </Container>
      </Modal>
      <Modal
        open={openSignIn}
        onClose={() => setOpenSignIn(false)}
        style={{ backgroundColor: 'white' }}
        >
        <Container component="main" maxWidth="xs">
          <CssBaseline />
          <div className={classes.paper}>
            <Avatar className={classes.avatar}>
              <p>{'=>'}</p>
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign in
        </Typography>
            <form className={classes.form} noValidate>
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoFocus
              />
              <TextField
                variant="outlined"
                margin="normal"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
              />
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
                className={classes.submit}
                onClick={signIn}
              >
                Sign In
              </Button>
            </form>
          </div>
        </Container>
      </Modal>
      {/* Header */}
      <div className="app_header">
        <div className="app_header_logo">
          <Button component={NavLink} to={'/'}>
            <h1>DevExpo<img src={logo} alt="Logo" style={{ width: '35px', height: 'auto' }} /></h1>
          </Button>
        </div>
        {user ? (
          <div>
            <Button
              component={NavLink} to={'/'}
              style={{ fontSize: '33px' }}>
              {"{'/'}"}
            </Button>
            {profileImage ? (
              <Button component={NavLink} to={`/${user.displayName}/profile/`}>
                <Avatar src={profileImage[0].profileImage.image} style={{ width: '6vh', height: '6vh', objectFit: 'contain' }} />
              </Button>
            ) : (
              <Button component={NavLink} to={`/${user.displayName}/profile/`}>
                <Avatar style={{ width: '6vh', height: '6vh', objectFit: 'contain' }} />
              </Button>
            )}
            <Button onClick={() => auth.signOut()} ><img style={{ width: '42px', height: 'auto' }} src={logoff} alt="logoff" /></Button>
          </div>

        ) : (
          <div className="app__loginContainer">
            <Button onClick={() => setOpenSignIn(true)} >Login</Button>
            <Button onClick={() => setOpen(true)} >Sign Up</Button>
          </div>
        )}
      </div>
    </div>
  )
}
