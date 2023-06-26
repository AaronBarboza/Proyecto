import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import emailjs from 'emailjs-com';
import html2canvas from 'html2canvas';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import 'firebase/database';
import { ChangeEvent} from 'react';
import { database, storage } from "../firebase/config";
//import { NextApiRequest, NextApiResponse } from 'next';
//import * as mustache from 'mustache';

//import type { Query } from "firebase/database";
//import * as functions from 'firebase-functions';
//import * as admin from 'firebase-admin';
//import * as nodemailer from 'nodemailer';
//import firebase from 'firebase/app';
//import mustache from 'mustache';
//import * as admin from 'firebase-admin';
//import { getDatabase, onValue } from "firebase/database";
//import { deflate } from 'pako';
//import jsPDF from 'jspdf';
//import { time, timeStamp } from 'console';
//import { PDFDocument } from 'pdf-lib';

function BusTicketForm() {
  /// Modal de formulario
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');
  //const [date, setDate] = useState('');
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

  {/*Correo*/}
  const [fileContent, setFileContent] = useState('');

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result;
        if (typeof content === 'string') {
          setFileContent(content);
        }
      };
      reader.readAsText(file);
    }
  };

  type EmailJSResponseStatus = {
    status: number,
    text: string,
  }
 
  function uploadAndSendEmail(file: File) {
    // Crea una referencia de almacenamiento
    const storageRef = ref(storage, 'images/' + file.name);
  
    // Sube el archivo de imagen y genera una URL de descarga
    const uploadTask = uploadBytesResumable(storageRef, file);
  
    uploadTask.on('state_changed',
      (snapshot) => {
        // Obtiene el progreso de la tarea, incluyendo el número de bytes subidos y el número total de bytes a subir
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        console.log('Upload is ' + progress + '% done');
      },
      (error) => {
        // Maneja las subidas fallidas
        console.error('Upload error:', error);
      },
      () => {
        // Maneja las subidas exitosas al completarse y obtén la URL de descarga
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          console.log('File available at', downloadURL);
  
          // Construye la plantilla del correo utilizando cadenas de texto
          const formData = {
            nombre: 'Nombre del remitente', // Reemplaza con el valor correcto
            email: 'email@example.com', // Reemplaza con el valor correcto
          };
          const attachments = [
            {
              name: 'comprobante.png',
              data: downloadURL,
            },
          ];
  
          const emailTemplate = `
            New message from ${formData.nombre}
            You got a new message from ${formData.nombre}:

            {{modal-content}}

            ${attachments.length ? `
              <img src="${attachments[0].data}" alt="${attachments[0].name}" style="max-width: 100%; height: auto;">
              <p>
                <a href="${attachments[0].data}" download="${attachments[0].name}">Descargar comprobante</a>
              </p>
            ` : ''}

            Sent from ${formData.email}
          `;
          // Envía el correo con la plantilla renderizada
          const templateParams = {
            to_name: 'Recipient Name',
            from_name: formData.nombre,
            message: emailTemplate,
            reply_to: formData.email,
          };
  
          emailjs.send('service_narigrb', 'template_mha2rj2', templateParams, 'RWxLClg-me91RdSat')
            .then((response: EmailJSResponseStatus) => {
              console.log('SUCCESS!', response.status, response.text);
            }, (err: Error) => {
              console.error('FAILED...', err);
            });
        });
      });
  }
  
  const modalContentRef = useRef<HTMLDivElement>(null);
  async function generarImage() {
    const contentText = modalContentRef.current;
  
    if (!contentText) {
      console.error('Error: contentText is null');
      return;
    }
    const canvasOptions = {};
    html2canvas(contentText, canvasOptions)
      .then(async (canvas) => {
        const resizedCanvas = resizeImage(canvas, 800, 600);
  
        const imgDataPNG = resizedCanvas.toDataURL('image/png', 0.05);
        const filePNG = new File([b64toBlob(imgDataPNG, 'image/png')], 'comprobante.png', {
          type: 'image/png',
        });
        uploadAndSendEmail(filePNG);
      })
      .catch((error) => {
        console.error('Error generating image:', error);
      });
  }

function b64toBlob(base64: string, type: string = ''): Blob {
  const byteCharacters = atob(base64.replace(/^data:[^;]+;base64,/, ''));
  const byteArrays: Uint8Array[] = [];

  for (let offset = 0; offset < byteCharacters.length; offset += 1024) {
    const slice = byteCharacters.slice(offset, offset + 1024);
    const byteNumbers = new Array(slice.length);

    for (let i = 0; i < slice.length; i++) {
      byteNumbers[i] = slice.charCodeAt(i);
    }

    const byteArray = new Uint8Array(byteNumbers);
    byteArrays.push(byteArray);
  }

  return new Blob(byteArrays, { type });
}

