import styles from '../styles/BuyTicket.module.css';
import React, { useState, useEffect, useRef } from 'react';
import { Modal, Button } from 'react-bootstrap';
import QRCode from 'qrcode.react';
import emailjs from 'emailjs-com';
import html2canvas from 'html2canvas';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import 'firebase/database';
import { ChangeEvent} from 'react';
import { database, storage } from "../firebase/config"


interface DatosViaje {
  origen: string;
  destino: string;
  fecha_salida: string;
  hora_salida: string;
  boletosSeleccionados: number;
}
interface FacturaProps {
  onClose: () => void;
  datosViaje: DatosViaje;
  asiento: string;
}


function Factura({ onClose, datosViaje, asiento }: {onClose: () => void;datosViaje: DatosViaje; asiento: number;
}) {
  const [metodoPago, setMetodoPago] = useState('');
  const [efectivo, setefectivo] = useState('');
  const [datosPaypal, setDatosPaypal] = useState({ correo: '', contraseña: '' });
  const handleValidarPaypal = () => {
  };
  const [paypalValidado, setPaypalValidado] = useState(false);

  const handleMetodoPagoChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setMetodoPago(event.target.value);
  };
  const handleNumeroTarjetaChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setefectivo(event.target.value);
  };
  const handlePaypalInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setDatosPaypal((prevDatosPaypal) => ({
      ...prevDatosPaypal,
      [name]: value
    }));
  };
  const fechaActual = new Date().toLocaleDateString('es-ES');
  const results = [
    {
      id: 1,
      origin: 'Ciudad Neily',
      destination: 'Cuidad Cortes',
      tarifa: '₡5000',
      date: fechaActual ,
      time: '08:00 AM'
    },
    {
      id: 2,
      origin: 'Cuidad Cortes',
      destination: 'Ciudad Neily',
      tarifa: '₡5000',
      date: fechaActual ,
      time: '07:00 AM'
    },
    {
      id: 3,
      origin: 'Paso Canoas',
      destination: 'Golfito',
      tarifa: '₡2000',
      date: fechaActual,
      time: '07:00 AM'
    },
    {
      id: 4,
      origin: 'Golfito',
      destination: 'Paso Canoas',
      tarifa: '₡2000',
      date: fechaActual,
      time: '06:00 AM'
    },
   
      {
        id: 5,
        origin: 'Cuidad Cortes ',
        destination: 'Golfito',
        tarifa: '₡6000',
        date: fechaActual,
        time: '11:00 AM'
      },
      
      {
        id: 6,
        origin: 'Golfito',
        destination: 'Cuidad Cortes',
        tarifa: '₡6000',
        date: fechaActual,
        time: '11:00 AM'
      },
      {
        id: 7,
        origin: 'Dominical ',
        destination: 'Cuidad Neily',
        tarifa: '₡5000',
        date: fechaActual,
        time: '02:00 PM'
      },
      {
        id: 8,
        origin: 'Cuidad Neily',
        destination: 'Dominical',
        tarifa: '₡5000',
        date: fechaActual,
        time: '02:00 PM'
      },
      {
        id: 9,
        origin: 'Dominical',
        destination: 'Golfito',
        tarifa: '₡7000',
        date: fechaActual,
        time: '10:00 AM'
      },
      {
        id: 10,
        origin: 'Golfito',
        destination: 'Dominical',
        tarifa: '₡7000',
        date: fechaActual,
        time: '11:00 AM'
      },
      {
        id: 11,
        origin: 'Golfito',
        destination: 'Paso Canoas',
        tarifa: '₡600',
        date: fechaActual,
        time: '11:00 AM'
      }, 
      {
        id: 1,
        origin: 'Paso Canoas',
        destination: 'Golfito',
        tarifa: '₡600',
        date: fechaActual,
        time: '11:00 AM'
      },  
    ];



    const datosViajeSeleccionado = results.find(
      (result) =>
        result.origin === datosViaje.origen && result.destination === datosViaje.destino
    );
  
    const precioUnitario = datosViajeSeleccionado ? parseInt(datosViajeSeleccionado.tarifa.replace('₡', '')) : 0;
    const iva = 0.13;
  
    const subtotal = isNaN(precioUnitario) || isNaN(datosViaje.boletosSeleccionados)
      ? 0
      : precioUnitario * datosViaje.boletosSeleccionados;
  
    const montoIVA = subtotal * iva;
    const total = subtotal + montoIVA;

  {/Correo/}
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


  return newCanvas;
}
  


