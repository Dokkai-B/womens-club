import { getAuth, signOut } from 'firebase/auth';
import { collection, doc, getDoc } from 'firebase/firestore';
import { database } from '../../backend/firebase-config';
import { useEffect, useState } from 'react';
import { Box, Link as ChakraLink, Menu, MenuButton, MenuList, MenuItem, Button } from '@chakra-ui/react';
import { useParams } from 'react-router-dom';

import { MdArrowDropDown } from "react-icons/md";
import { Link } from 'react-router-dom';
import './Navbar-styles.css';

function Navbar({id}) {
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserData = async () => {
      const currentUser = auth.currentUser;
      console.log(currentUser); // log the user object
    
      if (currentUser) { // check if user is not null
        const userDocRef = doc(collection(database, "Members"), id);
        const userDoc = await getDoc(userDocRef);
        console.log(userDoc.exists()); // log if the user's document exists
    
        if (userDoc.exists()) {
          const data = userDoc.data();
          setIsAdmin(data.admin);
          console.log(data);
        } else {
          console.log("No such document!");
        }
      } else {
        console.log("User is not logged in");
      }
    };

    fetchUserData();
  }, [auth, id, database]);

  useEffect(() => {
    setUser(auth.currentUser);
  }, [auth]);

  useEffect(() => {
    var navbar = document.querySelector('.Navbar');
    var height = navbar.offsetHeight;
    document.documentElement.style.setProperty('--navbar-height', height + 'px');
  }, []);

  return (
    <Box as="nav" className="Navbar">
      <ul>
        <li>
          <ChakraLink 
            as={Link} 
            to="/home"
            _hover={{ textDecoration: 'none', color: '#8299c2' }}>Home</ChakraLink></li>
        <li>
          <Menu>
            <MenuButton as={Button} 
              rightIcon={<MdArrowDropDown />}
              variant="unstyled"
              fontWeight="400"
              _hover={{ color: '#446fb0' }} >
              Members
            </MenuButton>
            <MenuList
              minW="140px"
              borderTopLeftRadius="0px"
              borderTopRightRadius="0px"
              marginTop="2px"
            >
              <MenuItem as={Link} to={`/user-profile/${id}`} color="black">User Profile</MenuItem>
              <MenuItem as={Link} to="/member-list" color="black">Member List</MenuItem>
            </MenuList>
          </Menu>
        </li>
        <li>
          <Menu>
            <MenuButton as={Button} 
              rightIcon={<MdArrowDropDown />}
              variant="unstyled"
              fontWeight="400"
              _hover={{ color: '#446fb0' }} >
              Events
            </MenuButton>
            <MenuList
              minW="140px"
              borderTopLeftRadius="0px"
              borderTopRightRadius="0px"
              marginTop="2px"
            >
              <MenuItem as={Link} to="/event-list" color="black">Event List</MenuItem>
              
              {isAdmin && <MenuItem as={Link} to="/create-event" color="black">Create Event</MenuItem>}
              {/* Temporarily here pero should not be here when in 'production' na */}
              {/* <MenuItem as={Link} to="/event-participation" color="black">Event Participation</MenuItem> */}
              {/* <MenuItem as={Link} to="/event-pages" color="black">Event Pages</MenuItem> */}
            </MenuList>
          </Menu>
        </li>
        <li>
        <ChakraLink 
  as="button" 
  onClick={() => {
    const auth = getAuth();
    signOut(auth).then(() => {
      // Sign-out successful.
    }).catch((error) => {
      // An error happened.
      console.error("Error during sign out:", error);
    });
  }}
  _hover={{ textDecoration: 'none', color: '#8299c2' }}>Logout</ChakraLink>
        </li>
      </ul>
    </Box>
  );
}

export default Navbar;

// import './Navbar-styles.css';
// import { Link } from "react-router-dom";

// function Navbar() {
//   return (
//     <div className="Navbar">
//       <ul>
//         <li><Link to="/" className="link">Home</Link></li>
//         <li><Link to="/login" className="link">Login</Link></li>
//         <li><Link to="/signup" className="link">Sign Up</Link></li>
//         <li><Link to="/forgot-password" className="link">Forgot Password</Link></li>
//         <li><Link to="/user-profile" className="link">User Profile</Link></li>
//         <li><Link to="/member-list" className="link">Member List</Link></li>
//         <li><Link to="/event-list" className="link">Event List</Link></li>
//         <li><Link to="/event-participation" className="link">Event Participation</Link></li>
//         <li><Link to="/create-event" className="link">Create Event</Link></li>
//         <li><Link to="/event-pages" className="link">Event Pages</Link></li>
//       </ul>
//     </div>
//   );
// }

// export default Navbar;