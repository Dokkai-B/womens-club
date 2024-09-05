import { Button } from '@chakra-ui/react';
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from 'react-router-dom';

import React, { useState, useEffect } from 'react';
import { database } from '../../../backend/firebase-config'
import { collection, onSnapshot, orderBy, query, doc, deleteDoc, setDoc, getDocs } from 'firebase/firestore';

import './PendingMembers-styles.css';

function PendingMembers() {
  const [registrants, setRegistrants] = useState([]);
  const navigation = useNavigate();

  useEffect(() => {
    const registrantsCollectionRef = collection(database, 'Registrants');
    const q = query(registrantsCollectionRef, orderBy("timestamp"));

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const newRegistrants = snapshot.docs.map(doc => ({...doc.data(), id: doc.id}));
      setRegistrants(newRegistrants);
    });

    // Clean up the listener when the component unmounts
    return () => unsubscribe();
  }, []);

  const acceptRegistrant = async (registrant) => {
    const membersCollectionRef = collection(database, 'Members');
    const newMemberDocRef = doc(membersCollectionRef, registrant.id); // Use registrant.id as the document ID
    
    // Add memberDonations and memberParticipations collections to the accepted registrant's data
    const updatedRegistrant = {
      ...registrant,
      memberDonations: [],
      memberParticipations: [],
    };
  
    await setDoc(newMemberDocRef, updatedRegistrant);
  
    const registrantsCollectionRef = collection(database, 'Registrants');
    const registrantDocRef = doc(registrantsCollectionRef, registrant.id);
    await deleteDoc(registrantDocRef);
  
    setRegistrants(registrants.filter(r => r.id !== registrant.id));
  };

  const rejectRegistrant = async (registrant) => {
    const registrantsCollectionRef = collection(database, 'Registrants');
    const registrantDocRef = doc(registrantsCollectionRef, registrant.id);
    await deleteDoc(registrantDocRef);

    setRegistrants(registrants.filter(r => r.id !== registrant.id));
  };

  useEffect(() => {
    const fetchRegistrants = async () => {
      const registrantsCollectionRef = collection(database, 'Registrants');
      const registrantsSnapshot = await getDocs(registrantsCollectionRef);
      setRegistrants(registrantsSnapshot.docs.map(doc => ({...doc.data(), id: doc.id})));
    };

    fetchRegistrants();
  }, []);

  return (
    <div className="PendingMembers" id="pageWithNF">
      <div id ="blueHeader">
        <h1>Pending Members</h1>
      </div>
      <div className="pendingMembersContainer">

        <Button variant="ghost" size="lg" 
          alignSelf="flex-start"
          animation="floatUp 1.5s ease-out"
          onClick={() => navigation(-1)}>
          <MdArrowBack size="2em"/>
        </Button>

        {registrants.map((registrant, index) => (
        <div key={index} className="pendingMemberCard">
          {/* user profile pic  */}
          <img className="PMUserImage" src={'/defaultImage.jpg'} alt="User" />
        
          <div className="pendingMemberDetails">
            {/* user details */}
            <div>
              <p>Name: </p>
              <p>{`${registrant.firstName} ${registrant.middleName} ${registrant.lastName}`}</p>
            </div>
            
            <div>
              <p>Email: </p>
              <p>{registrant.email}</p>
            </div>

            <div>
              <p>Birthday: </p>
              <p>{registrant.birthday}</p>
            </div>
            
            <div>
              <p>Contact Number: </p>
              <p>{registrant.contactNumber}</p>
            </div>

            <div>
              <p>Address: </p>
              <p>{registrant.address}</p>
            </div>
          </div>

          {/* approve/reject */}
          <div>
            <Button className="PMButtonStyle" 
              background="#073a87"
              onClick={() => acceptRegistrant(registrant)}>
              Approve
            </Button>
            <Button className="PMButtonStyle" 
              background="#a92a2a"
              onClick={() => rejectRegistrant(registrant)}>
              Reject
            </Button>
          </div>  
        </div>
      ))}
      </div>
    </div>
  );
}
export default PendingMembers;