{/QR/}


  return (
    <Modal show={true} onHide={onClose}>
      <div id="modal-content" ref={modalContentRef}  >
      <Modal.Header closeButton style={{ backgroundColor: '#3C6E71', color: 'white', borderBottom: 'none' }}>
        <Modal.Title style={{ fontSize: '2em', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          Factura
        </Modal.Title>
        </Modal.Header>
      <Modal.Body>
        <p>Detalles de la compra:</p>
        <p>Origen: {datosViaje.origen}</p>
        <p>Destino: {datosViaje.destino}</p>
        <p>Fecha de salida: {datosViaje.fecha_salida}</p>
        <p>Hora de salida: {datosViaje.hora_salida}</p>
        <p>Asiento seleccionado: {asiento}</p>
        <p>Precio unitario: ${precioUnitario}</p>
        <p>Cantidad de boletos: {datosViaje.boletosSeleccionados}</p>
        <p>Subtotal: ${subtotal}</p>
        <p>IVA: ${montoIVA}</p>
        <p>Total: ${total}</p>


        <p>Seleccione un método de pago:</p>
        <select value={metodoPago} onChange={handleMetodoPagoChange}>
          <option value="">-- Seleccione --</option>
          <option value="tarjeta">Tarjeta de crédito</option>
          <option value="paypal">PayPal</option>
        </select>


        {metodoPago === 'tarjeta' && (
          <div>
            <p>Ingrese el número de tarjeta:</p>
            <input
              type="text"
              name="numeroTarjeta"
              value={efectivo}
              onChange={handleNumeroTarjetaChange}
            />
            <button onClick={() => setefectivo('')}>
              Cambiar tarjeta
            </button>
          </div>
        )}

{metodoPago === 'paypal' && (
  <div>
    <p>Ingrese los datos de PayPal:</p>
    <input
      type="text"
      name="correo"
      value={datosPaypal.correo}
      onChange={handlePaypalInputChange}
      placeholder="Correo electrónico"
    />
    <input
      type="password"
      name="contraseña"
      value={datosPaypal.contraseña}
      onChange={handlePaypalInputChange}
      placeholder="Contraseña"
    />
    <button onClick={handleValidarPaypal}>Validar PayPal</button>
    {datosPaypal.correo != "gabyaleman52@gmail.com" || datosPaypal.contraseña !== "Lygbrl3129" && (
      <p>Debe ingresar una cuenta de PayPal válida.</p>
    )}
    {datosPaypal.correo === "gabyaleman52@gmail.com" && datosPaypal.contraseña === "Lygbrl3129" && (
      <p>Los datos de PayPal son correctos. ¿Desea continuar con el pago?</p>
    )}
  </div>
)}

        {metodoPago && (
          <div>
            <p>Código QR para el método de pago: {metodoPago}</p>
            <QRCode value={metodoPago} />
          </div>
        )}
      </Modal.Body>
      </div>
      <Modal.Footer>
      <div className="d-flex justify-content-between">
  <Button
    variant="secondary"
    onClick={() => {
      generarImage();
    }}
    style={{
      backgroundColor: "#3C6E71", //color
      color: "#fff", // tx
      border: "2px solid #000000", // borde
      borderRadius: "4px", // Redondea bordes
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 1)", //sombra
      fontSize: "20px", //tamaño
      fontWeight: "bold", //negrita
      padding: "10px 20px",
      marginRight: "50px", // Separación horizontal de 100px
    }}
  >
    Pagar
  </Button>
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
      marginLeft: "50px", // Separación horizontal de 100px
    }}
  >
    Enviar Comprobante
  </Button>
