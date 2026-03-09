import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonItem,
  IonLabel,
  IonDatetime,
  IonSelect,
  IonSelectOption,
  IonIcon,
  IonButtons,
  IonModal,
  IonToast,
  IonLoading,
} from '@ionic/react';
import { checkmarkCircleOutline, personCircleOutline, timeOutline, calendarOutline } from 'ionicons/icons';
import ProfileModal from '../components/ProfileModal';
import { createReservation } from '../services/reservationService';
import { useHistory } from 'react-router-dom';

const ReserveTab: React.FC = () => {
  const history = useHistory();
  const [showProfile, setShowProfile] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Form states matching CreateReservationRequestDTO
  const [fechaReserva, setFechaReserva] = useState<string>(new Date().toISOString());
  const [horaFinReserva, setHoraFinReserva] = useState<string>('');
  const [numeroPersonas, setNumeroPersonas] = useState<number>(2);

  const handleCreateReservation = async () => {
    if (!fechaReserva || !horaFinReserva || !numeroPersonas) {
      setToastMessage('Por favor completa todos los campos obligatorios.');
      return;
    }

    // El backend espera LocalDateTime (YYYY-MM-DDTHH:mm:ss)
    // Nos aseguramos de que horaFinReserva tenga la misma fecha que fechaReserva
    let formattedHoraFin = horaFinReserva;
    if (horaFinReserva.includes('T') && fechaReserva.includes('T')) {
      const datePart = fechaReserva.split('T')[0];
      const timePart = horaFinReserva.split('T')[1];
      formattedHoraFin = `${datePart}T${timePart}`;
    }

    const reservationData = {
      fechaReserva,
      horaFinReserva: formattedHoraFin,
      numeroPersonas: Number(numeroPersonas)
    };

    setLoading(true);
    try {
      await createReservation(reservationData);
      setToastMessage('¡Reserva creada con éxito!');
      // Limpiar formulario o redirigir
      setTimeout(() => history.push('/app/reservations'), 1500);
    } catch (error: any) {
      setToastMessage(error.message || 'Error al crear la reserva');
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Nueva Reserva</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowProfile(true)}>
              <IonIcon slot="icon-only" icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding auth-page-content">
        <div style={{ textAlign: 'center', margin: '1rem 0 2rem 0' }}>
          <h2 style={{ color: 'var(--ion-color-secondary)', fontWeight: 'bold' }}>Preparar tu mesa</h2>
          <p style={{ color: 'var(--ion-text-color)' }}>Completa los detalles para tu reserva en Redia.</p>
        </div>

        <div className="auth-card" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
          
          <IonItem lines="none" className="custom-input" style={{ marginBottom: '1.2rem', padding: '8px 0' }}>
            <IonIcon icon={calendarOutline} slot="start" color="primary" style={{ marginTop: '16px' }} />
            <div style={{ width: '100%' }}>
              <IonLabel color="primary" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Fecha y Hora de Inicio</IonLabel>
              <IonDatetime 
                value={fechaReserva}
                onIonChange={e => setFechaReserva(e.detail.value as string)}
                presentation="date-time"
                min={new Date().toISOString()}
                style={{ '--background': 'transparent', width: '100%' }}
              ></IonDatetime>
            </div>
          </IonItem>

          <IonItem lines="none" className="custom-input" style={{ marginBottom: '1.2rem', padding: '8px 0' }}>
            <IonIcon icon={timeOutline} slot="start" color="primary" style={{ marginTop: '16px' }} />
            <div style={{ width: '100%' }}>
              <IonLabel color="primary" style={{ fontSize: '0.9rem', marginBottom: '8px', display: 'block' }}>Hora de Finalización</IonLabel>
              <IonDatetime 
                value={horaFinReserva}
                onIonChange={e => setHoraFinReserva(e.detail.value as string)}
                presentation="time"
                style={{ '--background': 'transparent', width: '100%' }}
              ></IonDatetime>
              <p style={{ fontSize: '0.8rem', color: '#666', marginTop: '4px' }}>
                Estimación de cuánto tiempo ocuparás la mesa.
              </p>
            </div>
          </IonItem>

          <IonItem lines="none" className="custom-input" style={{ marginBottom: '1.5rem' }}>
            <IonIcon icon={checkmarkCircleOutline} slot="start" color="primary" />
            <IonLabel position="stacked" color="primary">Número de Personas</IonLabel>
            <IonSelect 
              value={numeroPersonas}
              onIonChange={e => setNumeroPersonas(e.detail.value)}
              placeholder="¿Cuántos vendrán?" 
              interface="popover"
            >
              {Array.from({ length: 32 }, (_, i) => i + 1).map(num => (
                <IonSelectOption key={num} value={num}>
                  {num} {num === 1 ? 'Persona' : 'Personas'}
                </IonSelectOption>
              ))}
            </IonSelect>
          </IonItem>

          <IonButton expand="block" color="secondary" size="large" onClick={handleCreateReservation} className="auth-button">
            <IonIcon slot="start" icon={checkmarkCircleOutline} />
            Confirmar Reserva
          </IonButton>
        </div>

        {/* Modal Perfil */}
        <IonModal isOpen={showProfile} onDidDismiss={() => setShowProfile(false)}>
          <ProfileModal onDismiss={() => setShowProfile(false)} />
        </IonModal>

        <IonLoading isOpen={loading} message="Procesando reserva..." />
        <IonToast 
          isOpen={!!toastMessage} 
          message={toastMessage} 
          duration={3000} 
          onDidDismiss={() => setToastMessage('')} 
          color={toastMessage.includes('éxito') ? 'success' : 'danger'}
        />

      </IonContent>
    </IonPage>
  );
};

export default ReserveTab;
