import { useEffect , useState} from 'react';
import { useNavigate } from 'react-router-dom';
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { collection, doc, getDoc, addDoc } from 'firebase/firestore';
import { database } from '../../../backend/firebase-config';

import LogoContainer from '../../logocontainer/LogoContainer';
import { MdArrowBack } from "react-icons/md";
import { Button, Textarea, Input, FormControl } from '@chakra-ui/react';

import './CreateEvent-styles.css';

function CreateEvent() {
  const navigate = useNavigate();
  const auth = getAuth();

  const [eventName, setEventName] = useState("");
  const [eventDate, setEventDate] = useState("");
  const [timeStart, setTimeStart] = useState("");
  const [timeEnd, setTimeEnd] = useState("");
  const [venue, setVenue] = useState("");
  const [desc, setDesc] = useState("");
  const [isEventCreated, setIsEventCreated] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const fetchUserData = async () => {
          const userDocRef = doc(collection(database, 'Members'), user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (!userData.admin) {
              navigate('/home');
            }
          } else {
            console.log('No such document!');
          }
        };
        fetchUserData();
      } else {
        console.log('User is not logged in');
        navigate(-1); 
      }
    });
    return () => unsubscribe();
  }, []);

  const handleEventCreation = async () => {
    const eventData = {
      eventName,
      eventDate,
      eventTimeStart: timeStart,
      eventTimeEnd: timeEnd,
      eventVenue: venue,
      eventDesc: desc,
      eventDonations: [], // Initialize as empty array
      eventParticipants: [], // Initialize as empty array
    };
  
    try {
      const docRef = await addDoc(collection(database, "Events"), eventData);
      console.log("Document written with ID: ", docRef.id);
      setIsEventCreated(true); // Set isEventCreated to true
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };


// In the return statement, conditionally render the form or the success message
return (
  <div className="CreateEvent" id="pageWithoutNF">
    <LogoContainer />

    <div id="NoNFOuterContainer">
      <Button variant="ghost" size="lg" 
        animation="floatUp 1s ease-out"
        alignSelf="flex-start"
        onClick={() => navigate(-1)}>
        <MdArrowBack size="2em"/>
      </Button>

      <div className="CreateEventContainer">
        {isEventCreated ? (
          <div>
            <p>Event Created!</p>
            <Button onClick={() => navigate('/event-list')}>View the Event List</Button>
          </div>
        ) : (
          <div className="CreateEventForm">
          <p className="CreateFormTitle">Create an Event</p>

            <FormControl className="myFormControl">
              <p>Event Name:</p>
              <Input name="eventName" type="text" 
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={(e) => setEventName(e.target.value)}/>
              </FormControl>

            <div className="DateTimeContainer">
            <FormControl className="myFormControl">
              <p>Date:</p>
              <Input name="eventDate" type="date"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={(e) => setEventDate(e.target.value)}/>
                </FormControl>

            <FormControl className="myFormControl">
              <p>From:</p>
              <Input name="eventTimeStart" type="time"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={(e) => setTimeStart(e.target.value)}/>
                </FormControl>

            <FormControl className="myFormControl">
              <p>To:</p>
              <Input name="eventTimeEnd" type="time"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={(e) => setTimeEnd(e.target.value)}/>
                </FormControl>
            </div>

            <FormControl className="myFormControl">
              <p>Venue:</p>
              <Input name="eventVenue" type="text"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={(e) => setVenue(e.target.value)}/>
            </FormControl>

            <FormControl className="myFormControl">
              <p>Description:</p>
              <Textarea name="eventDesc" type="text" resize="none"
                sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                onChange={(e) => setDesc(e.target.value)}/>
            </FormControl>

            <Button mt={4} type="button"
              backgroundColor="#073a87"
              borderRadius="0px"
              color="white"
              minW="120"
              fontWeight="400"
              onClick={() => handleEventCreation()}>
              Create Event
            </Button>
            </div>
        )}
      </div>
    </div>
  </div>
  );
}

export default CreateEvent;