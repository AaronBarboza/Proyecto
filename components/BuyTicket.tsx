import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import QRCode from 'qrcode.react';
//import InvoiceModal from './InvoiceModal';


function BusTicketForm() {
  /// Modal de formulario
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');

  const [showModal, setShowModal] = useState(false);
  const [showModalPay, setShowModalPay] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: 0,
    fecha: '',
    origen: '',
    destino: '',
    metodoPago: ''
  });

  const fechaActual = new Date().toLocaleDateString('es-ES');

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setShowModal(true);
  };

  const handleClose = () => {
    setShowModal(false);
  };

  const handleShowAboutPay = () => {
    setShowModal(false);
    setShowModalPay(true);
  };

  const handleCloseAboutPay = () => {
    setShowModalPay(false);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value
    }));
  };

  const handleFormSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    handleShowAboutPay();
  };

  {/*Correo*/}

  

  const handleSendEmail = () => {
    const templateParams = {
      to_email: formData.email,
      from_name: 'Nombre Remitente', // Nombre remitente del correo electrónico
      subject: 'Factura de compra', // Asunto del correo electrónico
      body: `
        Nombre: ${formData.nombre}
        Correo electrónico: ${formData.email}
        Cantidad de boletos: ${formData.cantidad}
        Fecha de viaje: ${formData.fecha}
        Origen: ${formData.origen}
        Destino: ${formData.destino}
        Método de pago: ${formData.metodoPago}
      ` // Cuerpo del correo electrónico
  };

    emailjs.send('<service_xbiqwg6>', '<plantilla_n2hof0i>', templateParams, '<RWxLClg-me91RdSat>')
      .then((response) => {
        console.log('Correo electrónico enviado con éxito:', response);
        // Aquí puedes mostrar una notificación de éxito o realizar otras acciones después de enviar el correo electrónico
      })
      .catch((error) => {
        console.error('Error al enviar el correo electrónico:', error);
        // Aquí puedes mostrar una notificación de error o realizar otras acciones en caso de error
      });
  };
  
  {/*QR*/}

  let qrCodeData = JSON.stringify(formData);

  const ModalComponent = () => {
    const [showModal, setShowModal] = useState(false);
    const [qrCodeData, setQRCodeData] = useState('');
    const [formData, setFormData] = useState({
      nombre: '',
      email: '',
      cantidad: 0,
      fecha: '',
      origen: '',
      destino: '',
      metodoPago: ''
    });
  
    const handleShowModal = () => {
      const qrCodeData = JSON.stringify(formData);
      setQRCodeData(qrCodeData);
      setShowModal(true);
    };
  
    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const { name, value } = e.target;
      setFormData((prevFormData) => ({
        ...prevFormData,
        [name]: value
      }));
    };

  }

  return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '1500px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
    
          <label htmlFor="origin" style={{marginLeft: "20px" }}>Origen:</label>
          <input
          type="text"
          id="origin"
          value={origin}
          onChange={(e) => setOrigin(e.target.value)}
          style={{ 
          width: '300px',
          height: "40px",
          backgroundColor: '#3C6E71',
          color: 'white',
          borderRadius: '5px'
        }}
        />

        <label htmlFor="destination" style={{ marginLeft: "20px" }}>Destino:</label>
        <input
          type="text"
          id="destination"
          value={destination}
          onChange={(e) => setDestination(e.target.value)}
          style={{ 
            width: '300px',
            height: "40px",
            backgroundColor: '#3C6E71',
            color: 'white', 
            borderRadius: '5px',
            marginLeft: "10px"
          }}
        />

        <label htmlFor="date" style={{ marginLeft: "20px" }}>Fecha:</label>
        <input
          type="date"
          id="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          style={{ 
            width: '300px',
            height: "40px",
            backgroundColor: '#3C6E71',
            color: 'white', 
            borderRadius: '5px',
            marginLeft: "10px"
          }}
        />
      </div>


      <br></br>
      <br></br>

      <table style={{ width: '100%', borderCollapse: 'collapse', backgroundColor: '#f1e8dc', borderRadius: '5px', marginBottom: '20px', overflowX: 'auto' }}>
      <thead>
        <tr style={{ backgroundColor: '#3C6E71', color: 'white' }}>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Ruta</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Tarifa</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Fecha</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Hora</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td style={{ padding: '12px 8px' }}>Ciudad Neily-San José</td>
          <td style={{ padding: '12px 8px' }}>₡5000</td>
          <td style={{ padding: '12px 8px' }}>{fechaActual}</td>
          <td style={{ padding: '12px 8px' }}>HH:MM</td>
        </tr>
        <tr>
          <td style={{ padding: '12px 8px' }}>Paso Canoas-San José</td>
          <td style={{ padding: '12px 8px' }}>₡9.889</td>
          <td style={{ padding: '12px 8px' }}>{fechaActual}</td>
          <td style={{ padding: '12px 8px' }}>HH:MM</td>
        </tr>
        <tr>
          <td style={{ padding: '12px 8px' }}>Perez Zeledon - San jose</td>
          <td style={{ padding: '12px 8px' }}>₡4000</td>
          <td style={{ padding: '12px 8px' }}>{fechaActual}</td>
          <td style={{ padding: '12px 8px' }}>HH:MM</td>
        </tr>
      </tbody>
          </table>

      {/*Boton de comprar Boletos*/}

      <Button type="submit" style={{ 
        backgroundColor: "#3C6E71", 
        borderRadius: '5px',
        color: 'white',
        fontSize: '1.2em',
        width: '100%',
        height: '45px',
        cursor: 'pointer'
      }}>
        Comprar boleto
      </Button>

      <Modal show={showModal} onHide={handleClose}>
        {/* Contenido del modal */}
        <Modal.Header>
        <h1 style={{ 
              backgroundColor: '#3C6E71',
              color: 'white', 
              padding: '5px', 
              borderRadius: '5px', 
              boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
              textAlign: 'center', 
              fontSize: '1.5em', 
              fontFamily: 'Arial, sans-serif'
            }}>Validaremos tus Datos</h1>
        </Modal.Header>
        <Modal.Body>
    <form>
      <div className="form-group">
        <label htmlFor="nombre" style={{ color: '#3C6E71' }}>
          Nombre:
        </label>
        <input
          type="text"
          className="form-control"
          id="nombre"
          name="nombre"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="email" style={{ color: '#3C6E71' }}>
          Correo electrónico:
        </label>
        <input
          type="email"
          className="form-control"
          id="email"
          name="email"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="cantidad" style={{ color: '#3C6E71' }}>
          Cantidad de boletos:
        </label>
        <input
          type="number"
          className="form-control"
          id="cantidad"
          name="cantidad"
          min="0" // Establece el mínimo valor a 0
          max="10" // Establece el máximo valor a 10
          required
          onChange={handleInputChange}
        />
      </div>


      <div className="form-group">
        <label htmlFor="fecha" style={{ color: '#3C6E71' }}>
          Fecha de viaje:
        </label>
        <input
          type="date"
          className="form-control"
          id="fecha"
          name="fecha"
          required
          onChange={handleInputChange}
        />
      </div>

      <div className="form-group">
        <label htmlFor="origen" style={{ color: '#3C6E71' }}>
          Origen:
        </label>
        <input
          type="text"
          className="form-control"
          id="origen"
          name="origen"
          required
          onChange={handleInputChange}
        />
      </div>
      <div className="form-group">
        <label htmlFor="destino" style={{ color: '#3C6E71' }}>
          Destino:
        </label>
        <input
          type="text"
          className="form-control"
          id="destino"
          name="destino"
          required
          onChange={handleInputChange}
        />
      </div>
      <br/><br/>
      <h1 style={{ 
        backgroundColor: '#3C6E71',
        color: 'white', 
        padding: '5px', 
        borderRadius: '5px', 
        boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
        textAlign: 'center', 
        fontSize: '1.5em', 
        fontFamily: 'Arial, sans-serif'
      }}>Metodo de Pago</h1>
      <br/><br/>
      
      <div style={{ textAlign: 'center' }}>
      <div className="form-check form-check-inline form-check-custom">
        <input
          className="form-check-input"
          type="radio"
          name="metodoPago"
          id="paypal"
          value="paypal"
          required
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="paypal">
          PayPal
        </label>
      </div>
      <div className="form-check form-check-inline form-check-custom">
        <input
          className="form-check-input"
          type="radio"
          name="metodoPago"
          id="efectivo"
          value="efectivo"
          required
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="efectivo">
          Efectivo
        </label>
      </div>
      <div className="form-check form-check-inline form-check-custom">
        <input
          className="form-check-input"
          type="radio"
          name="metodoPago"
          id="tarjeta"
          value="tarjeta"
          required
          onChange={handleInputChange}
        />
        <label className="form-check-label" htmlFor="tarjeta">
          Tarjeta de Banco
        </label>
      </div>
    </div>

      <br/><br/>
          <div className="d-flex justify-content-center">
          <button
            type="submit"
            style={{ backgroundColor: '#3C6E71', color: 'white' }}
            className="btn btn-lg btn-primary mr-3"
            onClick={handleShowAboutPay} // Agrega el evento onClick para mostrar el Modal
          >
            Confirmar Compra
          </button>
            <button
              type="button"
              className="btn btn-lg btn-danger ml-3"
              data-dismiss="modal"
              onClick={handleClose}
              style={{ marginLeft: '10px', marginRight: '10px' }}
            >
              Cancelar
            </button>
          </div>
        </form>
      </Modal.Body>
      </Modal>

      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#3C6E71', color: 'white', borderBottom: 'none' }}>
          <Modal.Title style={{ fontSize: '2em', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            Factura
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <h1 style={{ fontSize: '2em', color: '#3C6E71', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            ¡Compra Exitosa!
          </h1>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ paddingRight: '50px' }}>
            <p>Nombre: {formData.nombre}</p>
            <p>Correo electrónico: {formData.email}</p>
            <p>Cantidad de boletos: {formData.cantidad}</p>
            <p>Fecha de viaje: {formData.fecha}</p>
            <p>Origen: {formData.origen}</p>
            <p>Destino: {formData.destino}</p>
            <p>Método de pago: {formData.metodoPago}</p> 
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '300px' }}>
            </div>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '-150px' }}>
            <QRCode value={qrCodeData} />
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button
        variant="secondary"
        onClick={handleSendEmail}
        style={{
          backgroundColor: "#f44336", //color
          color: "#fff", // tx
          border: "2px solid #f44336", // borde
          borderRadius: "4px", // Redondea bordes
          boxShadow: "0px 2px 4px rgba(0, 0, 0, 1)", //sombra
          fontSize: "20px", //tamaño
          fontWeight: "bold", //negrita
          padding: "10px 20px" 
        }}
      >
        Enviar Comprobante
      </Button>
        </Modal.Footer>
      </Modal>

    </form>
  );
}

export default BusTicketForm;
