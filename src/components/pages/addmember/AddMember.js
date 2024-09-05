import React, { useState } from 'react';
import { getAuth, createUserWithEmailAndPassword, updateCurrentUser, onAuthStateChanged } from 'firebase/auth';
import { collection, doc, setDoc, serverTimestamp } from 'firebase/firestore';
import { database } from '../../../backend/firebase-config'
import { useNavigate } from 'react-router-dom';

// import LogoContainer from '../../logocontainer/LogoContainer';
import { MdArrowBack } from "react-icons/md";
import { Button } from '@chakra-ui/react';
import { FormControl, HStack, Input } from "@chakra-ui/react";

import './AddMember-styles.css';

function AddMember() {
  const navigation = useNavigate();

  let auth = getAuth();
  let originalUser;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, set originalUser
      originalUser = user;
    } else {
      // User is signed out
      originalUser = null;
    }
  });

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
  const [AddMemberSuccess, setAddMemberSuccess] = useState(false);

  const handleAddMember = (event) => {
    event.preventDefault();

    if (password !== confirmPassword) {
      setPasswordError('Passwords do not match');
    } else {
      setPasswordError('');
      createUserWithEmailAndPassword(auth, data.email, password)
        .then(async (response) => {
          await handleData(response.user);
          setAddMemberSuccess(true);
          auth.updateCurrentUser(originalUser);
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
    return new Promise(async (resolve, reject) => {
    console.log(user);

    const uid = user.uid;
    const collectionRef = collection(database, 'Members'); 
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

        resolve(); // Resolve the promise when done
    } catch (err) {
      alert(err.message);
      reject(err); // Reject the promise if an error occurs
    }
  });
};
  
return (
  <div className="AddMember" id="pageWithoutNF">
    <div className="AMLogoContainer">
      {/* <LogoContainer /> */}
      <img src="/fullLogo.png" alt="Full Logo" />
    </div>

    <div id="NoNFOuterContainer">
      <Button variant="ghost" size="lg" 
        alignSelf="flex-start"
        animation="floatUp 1.5s ease-out"
        onClick={() => navigation(-1)}>
        <MdArrowBack size="2em"/>
      </Button>

      <div className="AddMemberFormContainer">
      {!AddMemberSuccess ? (
        <div>
          <p id="InputFormTitle">Add Member</p>

          <form onSubmit={handleAddMember} className="InputContainer">
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
              Add Member
            </Button>
          </form>
        </div>
      ) : (
        <div className="AMSuccessMessage">
          <p id="InputFormTitle">New member successfully added!</p>
        </div>
      )}
      </div>
    </div>
  </div>
);
}

export default AddMember;