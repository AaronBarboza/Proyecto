/*import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import BusTicketForm from './BuyTicket';


const InvoiceModal = ({ showModal, setShowModal, formData, qrCodeData, handleSendEmail }) => {
  return (
    <Modal show={showModal} onHide={() => setShowModal(false)} size="lg" centered>
      <Modal.Header style={{ backgroundColor: '#3C6E71', color: 'white', borderBottom: 'none' }}>
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
        <h1>Gracias por preferirnos</h1>
      </Modal.Footer>
    </Modal>
  );
}

export default InvoiceModal;
*/