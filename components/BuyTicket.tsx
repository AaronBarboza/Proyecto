import React, { useState, useEffect } from 'react';
import { Modal, Button } from 'react-bootstrap';
import emailjs from 'emailjs-com';
import QRCode from 'qrcode.react';
//import InvoiceModal from './InvoiceModal';



function BusTicketForm() {
  /// Modal de formulario
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  const [date, setDate] = useState('');
  /// Modal de formulario Pago
  const [showModal, setShowModal] = useState(false);
  const [showModalPay, setShowModalPay] = useState(false);
  const [formData, setFormData] = useState({
    nombre: '',
    email: '',
    cantidad: 0,
    fecha: '',
    origen: '',
    destino: '',
    metodoPago: '',
    hora: ''
  });
  //Para ACTUALIZAR LA FECHA
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

  {/*Metodos de Pago*/}

   const handleConfirmCompra = () => {
    if (formData.metodoPago === 'paypal') {
      const paypalUrl = 'https://www.paypal.com'; // URL de PayPal
      const win = window.open(paypalUrl, '_blank');
      window.open('https://www.paypal.com', '_blank');
    } else if (formData.metodoPago === 'efectivo') {
      // Lógica para abrir ventana de efectivo
      window.open('https://www.example.com/efectivo', '_blank');
    } else if (formData.metodoPago === 'tarjeta') {
      // Lógica para abrir ventana de tarjeta de banco
      window.open('https://www.example.com/tarjeta', '_blank');
    }
  };
  
  {/*Tabla con filtro*/}

    const results = [
      {
        id: 1,
        origin: 'Ciudad Neily',
        destination: 'San Jose',
        tarifa: '₡5000',
        time: '08:00 AM'
      },
      {
        id: 2,
        origin: 'Paso Canoas',
        destination: 'San Jose',
        tarifa: '₡9.889',
        time: '07:00 AM'
      },
      {
        id: 3,
        origin: 'Perez Zeledon',
        destination: 'San Jose',
        tarifa: '₡4000',       
        time: '12:00 AM'
        },
        {
          id: 4,
          origin: 'Buenos Aires',
          destination: 'San Jose',
          tarifa: '₡7000', 
          time: '11:00 AM'
        },
        {
          id: 5,
          origin: 'Cartago',
          destination: 'San Jose',
          tarifa: '₡2000',
          time: '02:00 PM'
        },
        {
          id: 6,
          origin: 'Quepos',
          destination: 'San Jose',
          tarifa: '₡4500',
          time: '10:00 AM'
        },
      ];

      const filterResults = () => {
        if (!origin && !destination && !date) {
          return results;
        }
      
        return results.filter((result) => {
          const originMatch = origin ? result.origin.toLowerCase().includes(origin.toLowerCase()) : true;
          const destinationMatch = destination ? result.destination.toLowerCase().includes(destination.toLowerCase()) : true;
          //const dateMatch = date ? result.date === date : true;
      
          return originMatch && destinationMatch/* && dateMatch*/;
        });
      };
      
      const [HasResults, setHasResults] = useState(false);
      useEffect(() => {
        
        const filteredResults = filterResults();
        if (filteredResults.length > 0) {
          setHasResults(true);
        } else {
          setHasResults(false);
        }
      }, [origin, destination, date]);
    //Para ACTUALIZAR LA FECHA
  
    const [setFechaActual] = useState<string[]>([]);  
    //Para visualizar los asientos
    const MiniBus = () => {
      const [seats, setSeats] = useState(Array(60).fill(false)); // Array para representar el estado de los asientos
    
      const toggleSeat = (index: number) => {
        const updatedSeats = [...seats];
        updatedSeats[index] = !updatedSeats[index];
        setSeats(updatedSeats);
      };
    }

    //Para ACTUALIZAR variables en primer formulario
    const [origen, setOrigen] = useState('');
    const [destino, setDestino] = useState('');
    const [tarifa, setTarifa] = useState('');
    const [fecha, setFecha] = useState('');
    const [hora, setHora] = useState('');

    interface Result {
      id: number;
      origin: string;
      destination: string;
      tarifa: string;
      time: string;
    }
    
    const handleComprarClick = (result: Result) => {
      setOrigen(result.origin);
      setDestino(result.destination);
      setTarifa(result.tarifa);
    
      const dateObj = new Date(result.time);
      
      const timeStr = dateObj.toTimeString().split(' ')[0];
      const day = dateObj.getDate().toString().padStart(2, '0');
      const month = (dateObj.getMonth() + 1).toString().padStart(2, '0');
      const year = dateObj.getFullYear().toString();

      const dateStr = `${year}-${month}-${day}`;



      setFecha(dateStr);
      setHora(timeStr);
    };
    
    const handleFechaChange = (value: string) => {
      setFecha(value);
  
      const timeParts = results[0].time.split(':');
      const hour = parseInt(timeParts[0], 10);
      const minute = parseInt(timeParts[1], 10);
  
      const dateObj = new Date();
      dateObj.setHours(hour);
      dateObj.setMinutes(minute);
  
      const dateStr = dateObj.toISOString().split('T')[0];
      const timeStr = dateObj.toTimeString().split(' ')[0];
  
      setFecha(dateStr);
      setHora(timeStr);
    };
    const minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);
    

  return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '1500px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        flexWrap: "wrap"
      }}>
      <label htmlFor="origin" style={{ marginLeft: "20px" }}>Origen:</label>
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

      
      </div>

      <br></br>
      <br></br>

      <table style={{ flexWrap:"wrap", width: '100%', borderCollapse: 'collapse', backgroundColor: '#f1e8dc', borderRadius: '5px', marginBottom: '20px', overflowX: 'auto' }}>
      <thead>
        <tr style={{ backgroundColor: '#3C6E71', color: 'white' }}>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71', borderTopLeftRadius: '5px' }}>Origen</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Destino</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Tarifa</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Fecha</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71' }}>Hora</th>
          <th style={{ padding: '12px 8px', backgroundColor: '#3C6E71', borderTopRightRadius: '5px' }}>Acciones</th>
        </tr>
      </thead>
      <tbody>
        {filterResults().map((result, index) => (
          <tr key={result.id}>
            <td style={{ padding: '12px 8px', borderBottom: '1px solid #3C6E71', borderTopLeftRadius: '5px' }}>{result.origin}</td>
            <td style={{ padding: '12px 8px', borderBottom: '1px solid #3C6E71' }}>{result.destination}</td>
            <td style={{ padding: '12px 8px', borderBottom: '1px solid #3C6E71' }}>{result.tarifa}</td>
            <td style={{ padding: '12px 8px', borderBottom: '1px solid #3C6E71', borderTopRightRadius: '5px', textAlign: 'center' }}>
            <input
              type="date"
              id={`date-${index}`}
              value={date[index]}     
              style={{
                width: '120px',
                height: '40px',
                backgroundColor: '#3C6E71',
                color: 'white',
                borderRadius: '5px',
                marginLeft: '10px'
              }}
              min={new Date().toISOString().split('T')[0]}
            />
          </td>

          <td style={{ padding: '12px 8px', borderBottom: '1px solid #3C6E71' }}>{result.time}</td>
          <td style={{ padding: '12px 8px', borderBottom: '1px solid #3C6E71', borderTopRightRadius: '5px', textAlign: 'center' }}>
          <Button
            type="submit"
            onClick={() => handleComprarClick(result)}
            style={{
              backgroundColor: '#3C6E71',
              borderRadius: '5px',
              color: 'white',
              fontSize: '1.2em',
              width: '120px',
              height: '40px',
              cursor: 'hand',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            Comprar
          </Button>
          </td>
        </tr>
          ))}
        </tbody>
      </table>

      {/* Aqui se mostraran las ventanas emergentes*/}

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
          
        <div style={{ display: 'flex', flexDirection: 'row' }}>
        <div style={{ marginRight: '20px' }}>
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
            style={{ width: '200px' }}
          />
        </div>
        <br /><br />
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
            style={{ width: '200px' }}
          />
        </div>
        <br /><br />
        <div className="form-group">
          <label htmlFor="cantidad" style={{ color: '#3C6E71' }}>
            Cantidad de boletos:
          </label>
          <input
            type="number"
            className="form-control cantidad-input"
            id="cantidad"
            name="cantidad"
            min="0"
            max="10"
            required
            onChange={handleInputChange}
          />
        </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div>
        <label htmlFor="fecha" style={{ color: '#3C6E71' }}>
          Fecha de viaje: {fecha}
        </label>
      </div>
      <div>
        <label htmlFor="origen" style={{ color: '#3C6E71' }}>
          Origen: {origen}
        </label>
      </div>
      <div>
        <label htmlFor="destino" style={{ color: '#3C6E71' }}>
          Destino: {destino}
        </label>
      </div>
      <div>
        <label htmlFor="tarifa" style={{ color: '#3C6E71' }}>
          Tarifa: {tarifa}
        </label>
      </div>
      <div>
        <label htmlFor="hora" style={{ color: '#3C6E71' }}>
          Hora: {hora}
        </label>
      </div>
    </div>

  

     
    </div>

    <br></br>
          
          <h1 style={{ 
            backgroundColor: '#3C6E71',
            color: 'white', 
            padding: '5px', 
            borderRadius: '5px', 
            boxShadow: '2px 2px 5px rgba(0, 0, 0, 0.2)', 
            textAlign: 'center', 
            fontSize: '1.5em', 
            fontFamily: 'Arial, sans-serif'
          }}>Asientos</h1>
          <label htmlFor="destino" style={{ color: '#3C6E71', display: 'flex', justifyContent: 'space-between' }}>
          <span>Total: 45</span>
          <span>Ocupados:</span>
          <span>Disponibles:</span>
        </label>
        <br></br>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
        {[...Array(4)].map((_, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex', marginBottom: '10px' }}>
            {Array.from(
              { length: 9 },
              (_, seatIndex) => (
                <div
                  key={seatIndex}
                  style={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    justifyContent: 'center',
                    width: '40px',
                    height: '40px',
                    margin: '5px',
                    borderRadius: '50%',
                    backgroundColor: Math.random() < 0.5 ? 'red' : 'green',
                  }}
                >
                  <span>{rowIndex * 11 + seatIndex + 1}</span>
                </div>
              ),
            )}
          </div>
        ))}
      </div>



        <br></br>
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
          <br /><br />
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

      <Modal show={showModalPay} onHide={handleCloseAboutPay} size="lg" centered>
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
            <p>Origen: {origen}</p>
            <p>Destino: {destino}</p>
            <p>Cantidad de boletos: {formData.cantidad}</p>
            <p>Fecha de viaje: {fecha}</p>
            <p>Hora: {hora}</p>
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