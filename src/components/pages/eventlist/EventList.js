import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { FormControl, Input, Select, Button } from '@chakra-ui/react';
import { MdArrowDropDown } from 'react-icons/md';

import { collection, onSnapshot } from 'firebase/firestore';
import { database } from '../../../backend/firebase-config';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import moment from 'moment';

import './EventList-styles.css';

function EventList() {
  const navigate = useNavigate();
  const [events, setEvents] = useState([]);
  const [search, setSearch] = useState(''); 
  const [filteredEvents, setFilteredEvents] = useState([]);
  const [sortOrder, setSortOrder] = useState('ascending');
  const [filterYear, setFilterYear] = useState('all');
  const [filterLocation, setFilterLocation] = useState('all');
  const [isAdmin, setIsAdmin] = useState(false);

  // check if user is an admin
  useEffect(() => {
    const fetchUserData = async () => {
      const auth = getAuth();
      const currentUser = auth.currentUser;

      if (currentUser) {
        const userDocRef = doc(database, 'Members', currentUser.uid);
        const userDoc = await getDoc(userDocRef);

        if (userDoc.exists()) {
          const userData = userDoc.data();
          setIsAdmin(userData.admin);
        } else {
          console.log('No such document!');
        }
      } else {
        console.log('User is not logged in');
      }
    };

    fetchUserData();
  }, []);

  const handleSortChange = (e) => {
    setSortOrder(e.target.value);
  }

  const handleYearChange = (e) => {
    setFilterYear(e.target.value);
  }

  const handleLocationChange = (e) => {
    setFilterLocation(e.target.value);
  }

  const years = [...new Set(events.map(event => new Date(event.eventDate).getFullYear()))];

  const locations = [...new Set(events.map(event => event.eventVenue))];


  const fetchEvents = () => {
    return onSnapshot(collection(database, 'Events'), (snapshot) => {
      const fetchedEvents = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
        status: getStatus(doc.data().eventDate),
      }));
      setEvents(fetchedEvents);
    });
  };

  useEffect(() => {
    const unsubscribe = fetchEvents();
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const handleSearch = () => {
      let results = events;
      if (search !== '') {
        results = events.filter(event => 
          event.eventName.toLowerCase().includes(search.toLowerCase())
        );
      }

      // Filter the results based on filterYear
      if (filterYear !== 'all') {
        results = results.filter(event => 
          new Date(event.eventDate).getFullYear().toString() === filterYear
        );
      }

      // Sort the results based on sortOrder
      results.sort((a, b) => {
        const dateA = new Date(a.eventDate);
        const dateB = new Date(b.eventDate);
        return sortOrder === 'ascending' ? dateA - dateB : dateB - dateA;
      });

            // Filter the results based on filterLocation
            if (filterLocation !== 'all') {
              results = results.filter(event => event.eventVenue === filterLocation);
            }

      setFilteredEvents(results);
    }
    handleSearch();
  }, [search, events, sortOrder, filterYear, filterLocation]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  const getStatus = (eventDate) => {
    const currentDate = moment();
    const dateOfEvent = moment(eventDate);

    if (currentDate.isBefore(dateOfEvent, 'day')) {
      return 'Upcoming';
    } else if (currentDate.isSame(dateOfEvent, 'day')) {
      return 'Ongoing';
    } else {
      return 'Completed';
    }
  };

  return (
    <div className="EventList" id="pageWithNF">
      <div id ="blueHeader">
        <h1>EVENT LIST</h1>
      </div>
      <div>
        <div className = "EventsContainer">
          <div className="filterOptionsContainer">
            <FormControl id="searchEvent">
              <Input type="text" 
                placeholder="Search for Event" 
                value={search}
                onChange={handleSearchChange}/>
            </FormControl>

            <FormControl className="sortEvent">
                <p>Sort Date:</p>
                <Select icon={<MdArrowDropDown />}
                  value={sortOrder}
                  onChange={handleSortChange}>
                  <option value="ascending">Ascending</option>
                  <option value="descending">Descending</option>
                </Select>
            </FormControl>

            <FormControl className="filterEvent">
              <p>Year:</p>
              <Select icon={<MdArrowDropDown />}
                value={filterYear}
                onChange={handleYearChange}>
                <option value="all">All</option>
                {years.map(year => <option key={year} value={year}>{year}</option>)}
              </Select>
            </FormControl>

            <FormControl id="filterEventByLoc">
              <Select icon={<MdArrowDropDown />}
                value={filterLocation}
                onChange={handleLocationChange}>
                <option value="all">All Locations</option>
                {locations.map(location => <option key={location} value={location}>{location}</option>)}
              </Select>
            </FormControl>

            {isAdmin && (
              <Button className="ELCreateEvent" 
                      variant="unstyled"
                      color="white"
                      padding="auto"
                      marginLeft="auto"
                      background="#073a87"
                      onClick={() => navigate('/create-event')}>
                      Create Event
              </Button>
            )}
          </div>

          <div className="EventTitleContainer">
            <p>Event Name</p>
            <p>Event Date</p>
            <p>Status</p>
            <p>Link</p>
          </div>
          {filteredEvents.length > 0 ? (
            filteredEvents.map((event) => (
              <div className="EventDetailsContainer" key={event.id}>
                <p>{event.eventName}</p>
                <p>{moment(event.eventDate).format('MMMM DD, YYYY')}</p> {/* Updated line */}
                <p>{event.status}</p>
                <button onClick={() => navigate(`/event-pages/${event.id}`)}>View Event</button>
              </div>
            ))
          ) : (
            <p>No such events found</p>
          )}
        </div>  
      </div>
    </div>
  );
}

export default EventList;