</div>


      </Modal.Footer>
    </Modal>
  );
}


function BuyTicket() {
  type DatosViaje = {
    origen: string;
    destino: string;
    fecha_salida: string;
    hora_salida: string;
    boletosSeleccionados: number | null;
  };
  
  const [datosViaje, setDatosViaje] = useState<DatosViaje>({
    origen: "",
    destino: "",
    fecha_salida: "",
    hora_salida: "",
    boletosSeleccionados: null,
  });
  
  
  const currentDate = new Date().toISOString().split('T')[0];//fecha actual


  const [asiento, setAsiento] = useState('');
  const [boletosSeleccionados, setBoletosSeleccionados] = useState(0);
  const [showModal, setShowModal] = useState(false);


  const NUMERO_ASIENTOS = 56;
  const [asientos, setAsientos] = useState(new Array(NUMERO_ASIENTOS).fill('disponible'));
  const disponibles = NUMERO_ASIENTOS - boletosSeleccionados;


  const asientoElegido = (indice: number) => {
    if (asientos[indice] === 'disponible') {
      if (boletosSeleccionados < 4) {
        setAsiento('A' + (indice + 1));
        setBoletosSeleccionados(boletosSeleccionados + 1);
        const nuevosAsientos = [...asientos];
        nuevosAsientos[indice] = 'ocupado';
        setAsientos(nuevosAsientos);
      }
    } else if (asientos[indice] === 'ocupado') {
      setAsiento('');
      setBoletosSeleccionados(boletosSeleccionados - 1);
      const nuevosAsientos = [...asientos];
      nuevosAsientos[indice] = 'disponible';
      setAsientos(nuevosAsientos);
    }
  };


  const renderSeats = () => {
    const columnas = 14; // Número de columnas de asientos
    const filas = 4; // Número de filas de asientos
  
    const seats = [];
    let indice = 0;
  
    for (let i = 0; i < filas; i++) {
      const fila = [];
      for (let j = 0; j < columnas; j++) {
        const asientoIndex = indice + j;
        const asiento = asientos[asientoIndex];
        fila.push(
          <div
            key={asientoIndex}
            className={`${styles.seat} ${styles[asiento]}`}
            onClick={() => asientoElegido(asientoIndex)}
          >
            {asiento === 'disponible' ? asientoIndex + 1 : ''}
          </div>
        );
      }
      seats.push(
        <div key={i} className={styles.seatRow}>
          {fila}
        </div>
      );
      indice += columnas;
    }
  
    return seats;
  };
  


  const handleInputSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setDatosViaje((prevDatosViaje) => ({
      ...prevDatosViaje,
      [name]: value
    }));
  };
  
  const handleContinuar = () => {
    if (datosViaje.origen === datosViaje.destino) {
      alert('El origen y el destino no pueden ser iguales.');
      return;
    }


    const fechaSeleccionada = new Date(datosViaje.fecha_salida);
    const fechaActual = new Date();
    const maxFechaAntesSalida = new Date();
    maxFechaAntesSalida.setDate(fechaActual.getDate() + 2);


    if (fechaSeleccionada < fechaActual) {
      alert('No se pueden seleccionar fechas anteriores a la fecha actual.');
      return;
    }


    if (fechaSeleccionada > maxFechaAntesSalida) {
      alert('No se pueden seleccionar fechas más de 2 días antes de la fecha de salida.');
      return;
    }


    setDatosViaje((prevDatosViaje) => ({
      ...prevDatosViaje,
      boletosSeleccionados
    }));
    
    setShowModal(true);
  };


  const [horaSalida, setHoraSalida] = useState("");


  const handleHoraSalidaChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setHoraSalida(event.target.value);
  };
  
  


  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDatosViaje({
      ...datosViaje,
      [event.target.name]: event.target.value,
    });
  };
  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setDatosViaje({
      ...datosViaje,
      [event.target.name]: event.target.value,
    });
  };
    
    
  interface IDatosViaje {
    origen: string;
    destino: string;
    fecha_salida: string;
    hora_salida: string;
  }
  return (
    <div>
      
      <div style={{ display: "flex", flexDirection: "row", justifyContent: "space-between", alignItems: "center", width: "100%" }}>
  <label style={{ margin: "0 10px" }}>
    Origen:
    <select name="origen" value={datosViaje.origen} onChange={handleSelectChange} style={{ width: '300px', height: "40px", backgroundColor: '#3C6E71', color: 'white', borderRadius: '5px' }}>
      <option value="">Selecciona el origen</option>
      <option value="Cuidad Neily">Cuidad Neily</option>
      <option value="Paso Canoas">Paso Canoas</option>
      <option value="Golfito">Golfito</option>
      <option value="Cuidad Cortes">Cuidad Cortes</option>
      <option value="Dominical">Dominical</option>
    </select>
  </label>
  <label style={{ margin: "0 10px" }}>
    Destino:
    <select name="destino" value={datosViaje.destino} onChange={handleSelectChange} style={{ width: '300px', height: "40px", backgroundColor: '#3C6E71', color: 'white', borderRadius: '5px' }}>
      <option value="">Selecciona el destino</option>
      <option value="Cuidad Neily">Cuidad Neily</option>
      <option value="Paso Canoas">Paso Canoas</option>
      <option value="Golfito">Golfito</option>
      <option value="Cuidad Cortes">Cuidad Cortes</option>
      <option value="Dominical">Dominical</option>
    </select>
  </label>
  <label style={{ margin: "0 10px" }}>
    Fecha de salida:
    <input type="date" name="fecha_salida" value={datosViaje.fecha_salida} onChange={handleInputChange} style={{ width: '300px', height: "40px", backgroundColor: '#3C6E71', color: 'white', borderRadius: '5px' }} />
  </label>
  <label style={{ margin: "0 10px" }}>
        Hora de salida:
        <select
          name="hora_salida"
          value={datosViaje.hora_salida}
          onChange={handleSelectChange}
          style={{
            width: '300px',
            height: "40px",
            backgroundColor: '#3C6E71',
            color: 'white',
            borderRadius: '5px'
          }}
        >
          <option value="">Selecciona la hora de salida</option>
          <option value="08:00">08:00 AM</option>
          <option value="09:00">09:00 AM</option>
          <option value="10:00">10:00 AM</option>
          <option value="12:00">12:00 PM</option>
          <option value="14:00">02:00 PM</option>
          <option value="16:00">04:00 PM</option>
          <option value="18:00">06:00 PM</option>
          {/* Añade más opciones de horas según tus necesidades */}
        </select>
      </label>
</div>


      
      <div style={{ marginBottom: '60px' }}></div>
      <label htmlFor="destino" style={{ color: '#3C6E71', display: 'flex', justifyContent: 'space-between' }}>
        <span>Total: {NUMERO_ASIENTOS}</span>
        <span>Ocupados: {boletosSeleccionados}</span>
        <span>Disponibles: {disponibles}</span>
      </label>
      <div style={{ marginBottom: '30px' }}></div>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }} >
       <p className={styles.info}>Asiento seleccionado: {asiento}</p>
      </div>
      
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        marginTop: '20px',
      }}>
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <div className="seat-container" style={{ marginLeft: 'auto', position: 'relative', right: '165px' }}>
          <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', width: '455px', flexWrap: 'wrap', marginBottom: '10px', marginTop: '20px' }}>
            {renderSeats()}
            {boletosSeleccionados >= 4 && (
              <>
                <p className={styles.errorMessage} style={{ color: 'red' }}>
                  No se pueden comprar más de 4 boletos.
                </p>
              </>
            )}
          </div>
        </div>
      </div>


     </div>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
        <button className={styles.button} onClick={handleContinuar}>
          Continuar
        </button>
      </div>


      {showModal && (
  <Factura 
    onClose={() => setShowModal(false)} 
    datosViaje={{...datosViaje, boletosSeleccionados: datosViaje.boletosSeleccionados || 0}} 
    asiento={Number(asiento)} 
  />
)}


    </div>
  );
}


export default BuyTicket;