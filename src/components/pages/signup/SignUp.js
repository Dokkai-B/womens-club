import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { database } from '../../../backend/firebase-config'
import { useNavigate } from 'react-router-dom';

import { MdArrowBack } from "react-icons/md";
import { Button } from '@chakra-ui/react';
import { FormControl, HStack, Input } from "@chakra-ui/react";

import './SignUp-styles.css';

function SignUp() {
  const navigation = useNavigate();

  let auth = getAuth();

  const [data, setData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    birthday: new Date(),
    contactNumber: '',
    address: '',
    userImage: '/defaultImage.jpg',
  });

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordError, setPasswordError] = useState('');
  const [signUpSuccess, setSignUpSuccess] = useState(false);

  const handleSignUp = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
      createUserWithEmailAndPassword(auth, data.email, password)
        .then((response) => {
          handleData(response.user);
          setSignUpSuccess(true);
        })
        .catch((err) => {
          if (err.code === 'auth/email-already-in-use') {
            alert('This email is already associated with an existing account.');
          } else {
            alert(err.message);
          }
        })
    }
  };

  const handleData = async (user) => { //call this last
    console.log(user);

    const uid = user.uid;
    const collectionRef = collection(database, 'Registrants'); // Changed 'Users' to 'Registrants'
    const userDocRef = doc(collectionRef, uid);
    try {
        await setDoc(userDocRef, {
            uid: user.uid,
            firstName: data.firstName,
            middleName: data.middleName,
            lastName: data.lastName,
            email: data.email,
            birthday: data.birthday,
            contactNumber: data.contactNumber,
            address: data.address,
            admin: false,
            userImage: "/defaultImage.jpg",
            timestamp: serverTimestamp(), // For the time the user registered
        });

    } catch (err) {
        alert(err.message);
    }
};
  
return (
  <div className="SignUp" id="pageWithoutNF">
    <div className="SULogoContainer">

      <img src="/fullLogo.png" alt="Full Logo" />
    </div>

    <div id="NoNFOuterContainer">
      <Button variant="ghost" size="lg" 
        alignSelf="flex-start"
        animation="floatUp 1.5s ease-out"
        onClick={() => navigation('/')}>
        <MdArrowBack size="2em"/>
      </Button>

      <div className="SignUpFormContainer">
      {!signUpSuccess ? (
        <div>
          <p id="InputFormTitle">Sign Up</p>

          <form onSubmit={handleSignUp} className="InputContainer">
            <FormControl id="name" >
              <HStack spacing="24px">
                <Input name="firstName" type="text" placeholder="First Name" px="5px"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={event => setData({...data, firstName: event.target.value })}/>
                <Input name="middleName" type="text" placeholder="Middle Name" px="5px"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={event => setData({...data, middleName: event.target.value })}/>
                <Input name="lastName" type="text" placeholder="Last Name" px="5px"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={event => setData({...data, lastName: event.target.value })}/>
              </HStack>
            </FormControl>

            <FormControl id="email" >
              <Input name="email" type="email" placeholder="Email" px="5px"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={event => setData({...data, email: event.target.value })}/>
            </FormControl>

            <FormControl id="password">
              <Input name="password" type="password" placeholder="Password" px="5px"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={event => setPassword(event.target.value)}/>
            </FormControl>

            <FormControl id="password" mb="10px">
              <Input name="confirmPassword" type="password" placeholder="Confirm Password" px="5px"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={event => setConfirmPassword(event.target.value)}/>
            </FormControl>

            <FormControl id="details">
              <HStack spacing="24px">
                <Input name="birthday" type="date" placeholder="Birthday" px="5px"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={event => setData({...data, birthday: event.target.value })}/>
                <Input name="contactNumber" type="tel" placeholder="Contact Number" px="5px"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={event => setData({...data, contactNumber: event.target.value })}/>
              </HStack>
            </FormControl>

            <p>{passwordError}</p>

            <FormControl id="address">
              <Input name="address" type="text" placeholder="Address" px="5px"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={event => setData({...data, address: event.target.value })}/>
            </FormControl>

            <Button mt={4} type="submit" 
                backgroundColor="#073a87"
                borderRadius='0px'
                color="white"
                minW="120"
                fontWeight="400">
              Sign Up
            </Button>
          </form>
        </div>
      ) : (
        <div className="SignUpSuccessMessage">
          <p id="InputFormTitle">Sign Up Successful!</p>
          <p>Check your email for further instructions.</p>
        </div>
      )}
      </div>
    </div>
  </div>
);
}

export default SignUp;