import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { database } from '../../../backend/firebase-config'; // import your Firestore instance
import { Button } from '@chakra-ui/react';
import { MdArrowBack } from "react-icons/md";
import { useNavigate } from 'react-router-dom';
import { FIREBASE_AUTH } from '../../../backend/firebase-config'; // import your Firebase auth instance

import './Event-styles.css';

function EventPage() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const navigation = useNavigate();
  const [isAdmin, setIsAdmin] = useState(false);
  const auth = FIREBASE_AUTH;

  useEffect(() => {
    const fetchUser = async () => {
      const user = auth.currentUser;
      if (user) {
        const userDocRef = doc(database, 'Members', user.uid);
        const userDoc = await getDoc(userDocRef);
        if (userDoc.exists()) {
          setIsAdmin(userDoc.data().admin);
        }
      }
    };
    fetchUser();
  }, []);

  useEffect(() => {
    const fetchEvent = async () => {
      const eventDocRef = doc(database, 'Events', id);
      const eventDoc = await getDoc(eventDocRef);
      if (eventDoc.exists()) {
        console.log("Event name: ", eventDoc.data().eventName); // Print the event name
        setEvent({ id: eventDoc.id, ...eventDoc.data() });
      } else {
        console.log('No such document!');
      }
    };
    fetchEvent();
  }, [id]);

  if (!event) {
    return <div>Loading...</div>;
  }

  return (
    <div className="EventPage" id="pageWithNF">
      <div id ="blueHeader">
        <h1>{event.eventName}</h1>
      </div>
      <div className="EPOuterContainer">
        <Button variant="ghost" size="lg" 
            alignSelf="flex-start"
            mb={5}
            onClick={() => navigation(-1)}>
            <MdArrowBack size="2em"/>
        </Button>
        <div className = "EPDetailsContainer">
          <div className="EPButtonContainer">
            <button className = "EPButtonStyle"
            onClick={() => navigation(`/event-participation/${id}`, { eventName: event.eventName })}>
            Participate
            </button>
          </div>
          <div className="EventDetails">
            <label>Date</label>
            <p>{event.eventDate}</p>
          </div>
          <hr />
          <div className="EventDetails">
            <label>Est. Time</label>
            <p>{event.eventTimeStart} - {event.eventTimeEnd}</p>
          </div>
          <hr />
          <div className="EventDetails">
            <label>Venue</label>
            <p>{event.eventVenue}</p> 
          </div>
          <hr />
          <div className="EventDetailsMultiline">
            <label>Description</label>
            <p>{event.eventDesc}</p>
          </div>
          <hr />
        </div>
      </div>
    </div>
  );
}

export default EventPage;