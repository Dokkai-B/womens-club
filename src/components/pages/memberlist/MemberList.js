import React from 'react';
import { useEffect, useState } from 'react'; 
import { onAuthStateChanged, getAuth } from "firebase/auth";
import { collection, doc, getDoc, getDocs, deleteDoc } from "firebase/firestore";
import { database } from "../../../backend/firebase-config"; 
import { useNavigate } from 'react-router-dom';

import { Input, InputGroup, InputLeftElement } from '@chakra-ui/react';
import { FormControl, Button, useDisclosure } from '@chakra-ui/react'; 
import { AlertDialog, AlertDialogBody, AlertDialogFooter, AlertDialogHeader, AlertDialogContent, AlertDialogOverlay } from '@chakra-ui/react';

import { MdOutlineSearch } from "react-icons/md";

import './MemberList-styles.css';

function MemberList() {
  const navigate = useNavigate(); 
  const auth = getAuth();

  const [members, setMembers] = useState([]);
  const [isAdmin, setIsAdmin] = useState(false); 

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, user => {
      if (user) {
        const fetchUserData = async () => {
          const userDocRef = doc(collection(database, 'Members'), user.uid);
          const userDoc = await getDoc(userDocRef);
          if (userDoc.exists()) {
            const userData = userDoc.data();
            if (userData.admin) {
              setIsAdmin(true);
            } else {
              setIsAdmin(false);
            }
          } else {
            console.log('No such document!');
          }
        };
        fetchUserData();
      } else {
        console.log('User is not logged in');
        // navigate('/'); 
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const fetchMembers = async () => {
      const membersCollection = collection(database, "Members"); 
      const userSnap = await getDocs(membersCollection);

      const members = userSnap.docs
        .map(doc => ({ id: doc.id, ...doc.data() })) // map over the documents and add the document id to the data
        .filter(user => user.admin === false); // filter out the admins

      console.log(members); // print fetched members to the console
      setMembers(members); // set members
    };

    fetchMembers();
  }, []); // empty dependency array means this effect runs once on component mount
  
  // Filtering of Members
  const [search, setSearch] = useState(''); 
  const [filteredMembers, setFilteredMembers] = useState([]);

  useEffect(() => {
    const handleSearch = () => {
      if (search === '') {
        setFilteredMembers(members);
      } else {
        const results = members.filter(member => {
          const fullName = `${member.firstName.toLowerCase()} ${member.lastName.toLowerCase()}`;
          return member.firstName.toLowerCase().includes(search.toLowerCase()) ||
            member.lastName.toLowerCase().includes(search.toLowerCase()) ||
            fullName.includes(search.toLowerCase());
        });
        setFilteredMembers(results);
      }
    }
    handleSearch();
  }, [search, members]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  }

  // Deletion of Members
  const cancelRef = React.useRef();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [selectedMemberId, setSelectedMemberId] = useState('');

  const onDelete = async () => {
    const membersCollectionRef = collection(database, 'Members');
    const memberDocRef = doc(membersCollectionRef, selectedMemberId);
    
    await deleteDoc(memberDocRef);
    
    setMembers(members.filter(member => member.id !== selectedMemberId));
    onClose();
  };

  return (
    <div className="MemberList" id="pageWithNF">
      <div id ="blueHeader">
        <h1>MEMBER LIST</h1>
      </div>
      <div className="MLContainer">
        <div className="filterMLOptionsContainer">
          <FormControl id="searchMember">
            <InputGroup>
              <InputLeftElement children={<MdOutlineSearch />} />
              <Input type="search" 
                placeholder="Search Members" 
                value = {search}
                onChange={handleSearchChange}/>
              
            </InputGroup>
          </FormControl>

            {isAdmin &&
            <div className="MLadminButtons1">
              <Button className="MLPendingMembers" 
                // variant="unstyled"
                color="white"
                width="auto"
                padding="auto"
                marginRight="0.5vw"
                marginLeft="auto"
                background="#073a87"
                fontWeight="400"
                onClick={() => navigate('/pending-members')}>
                Review Pending Members
              </Button>

              <Button className="MLPendingMembers" 
                // variant="unstyled"
                color="white"
                padding="auto"
                marginLeft="auto"
                background="#073a87"
                fontWeight="400"
                onClick={() => navigate('/add-member')}>
                Add New Members
              </Button>
            </div>
            }
        </div>

        <div className="gridContainer">
          {filteredMembers.map(member => (
            <div key={member.id} className="memberCard">
              {isAdmin &&
              <div className="MLadminButtons2">
                <Button mt={4} type="button" 
                  backgroundColor="#9c6a3d"
                  borderRadius="5px"
                  color="white"
                  marginRight="0.5vw"
                  minW="120"
                  fontWeight="400"
                  onClick={() => navigate(`/user-profile/${member.id}`)}>
                Edit
                </Button>

                <Button mt={4} type="button" 
                  backgroundColor="#a92a2a"
                  borderRadius="5px"
                  color="white"
                  minW="120"
                  fontWeight="400"
                  onClick={() => {
                    setSelectedMemberId(member.id);
                    onOpen();
                  }}>
                Delete
                </Button>

                <AlertDialog
                  isOpen={isOpen}
                  onClose={onClose}
                  motionPreset='slideInBottom'
                  leastDestructiveRef={cancelRef}
                >
                  <AlertDialogOverlay style={{ backgroundColor: 'rgba(0, 0, 0, 0.1)' }}>
                    <AlertDialogContent>
                      <AlertDialogHeader fontSize="lg" fontWeight="bold">
                        Delete Member
                      </AlertDialogHeader>

                      <AlertDialogBody>
                        Are you sure? You can't undo this action afterwards.
                      </AlertDialogBody>

                      <AlertDialogFooter>
                        <Button ref={cancelRef} onClick={onClose}>
                          Cancel
                        </Button>
                        <Button colorScheme="red" onClick={onDelete} ml={3}>
                          Delete
                        </Button>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialogOverlay>
                </AlertDialog>
              </div>
              }

              <img className="MLUserImage" src={member.userImage || '/defaultImage.jpg'} alt="User" />
              <h2>{member.firstName} {member.lastName}</h2>

            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default MemberList;