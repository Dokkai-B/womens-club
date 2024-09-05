import './Home-styles.css';

function Home() {
  return (
    <div className="Home" id="pageWithoutNF">

      <div className="HomeLogoContainer">
        <img src="/fullLogo.png" alt="Full Logo" />
      </div>
      <div id="NoNFOuterContainer">
        <p className="orgQuote">
          "We at Womens Club start where we are, use what we have, and do what we can."
        </p>
      </div>
    </div>
  );
}

export default Home;