import { useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { collection, addDoc, doc, updateDoc, arrayUnion, getDoc } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { database } from '../../../backend/firebase-config'; // import your firebase instance

import LogoContainer from '../../logocontainer/LogoContainer';
import { MdArrowBack } from "react-icons/md";
import { Button, Checkbox, Input, Textarea, Select } from '@chakra-ui/react';

import './EventParticipation-styles.css';

function EventParticipation() {
  const navigate = useNavigate();
  const auth = getAuth(); // get the auth object  
  const user = auth.currentUser; // get the currently logged-in user
  const { id } = useParams();

  const [participate, setParticipate] = useState(false);
  const [donate, setDonate] = useState(false);
  const [donationName, setDonationName] = useState('');
  const [donationType, setDonationType] = useState('');
  const [donationAmount, setDonationAmount] = useState('');
  const [donationDesc, setDonationDescription] = useState('');
  

  const handleParticipate = async () => {
    const eventDocRef = doc(database, 'Events', id); // get the event document reference
    const userDocRef = doc(database, 'Members', user.uid); // get the user document reference
  
    // Fetch the event details
    const eventDocSnap = await getDoc(eventDocRef);

    if (!eventDocSnap.exists()) {
      console.error("Event document does not exist");
      return;
    }

    const userDocSnap = await getDoc(userDocRef);
    if (!userDocSnap.exists()) {
      console.error("User document does not exist");
      return;
    }

    const userData = userDocSnap.data();
    const fullName = `${userData.firstName} ${userData.middleName} ${userData.lastName}`;

    if (participate) {
      // Add new participation record to user
      try {
        // console.log("Event name: ", eventName);

        await updateDoc(userDocRef, {
          memberParticipations: arrayUnion({
            // eventName: eventName,
            time: new Date(),
            eventID: id,
          }),
        });
      } catch (error) {
        console.error("Error updating user document: ", error);
      }

      await updateDoc(eventDocRef, {
        eventParticipants: arrayUnion({
          fullName: fullName,
          id: user.uid,
        }),
      });
  
      // Add user to event participants
      await updateDoc(userDocRef, {
        memberParticipations: arrayUnion({
          // eventName: eventName,
          time: new Date(),
          eventID: id,
        }),
      });
    }

  
    if (donate) {

      console.log("Adding donation record: ", {
        // eventName: eventName,
        name: donationName,
        type: donationType,
        description: donationDesc,
        amount: donationType === 'Monetary' || donationType === 'Both' ? donationAmount : 0,
      });
      

      // Add new donation record to user
      await updateDoc(userDocRef, {
        memberDonations: arrayUnion({
          name: donationName,
          type: donationType,
          description: donationDesc,
          amount: donationType === 'Monetary' || donationType === 'Both' ? donationAmount : 0,
        }),
      });
  
      // Add donation to event donations
      await updateDoc(eventDocRef, {
        eventDonations: arrayUnion({
          name: donationName,
          type: donationType,
          description: donationDesc,
          amount: donationType === 'Monetary' || donationType === 'Both' ? donationAmount : 0,
        }),
      });
    }
  
    // Navigate back or to another page
    navigate(-1);
  };

  return (
    <div className="EventParticipation" id="pageWithoutNF">
      <LogoContainer />

      <div id="NoNFOuterContainer">
        
        <Button variant="ghost" size="lg" onClick={() => navigate(-1)} className='back'>
          <MdArrowBack size="2em"/>
        </Button>
        <br/>

        <div className='ediv'>
        <h1 className='title'>Event Participation</h1>
        <div className='bt'>
        <Checkbox isChecked={participate} onChange={(e) => setParticipate(e.target.checked)}>
          I would like to participate in this event
        </Checkbox>
        <br/>
        <Checkbox isChecked={donate} onChange={(e) => setDonate(e.target.checked)}>
          I would like to donate to this event
        </Checkbox>
        </div>
        <br/>
        <br/>
        <br/>
        <br/>
        {donate && (
          <>
            <label>Donation Name</label>
            <Input value={donationName} onChange={(e) => setDonationName(e.target.value)} />

            <label>Donation Type</label>
            <Select value={donationType} onChange={(e) => setDonationType(e.target.value)}>
              <option value="Monetary">Monetary</option>
              <option value="Non-monetary">Non-monetary</option>
              <option value="Both">Both</option>
            </Select>

            {(donationType === 'Monetary' || donationType === 'Both') && (
              <>
                <label>Monetary Amount</label>
                <Input type="number" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
              </>
            )}

            <label>Donation Description</label>
            <Textarea value={donationDesc} onChange={(e) => setDonationDescription(e.target.value)} />
          </>
        )}
        <br/>
        <Button onClick={handleParticipate} className='partButton'>Participate</Button>
        </div>
      </div>
    </div>
  );
}

export default EventParticipation;