function resizeImage(canvas: HTMLCanvasElement, maxWidth: number, maxHeight: number): HTMLCanvasElement {
  const width = canvas.width;
  const height = canvas.height;
  const ratio = Math.min(maxWidth / width, maxHeight / height);

  const newCanvas = document.createElement('canvas');
  newCanvas.width = width * ratio;
  newCanvas.height = height * ratio;

  const ctx = newCanvas.getContext('2d');
  if (ctx) {
    ctx.drawImage(canvas, 0, 0, width * ratio, height * ratio);
  }

  return newCanvas;
}
  

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
      metodoPago: '',
      hora: ''
    });
  /*
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
  */
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
          destination: 'Heredia',
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
          return originMatch && destinationMatch;
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
      }, [origin, destination]);
    //Para ACTUALIZAR LA FECHA
  
    const [setFechaActual] = useState<string[]>([]);   
    const [totalSeats] = useState(36);
    const [occupiedSeats, setOccupiedSeats] = useState(0); // Inicialmente no hay asientos ocupados
  
    const handleInputasientos = (event: React.ChangeEvent<HTMLInputElement>) => {
      const selectedQuantity = parseInt(event.target.value);
      if (!isNaN(selectedQuantity)) {
        if (selectedQuantity >= 0 && selectedQuantity <= totalSeats) {
          setOccupiedSeats(selectedQuantity);
          setCantidadBoletos(selectedQuantity); // Update the quantity of tickets state
        }
      }
    };
  
    const availableSeats = totalSeats - occupiedSeats;
    const [cantidadBoletos, setCantidadBoletos] = useState(0);
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
      setHora(result.time);
      setFecha(date);
    };

    const [selectedRowIndex, setSelectedRowIndex] = useState<number | null>(null);
    const [date, setDate] = useState("");
  
    const handleDateChange = (index: number, selectedDate: string) => {
      setSelectedRowIndex(index);
      setDate(selectedDate);
    };
    
    

  return (
      <form onSubmit={handleSubmit} style={{ maxWidth: '1500px', margin: 'auto', display: 'flex', flexDirection: 'column' }}>
      
      <div style={{display: "flex",flexDirection: "row",justifyContent: "space-between",alignItems: "center",flexWrap: "wrap"}}>
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

      <table style={{ flexWrap: "wrap", width: '100%', borderCollapse: 'collapse', backgroundColor: '#f1e8dc', borderRadius: '5px', marginBottom: '20px', overflowX: 'auto' }}>
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
            <td style={{ padding: "12px 8px", borderBottom: "1px solid #3C6E71", borderTopRightRadius: "5px", textAlign: "center" }}>
              <input
                type="date"
                id={`date-${index}`}
                value={selectedRowIndex === index ? date : ""}
                onChange={(e) => {
                  handleDateChange(index, e.target.value);
                }}
                style={{
                  width: "120px",
                  height: "40px",
                  backgroundColor: "#3C6E71",
                  color: "white",
                  borderRadius: "5px",
                  marginLeft: "10px",
                }}
                min={new Date().toISOString().split("T")[0]}
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
          max="15"
          required
          onChange={handleInputasientos}
        />
      </div>
      </div>
      
      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between'}}>
      <div>
        <label htmlFor="fecha" style={{ color: '#3C6E7' }}>
          Fecha de viaje: {date}
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
            <span>Total: {totalSeats}</span>
            <span>Ocupados: {occupiedSeats}</span>
            <span>Disponibles: {availableSeats}</span>
          </label>
        <br></br>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '455px' }}>
        {Array.from({ length: 4 }, (_, seatIndex) => (
          <div key={seatIndex} style={{ display: 'flex', marginBottom: '5px' }}>
            {[...Array(9)].map((_, rowIndex) => (
              <div
                key={rowIndex}
                style={{
                  width: '40px',
                  height: '40px',
                  margin: '5px',
                  backgroundColor: seatIndex + rowIndex * 4 + 1 <= occupiedSeats ? '#3077B0' : 'gray',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  border: '1px solid black',
                  borderRadius: '4px',
                }}
              >
                <span style={{ fontSize: '0.8em' }}>{seatIndex + rowIndex * 4 + 1}</span>
              </div>
            ))}
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

      <Modal  show={showModalPay} onHide={handleCloseAboutPay} size="lg" centered>
        <Modal.Header closeButton style={{ backgroundColor: '#3C6E71', color: 'white', borderBottom: 'none' }}>
        <Modal.Title style={{ fontSize: '2em', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          Factura
        </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div id="modal-content" ref={modalContentRef} > 
            <h1 style={{ fontSize: '2em', color: '#3C6E71', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
            ¡Compra Exitosa!
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <div style={{ paddingRight: '50px' }}>
            <p>Nombre: {formData.nombre}</p>
            <p>Correo electrónico: {formData.email}</p>
            <p>Origen: {origen}</p>
            <p>Destino: {destino}</p>
            <p>Cantidad de boletos: {cantidadBoletos}</p>
            <p>Fecha de viaje: {date}</p>
            <p>Hora: {hora}</p>
            <p>Método de pago: {formData.metodoPago}</p>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: '300px' }}>
            </div>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '-150px' }}>
              <QRCode value={qrCodeData} />
            </div>
            <div></div>
          </div>
        </Modal.Body>
        <Modal.Footer>
        <Button
          variant="secondary"
          onClick={() => {
            generarImage();
          }}
          style={{
            backgroundColor: "#f44336", //color
            color: "#fff", // tx
            border: "2px solid #f44336", // borde
            borderRadius: "4px", // Redondea bordes
            boxShadow: "0px 2px 4px rgba(0, 0, 0, 1)", //sombra
            fontSize: "20px", //tamaño
            fontWeight: "bold", //negrita
            padding: "10px 20px",
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