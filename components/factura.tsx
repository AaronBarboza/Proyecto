import React, { useState } from 'react';
import { Modal, Button } from 'react-bootstrap';
import QRCode from 'react-qr-code';
import BusTicketForm from './BuyTicket';

const InvoiceModal = ({
  showModal,
  setShowModal,
  formData,
  qrCodeData,
  handleSendEmail
}: {
  showModal: boolean;
  setShowModal: (value: boolean) => void;
  formData: FormData;
  qrCodeData: string;
  handleSendEmail: () => void;
}) => {
  const [paymentCompleted, setPaymentCompleted] = useState(false);

  const handlePayment = async () => {
    try {
      // Realizar llamada a la API de PayPal para iniciar el proceso de pago

      // Hacer la llamada a la API de PayPal para procesar el pago
      // Esperar la respuesta asincrónica de PayPal

      // Simulación de respuesta exitosa
      const paymentSuccess = true;

      // Actualizar el estado paymentCompleted en función de la respuesta
      setPaymentCompleted(paymentSuccess);

      // Si el pago se completó exitosamente, puedes realizar acciones adicionales, como enviar el correo electrónico
      if (paymentSuccess) {
        handleSendEmail();
      }
    } catch (error) {
      // Manejar cualquier error de la llamada a la API de PayPal
      console.error('Error al procesar el pago:', error);
    }
  };

  // Función para iniciar el proceso de pago con PayPal
  const initiatePayment = async () => {
    // Realiza la llamada a la API de PayPal para crear una orden de pago
    // Aquí va el código de la llamada a la API de PayPal que te proporcioné previamente
  };

  const handleCloseModal = () => {
    // Lógica para cerrar el modal
    // Puedes restablecer los valores necesarios, como el estado paymentCompleted
    setPaymentCompleted(false);
    setShowModal(false);
  };

  return (
    <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
      <Modal.Header style={{ backgroundColor: '#3C6E71', color: 'white', borderBottom: 'none' }}>
        <Modal.Title style={{ fontSize: '2em', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
          Factura
        </Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {paymentCompleted ? (
          <>
            <h1 style={{ fontSize: '2em', color: '#3C6E71', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
              ¡Compra Exitosa!
            </h1>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              {/* Mostrar los detalles del pedido */}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', marginTop: '-150px' }}>
              <QRCode value={qrCodeData} />
            </div>
          </>
        ) : (
          <>
            <h1 style={{ fontSize: '2em', color: '#3C6E71', fontFamily: 'Arial, sans-serif', textAlign: 'center' }}>
              Proceso de Pago
            </h1>
            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '20px' }}>
              {/* Aquí se puede colocar el botón de pago de PayPal */}
              <Button onClick={handlePayment}>Realizar Pago con PayPal</Button>
            </div>
          </>
        )}
      </Modal.Body>
      <Modal.Footer>
        <h1>Gracias por preferirnos</h1>
      </Modal.Footer>
    </Modal>
  );
};

export default InvoiceModal;
