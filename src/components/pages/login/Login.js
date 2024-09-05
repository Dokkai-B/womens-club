import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore, doc, collection, getDoc } from 'firebase/firestore';
import { FIREBASE_AUTH } from '../../../backend/firebase-config';
import { MdArrowBack } from "react-icons/md";

import LogoContainer from '../../logocontainer/LogoContainer';
import { Button } from '@chakra-ui/react';
import { FormControl, Input } from "@chakra-ui/react";

import './Login-styles.css';

function Login() {
  const navigation = useNavigate();
  const auth = FIREBASE_AUTH;
  const database = getFirestore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginStatus, setLoginStatus] = useState('');

  const handleLogin = (event) => {
    signInWithEmailAndPassword(auth, email, password)
    .then(async (userCredential) => {
      if (userCredential.user) {
        const docRef = doc(collection(database, "Members"), userCredential.user.uid);
        const docSnap = await getDoc(docRef);
  
        if (docSnap.exists()) {
          navigation('/home');
        } else {
          setLoginStatus({
            title: 'Sorry',
            message: 'Your account is not registered or has been rejected.'
          });
        }
      } else {
        setLoginStatus({
          title: 'Error',
          message: 'User credential is null.'
        });
      }
    })
    .catch((error) => {
      setLoginStatus({
        title: 'Error',
        message: error.message
      });
    });
  }
  const handleInputChange = (event, setInput) => {
    setInput(event.target.value);
    setLoginStatus('');
  }

  return (
    <div className="Login" id="pageWithoutNF">
      <LogoContainer />

          <div id="NoNFOuterContainer">
          {loginStatus ? (
            <div className="LoginFormContainer">
              <Button variant="ghost" size="lg" 
                alignSelf="flex-start"
                animation="floatUp 1.5s ease-out"
                onClick={() => {
                  setLoginStatus(null); // Reset loginStatus to hide the message
                  navigation(-1); // Navigate back to the previous page
                }}>
                <MdArrowBack size="2em"/>
              </Button>
              <p id="InputFormTitle">{loginStatus.title}</p>
              <p>{loginStatus.message}</p>
            </div>
          ) : (
          <form className="LoginFormContainer">
            <p id="InputFormTitle">Log In</p>

            <div className="InputContainer">
              <FormControl id="email">
                <Input name="email" type="email" placeholder="Email"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={(event) => handleInputChange(event, setEmail)}/>
              </FormControl>

              <FormControl id="password">
                <Input name="password" type="password" placeholder="Password"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={(event) => handleInputChange(event, setPassword)}/>
              </FormControl>
            </div>

            <div className="LButtonContainer">
              <Button mt={4} type="button" 
                backgroundColor="#073a87"
                borderRadius='0px'
                color="white"
                minW="120"
                fontWeight="400"
                onClick={() => handleLogin()}>
                Log In
              </Button>

              <Button mt={4} type="button" 
                backgroundColor="#9C6A3D"
                borderRadius='0px'
                color="white"
                minW="120"
                fontWeight="400"
                onClick={() => navigation('/signup')}>
                Sign Up
              </Button>
            </div>

            <Button mt={4} type="button"
              color="#B5B5B5"
              variant="unstyled"
              fontSize="16"
              alignSelf="flex-start"
              marginLeft="5px"
              fontWeight="300"
              onClick={() => navigation('/forgot-password')}>
              Forgot Password?
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
export default Login;