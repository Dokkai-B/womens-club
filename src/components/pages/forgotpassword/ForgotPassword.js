import { FormControl } from '@chakra-ui/react';
import { Input } from '@chakra-ui/react';
import { getAuth } from 'firebase/auth';
import { sendPasswordResetEmail } from 'firebase/auth';

import { useNavigate } from 'react-router-dom';
// import LogoContainer from '../../logocontainer/LogoContainer';
import { MdArrowBack } from "react-icons/md";
import { Button } from '@chakra-ui/react';
import { useState } from 'react';

import './ForgotPassword-styles.css';

function ForgotPassword() {
  const navigation = useNavigate();

  const [emailFP, setEmailFP] = useState('');
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (event) => {
    // event.preventDefault();
    const auth = getAuth();
    console.log(emailFP);
    try {
      await sendPasswordResetEmail(auth, emailFP);
      console.log('Password reset email sent');
      setEmailSent(true);
      // navigate to another page or show a success message
    } catch (error) {
      console.error(error);
      // handle the error, for example show an error message
    }
  };

  return (
    <div className="ForgotPassword" id="pageWithoutNF">
      <div className="FPLogoContainer">
        <img src="/fullLogo.png" alt="Full Logo" />
      </div>

      <div id="NoNFOuterContainer">
        <Button variant="ghost" size="lg" 
          alignSelf="flex-start"
          animation="floatUp 1.5s ease-out"
          onClick={() => navigation('/')}>
          <MdArrowBack size="2em"/>
        </Button>

        
        <form className="ForgotPasswordFormContainer">
          {!emailSent ? (
          <div>
          <p id="InputFormTitle">Forgot Your Password?</p>
          
            <p>Enter your email and we will send you instructions to reset your password.</p>

            <div className="InputContainer">
              <FormControl id="email">
                <Input name="emailFP" type="email" placeholder="Email"
                  sx={{ borderColor: '#B5AFAF', borderRadius: '0px' }}
                  onChange={(event) => setEmailFP(event.target.value)}/>
              </FormControl>
            </div>

            <Button mt={4} type="button"
              backgroundColor="#9C6A3D"
              variant="unstyled"
              fontSize="16"
              alignSelf="flex-start"
              fontWeight="300"
              width="100%"
              color="white"
              borderRadius="0px"
              onClick={handleSubmit}>
              Submit
            </Button>
          </div>
          ) : (
            <div className="EmailSentMessage">
              <p id="InputFormTitle">Email sent!</p>
              <p>Check your email for further instructions.</p>
            </div>
          )}
        </form>
        
          
      </div>
    </div>
  );
}

export default ForgotPassword;