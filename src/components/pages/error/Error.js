import { useNavigate } from 'react-router-dom';

import { Button } from '@chakra-ui/react';
import './Error-styles.css';

function Error() {
  const navigation = useNavigate();
  return (
    <div className="Error" id="pageWithNF">
      <div className="PageBanner">
        <p>404</p>
      </div>
      <div className="PageContent">
        <h1>Page Not Found</h1>
        <p>We could just leave you here, but here's a link to look at:</p>
        <Button type="button"
            color="white"
            background="#073A87"
            fontSize="16"
            alignSelf="flex-start"
            marginTop="3vh"
            marginBottom="3vh"
            marginLeft="5px"
            fontWeight="400"
            borderRadius="5px"
            width="120px"
            onClick={() => navigation('/home')}>
            Home
          </Button>
          <p>If you're convinced this page should be here.  
          <a href="mailto: CHANGEEMAIL@gmail.com"> Please contact the admin here.</a>
          </p>
      </div>
    </div>
  );
}

export default Error;