import { useState } from 'react';
import { Navbar, Nav, NavDropdown, Modal, Button } from 'react-bootstrap';


type Props = {
  handleSearch: () => Promise<void>;
  handlePersonal: () => void;
  activeTab: string;
};

const MyNavbar = ({ handleSearch, handlePersonal, activeTab }: Props) => {
  //para Contacts 
  const [showModal, setShowModal] = useState(false);
  const [modalImage, setModalImage] = useState("");
  //para Sobre nosotros
  const [showAboutModal, setShowAboutModal] = useState(false);
  //para Rutas y Horarios
  const [showRutasModal, setShowRutasModal] = useState(false);
  // para Tarifas
  const [showTarifasModal, setShowTarifasModal] = useState(false);

  //para Contacts
  const handleCloseModal = () => setShowModal(false);
  //para Sobre nosotros
  const handleCloseAboutModal = () => setShowAboutModal(false);
  //para Rutas y horarios
  const handleCloseAboutRutas = () => setShowRutasModal(false);
  //para Tarifas
  const handleCloseAboutTarifas = () => setShowTarifasModal(false);

  //para contactanos
  const handleShowModal = (image: string) => {
    setModalImage(image);
    setShowModal(true);
  };

  //para Sobre nosotros
  const handleShowAboutModal = () => setShowAboutModal(true); 
  //para Rutas y Horarios
  const handleShowRutasModal = () => setShowRutasModal(true);
  // para Tarifas
  const handleShowTarifasModal = () => setShowTarifasModal(true);

  //Para ACTUALIZAR LA FECHA
  const fechaActual = new Date().toLocaleDateString('es-ES');

  return (
    <>
      <Navbar bg="Dark" expand="lg">
        <Navbar.Brand href="#home"><img src="/logobus.png" alt="foto logo" width={400} height={400} style={{width: "400px", height: "300px"}}></img></Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="mr-auto" activeKey={activeTab} style={{ backgroundColor: '#3C6E71', color: 'white', padding: '10px', letterSpacing: '10px', fontSize: '8px', borderRadius: '5px' }}>
            <Nav.Link onClick={handleShowTarifasModal} style={{ fontSize: '20px', color: 'white', marginRight: '20px' }}>
              Rates
            </Nav.Link>
            <Nav.Link  onClick={handleShowRutasModal} style={{ fontSize: '20px', color: 'white', marginRight: '20px' }}>
              Routes&schedules
            </Nav.Link>
            <Nav.Link onClick={handleShowAboutModal} style={{ fontSize: '20px', color: 'white', marginRight: '20px' }}>
              About us
            </Nav.Link>
            <Nav.Link href="#" onClick={() => handleShowModal("/contactus.png")} style={{ fontSize: '20px', color: 'white', marginRight: '20px' }}>
              Contact us
            </Nav.Link>
          </Nav>
        </Navbar.Collapse>
      </Navbar>
      {/*modal primero Contacts*/}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header closeButton>
        <h1 style={{ 
          backgroundColor: '#3C6E71',
          color: 'white', 
          padding: '5px', 
          borderRadius: '5px', 
          boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
          textAlign: 'center', 
          fontSize: '1.5em', 
          fontFamily: 'Arial, sans-serif'
        }}>Contactenos</h1>
      </Modal.Header>
      <Modal.Body>
        <div>
          <h1 style={{ fontSize: '1.5em' }}>Bienvenido a nuestra empresa de autobuses</h1>
          <p>Ofrecemos viajes cómodos y seguros a destinos populares.</p>
          <img src="/bus.png" alt="Imagen de un autobús moderno" style={{ maxWidth: '100%' }} />
          <p>Puede contactarnos a través de:</p>
          <ul>
            <li>Teléfono: 27301867</li>
            <li>Correo electrónico: info@empresa-autobuses.com</li>
          </ul>
        </div>
      </Modal.Body>
    </Modal>

    {/*Segundo Modal para Sobre nosotros*/}
    <Modal show={showAboutModal} onHide={handleCloseAboutModal} size="lg" centered>
  <Modal.Header closeButton>
    <h1 style={{ 
      backgroundColor: '#3C6E71',
      color: 'white', 
      padding: '5px', 
      borderRadius: '5px', 
      boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
      textAlign: 'center', 
      fontSize: '1.5em', 
      fontFamily: 'Arial, sans-serif'
    }}>SSobre nosotros</h1>
  </Modal.Header>
  <Modal.Body>
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <h1 style={{ fontSize: '1.5em', textAlign: 'center' }}>Somos una empresa encargada de brindar un excelente servicio</h1>
      <img src="/bus2.png" alt="Imagen de un autobús moderno" style={{ maxWidth: '100%', maxHeight: '80vh' }} />
      <table style={{ 
        border: '1px solid #ccc', 
        borderCollapse: 'collapse',
        width: '100%',
        maxWidth: '100%',
        margin: '20px 0',
        backgroundColor: '#008B8B',
        color: '#fff',
      }}>
        <thead style={{ textAlign: 'center' }}>
          <tr>
            <th style={{ padding: '10px' }}>Mision</th>
            <th style={{ padding: '10px' }}>Visión</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Proporcionar un servicio de transporte seguro, confiable y eficiente a nuestros clientes</td>
            <td style={{ padding: '10px', borderBottom: '1px solid #ccc' }}>Ser líderes en el mercado de transporte de pasajeros, brindando una experiencia única y satisfactoria a nuestros clientes</td>
          </tr>
        </tbody>
      </table>
    </div>
  </Modal.Body>
</Modal>

   

    {/*Modal para Rutas y Horarios*/}
    
    <Modal show={showRutasModal} onHide={handleCloseAboutRutas} size="lg" centered>
    <Modal.Header closeButton>
      <h1 style={{ 
        backgroundColor: '#3C6E71',
        color: 'white', 
        padding: '5px', 
        borderRadius: '5px', 
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
        textAlign: 'center', 
        fontSize: '1.5em', 
        fontFamily: 'Arial, sans-serif'
      }}>Rutas y Horarios</h1>
    </Modal.Header>
    <Modal.Body>
    <h1 style={{ fontSize: '1.5em', textAlign: 'center' }}>Tabla detallada de las Rutas y sus Horarios</h1>
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f1e8dc', borderRadius: '5px', marginBottom: '20px', overflowX: 'auto' }}>
      <thead>
        <tr style={{ backgroundColor: '#3C6E71', color: 'white' }}>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Ruta</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Fecha</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Hora</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '12px 8px' }}>Origen - Destino</td>
          <td style={{ padding: '12px 8px' }}>{fechaActual}</td>
          <td style={{ padding: '12px 8px' }}>HH:MM</td>
        </tr> 
        <tr>
          <td style={{ padding: '12px 8px' }}>Origen - Destino</td>
          <td style={{ padding: '12px 8px' }}>{fechaActual}</td>
          <td style={{ padding: '12px 8px' }}>HH:MM</td>
        </tr>
        <tr>
          <td style={{ padding: '12px 8px' }}>Origen - Destino</td>
          <td style={{ padding: '12px 8px' }}>{fechaActual}</td>
          <td style={{ padding: '12px 8px' }}>HH:MM</td>
        </tr>
      </tbody>
    </table>
    </Modal.Body>
    </Modal>

    {/*Modal para tarifa*/}

    <Modal show={showTarifasModal} onHide={handleCloseAboutTarifas} size="lg" centered>
    <Modal.Header closeButton>
      <h1 style={{ 
        backgroundColor: '#3C6E71',
        color: 'white', 
        padding: '5px', 
        borderRadius: '5px', 
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
        textAlign: 'center', 
        fontSize: '1.5em', 
        fontFamily: 'Arial, sans-serif'
      }}>Tarifas</h1>
    </Modal.Header>
    <Modal.Body>
    <h1 style={{ fontSize: '1.5em', textAlign: 'center' }}>Tabla detallada de las Tarifas</h1>
    <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f1e8dc', borderRadius: '5px', marginBottom: '20px', overflowX: 'auto' }}>
      <thead>
        <tr style={{ backgroundColor: '#3C6E71', color: 'white' }}>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Ruta</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Tarifa</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td style={{ padding: '12px 8px' }}>Origen - Destino</td>
          <td style={{ padding: '12px 8px' }}>₡5000</td>
        </tr>
        <tr>
          <td style={{ padding: '12px 8px' }}>Origen - Destino</td>
          <td style={{ padding: '12px 8px' }}>₡1500</td>
        </tr>
        <tr>
          <td style={{ padding: '12px 8px' }}>Origen - Destino</td>
          <td style={{ padding: '12px 8px' }}>₡4000</td>
        </tr>
      </tbody>
    </table>
    </Modal.Body>
    </Modal>

    </>
  );
};

export default MyNavbar;