import { useRef } from "react";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { getAuth } from "firebase/auth"; // import auth module
import { database } from "../../../backend/firebase-config"; // import database object
import './UserProfile-styles.css';
import { useEffect, useState } from 'react'; // import useEffect and useState hooks
import { Input } from "@chakra-ui/react";
import { useParams } from 'react-router-dom';

function capitalizeEachWord(string) {
  return string.split(' ').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(' ');
}

function UserProfile() {
  const { id } = useParams()
  const [userDetails, setUserDetails] = useState([]); // state to store user details
  const [editMode, setEditMode] = useState(false); // state to track edit mode

  const [currentUserId, setCurrentUserId] = useState(null);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    const fetchUserDetails = async () => {
      const docRef = doc(database, "Members", id); // use id instead of user.uid
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        const { address, birthday, contactNumber, email, firstName, lastName, middleName, userImage } = data;
        setUserDetails({ address, birthday, contactNumber, email, firstName, lastName, middleName, userImage });
      } else {
        console.log("No such document!");
      }
    };
    fetchUserDetails();
  }, [id]);

  useEffect(() => {
    const fetchUserRole = async () => {
      const auth = getAuth();
      const user = auth.currentUser;
      if (user) {
        setCurrentUserId(id);
        const docRef = doc(database, "Members", id);
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          if (data.role) {
            setIsAdmin(true);
          }
        } 
      }
    };
    fetchUserRole();
  }, []);

  const handleEdit = () => {
    if (currentUserId === id || isAdmin) {
      setEditMode(true);
    }
  };

  const handleSave = async () => {
    const auth = getAuth(); // get the auth object  
    const user = auth.currentUser; // get the currently logged-in user
    if (user) { // check if user is not null
      if (!userDetails || !userDetails.userImage) {
        userDetails = { ...userDetails, userImage: "/defaultImage.jpg" };
      }
      
      const docRef = doc(database, "Members", id); 
      await setDoc(docRef, userDetails, { merge: true });
    }
    setEditMode(false);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onloadend = () => {
      setUserDetails({ ...userDetails, userImage: reader.result });
    };
    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleChange = (e) => {
    setUserDetails({ ...userDetails, [e.target.name]: e.target.value });
  };

  const fileInputRef = useRef(null);

  return (
    <div className="UserProfile" id="pageWithNF">
      <div id ="blueHeader">
        {editMode ? 
        <>
          <div className="userImageContainer" onClick={() => fileInputRef.current.click()}>
            <img 
              className="userImage" 
              src={userDetails?.userImage || '/defaultImage.jpg'} 
              alt="User" 
            />
            <img 
              className="editableImage" 
              src="/editable.png" 
              alt="Editable" 
            />
          </div>
          <Input 
            type="file" 
            accept="image/*" 
            onChange={handleImageUpload} 
            ref={fileInputRef} 
            style={{ display: 'none' }} 
          />
        </>
        :
        <img className="userImage" src={userDetails?.userImage || '/defaultImage.jpg'} alt="User" />
        }
      <h1>{userDetails?.firstName && capitalizeEachWord(userDetails.firstName)} {userDetails?.lastName && capitalizeEachWord(userDetails.lastName)}</h1>
      </div>
      <div>
        {editMode ? (
          <>
            <div className = "UserDetailsContainer">
              <div className="UPButtonContainer">
                <button className="UPButtonStyle" onClick={handleSave}>Save</button>
              </div>
                <div className="InputUserDetails">
                    <input name="firstName" value={userDetails?.firstName || ''} onChange={handleChange} />
                </div>
                <div className="InputUserDetails">
                    <input name="lastName" value={userDetails?.lastName || ''} onChange={handleChange} />
                </div>
                <div className="InputUserDetails">
                    <input name="middleName" value={userDetails?.middleName || ''} onChange={handleChange} />
                </div>
                <div className="InputUserDetails">
                    <input name="contactNumber" value={userDetails?.contactNumber || ''} onChange={handleChange} />
                </div>
                <div className="InputUserDetails">
                    <input name="address" value={userDetails?.address || ''} onChange={handleChange} />
                </div>
                <div className="InputUserDetails">
                    <input name="birthday" value={userDetails?.birthday || ''} onChange={handleChange} />
                </div>
            </div>
          </>   
        ) : (
          <>
            <div className = "UserDetailsContainer">
              <div className="UPButtonContainer">
                <button onClick={handleEdit} className = "UPButtonStyle">Edit Profile</button>
              </div>
              <div className="UserDetails">
                <label>First Name</label>
                <p>{userDetails?.firstName && capitalizeEachWord(userDetails.firstName)}</p>
              </div>
              <hr />
              <div className="UserDetails">
                <label>Last Name</label>
                <p>{userDetails?.lastName && capitalizeEachWord(userDetails.lastName)}</p>
              </div>
              <hr />
              <div className="UserDetails">
                <label>Middle Name</label>
                <p>{userDetails?.middleName && capitalizeEachWord(userDetails.middleName)}</p>
              </div>
              <hr />
              <div className="UserDetails">
                <label>Email:</label>
                <p>{userDetails?.email}</p>
              </div>
              <hr />
              <div className="UserDetails">
                <label>Contact Number</label>
                <p>{userDetails?.contactNumber}</p>
              </div>
              <hr />
              <div className="UserDetails">
                <label>Address</label>
                <p>{userDetails?.address && capitalizeEachWord(userDetails.address)}</p>
              </div>
              <hr />
              <div className="UserDetails">
                <label>Birthday</label>
                <p>{userDetails?.birthday}</p>
              </div>
              <hr />
            </div>
          </>
        )}
      </div>
    </div>
  );
}
export default UserProfile;