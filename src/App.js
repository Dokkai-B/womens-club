import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { doc, getDoc, collection } from "firebase/firestore";
import { ChakraProvider } from "@chakra-ui/react";
import { useNavigate } from 'react-router-dom';
import { getAuth } from "firebase/auth";
import { database } from './backend/firebase-config';

import { useEffect, useState } from 'react';

import Navbar from './components/navbar/Navbar';
import Footer from './components/footer/Footer';
import Home from './components/pages/home/Home';
import Login from './components/pages/login/Login';
import SignUp from './components/pages/signup/SignUp';
import ForgotPassword from './components/pages/forgotpassword/ForgotPassword';
import UserProfile from './components/pages/userprofile/UserProfile';
import MemberList from './components/pages/memberlist/MemberList';
import EventList from './components/pages/eventlist/EventList';
import EventParticipation from './components/pages/eventparticipation/EventParticipation';
import CreateEvent from './components/pages/createevent/CreateEvent';
import EventPages from './components/pages/eventpage/EventPage';
import Error from './components/pages/error/Error';
import PendingMembers from './components/pages/pendingmembers/PendingMembers';
import AddMember from './components/pages/addmember/AddMember';

import './App.css';

function ProtectedRoute({ children }) {
  const navigate = useNavigate();
  const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, [auth, navigate]);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user) {
    navigate("/");
    return null;
  }

  return children;
}

function Main() {
  const navigate = useNavigate();
  const auth = getAuth();

  const location = useLocation();
  const hideForPages = [
    '/', 
    '/signup', 
    '/forgot-password',
    '/create-event',
    '/event-participation',
  ].includes(location.pathname);

  const hideFooterForPages = [
    '/', 
    '/signup', 
    '/forgot-password',
    '/create-event',
    '/event-participation',
    '/home',
  ].includes(location.pathname);

  // const auth = getAuth();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // this useEffect hook is used to set the CSS variable of --navbar-height
  useEffect(() => {
    setLoading(true); // Set loading state to true
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        if (auth.currentUser) { // Check if the user is logged in
          const docRef = doc(collection(database, "Members"), auth.currentUser.uid);
          const docSnap = await getDoc(docRef);
    
          if (docSnap.exists()) {
            setUser(user);
          }
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });
    
    return unsubscribe;
  }, [auth, navigate]);

  return (
    <div className="Main">
      {!hideForPages && user && <Navbar id={user.uid}/>}
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/home" element={<ProtectedRoute user={user}><Home /></ProtectedRoute>} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/user-profile/:id" element={<ProtectedRoute user={user}><UserProfile /></ProtectedRoute>} />
        <Route path="/member-list" element={<ProtectedRoute user={user}><MemberList /></ProtectedRoute>} />
        <Route path="/event-list" element={<ProtectedRoute user={user}><EventList /></ProtectedRoute>} />
        <Route path="/event-participation/:id" element={<ProtectedRoute user={user}><EventParticipation /></ProtectedRoute>} />
        <Route path="/create-event" element={<ProtectedRoute user={user}><CreateEvent /></ProtectedRoute>} />
        <Route path="/event-pages/:id" element={<ProtectedRoute user={user}><EventPages /></ProtectedRoute>} />
        <Route path="/pending-members" element={<ProtectedRoute user={user}><PendingMembers /></ProtectedRoute>} />
        <Route path="/add-member" element={<AddMember />} />
        <Route path="*" element={<Error />} />
      </Routes>
      {!loading && !hideFooterForPages && <Footer />}
    </div>
  );
}

function App() {
  
  return (
    <ChakraProvider>
      <div className="App">
        <BrowserRouter>
          <Main />
        </BrowserRouter>
      </div>
    </ChakraProvider>
  );
}
export default App;