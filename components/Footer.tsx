import React from "react";


const Footer = () => {
  const iconStyle = {
    with: "50px",
    height: "50px",
    padding: "36px",
  };
  return (
    <footer className="d-flex justify-content-center align-items-center">
      <div className="d-flex justify-content-center align-items-center">
        <div className="text-center">
        <p style={{ color: 'black', backgroundColor: '#f1e8dc', padding: '10px', borderRadius: '5px' }}>
          © {2023} {["Universidad Nacional"]}
        </p>

          
        </div>
      </div>
    </footer>
    
  );
};

export default Footer;