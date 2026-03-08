import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonSegment,
  IonSegmentButton,
  IonLabel,
  IonList,
  IonItem,
  IonIcon,
  IonBadge,
  IonButtons,
  IonButton,
  IonModal,
  IonToast,
  IonLoading,
} from '@ionic/react';
import { personCircleOutline, addOutline } from 'ionicons/icons';
import ProfileModal from '../components/ProfileModal';
import { useHistory } from 'react-router-dom';
import { getMyReservations, cancelReservation } from '../services/reservationService';

type ReservationStatus = 'SOLICITADA' | 'CONFIRMADA' | 'RECHAZADA' | 'CANCELADA' | 'FINALIZADA';

const ReservationsTab: React.FC = () => {
  const [filter, setFilter] = useState<ReservationStatus>('CONFIRMADA');
  const [showProfile, setShowProfile] = useState(false);
  const [reservations, setReservations] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const history = useHistory();

  const loadReservations = async () => {
    setLoading(true);
    try {
      const data = await getMyReservations();
      // map backend data to local state if needed
      setReservations(data);
    } catch (error: any) {
      // Si falla, mostramos datos de prueba para poder ver la interfaz
      console.log('Backend not available or error, loading mocks', error);
      setReservations([
        { id: '1', fechaReserva: '2026-03-08T19:00:00', numeroPersonas: 4, estado: 'CONFIRMADA' },
        { id: '2', fechaReserva: '2026-03-10T14:00:00', numeroPersonas: 2, estado: 'FINALIZADA' },
        { id: '3', fechaReserva: '2026-03-05T19:30:00', numeroPersonas: 2, estado: 'CANCELADA' },
        { id: '4', fechaReserva: '2026-03-11T20:00:00', numeroPersonas: 6, estado: 'SOLICITADA' },
        { id: '5', fechaReserva: '2026-03-01T21:00:00', numeroPersonas: 15, estado: 'RECHAZADA' },
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReservations();
  }, []);

  const handleCancelClick = async (id: string) => {
    try {
      setLoading(true);
      await cancelReservation(id);
      setToastMessage('Reserva cancelada exitosamente');
      loadReservations();
    } catch(err: any) {
      setToastMessage(err.message || 'Error cancelando reserva');
      // For testing UI:
      setReservations(prev => prev.map(r => r.id === id ? { ...r, estado: 'CANCELADA' } : r));
    } finally {
      setLoading(false);
    }
  };

  const getColorStatus = (status: string) => {
    switch(status) {
      case 'SOLICITADA': return 'warning';
      case 'CONFIRMADA': return 'success';
      case 'CANCELADA': return 'danger';
      case 'RECHAZADA': return 'dark';
      case 'FINALIZADA': return 'medium';
      default: return 'primary';
    }
  };

  // Formato simple de fecha para el recuadro "7 MAR"
  const getFormatDateObj = (isoString: string) => {
    const d = new Date(isoString);
    const day = d.getDate();
    const months = ["ENE", "FEB", "MAR", "ABR", "MAY", "JUN", "JUL", "AGO", "SEP", "OCT", "NOV", "DIC"];
    const month = months[d.getMonth()];
    const hours = d.getHours().toString().padStart(2, '0');
    const mins = d.getMinutes().toString().padStart(2, '0');
    return { day, month, time: `${hours}:${mins}` };
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary" style={{ padding: '0.5rem 1rem' }}>
          <IonTitle style={{ fontWeight: 'bold' }}>REDIA</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowProfile(true)}>
              <IonIcon slot="icon-only" icon={personCircleOutline} style={{ fontSize: '30px' }} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        
        {/* Banner header like in the screenshot */}
        <div style={{ background: 'var(--ion-color-secondary)', padding: '2rem 1.5rem', color: 'white', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ margin: 0, fontSize: '1.8rem', fontWeight: 'bold' }}>Mis Reservas</h1>
            <p style={{ margin: '5px 0 0', opacity: 0.8, fontSize: '0.9rem' }}>Historial y estado de tus reservas</p>
          </div>
          <IonButton fill="outline" color="light" onClick={() => history.push('/app/reserve')} style={{ '--border-radius': '20px' }}>
            <IonIcon icon={addOutline} slot="start" />
            Nueva Reserva
          </IonButton>
        </div>
        
        <IonToolbar style={{ '--background': 'var(--ion-background-color)' }}>
          <IonSegment scrollable value={filter} onIonChange={e => setFilter(e.detail.value as any)} color="primary" style={{ background: 'white', borderRadius: '8px', margin: '0 1rem' }}>
            <IonSegmentButton value="SOLICITADA"><IonLabel>Solicitadas</IonLabel></IonSegmentButton>
            <IonSegmentButton value="CONFIRMADA"><IonLabel>Confirmadas</IonLabel></IonSegmentButton>
            <IonSegmentButton value="FINALIZADA"><IonLabel>Finalizadas</IonLabel></IonSegmentButton>
            <IonSegmentButton value="CANCELADA"><IonLabel>Canceladas</IonLabel></IonSegmentButton>
            <IonSegmentButton value="RECHAZADA"><IonLabel>Rechazadas</IonLabel></IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        <IonList style={{ background: 'transparent' }}>
          {reservations.filter(r => r.estado === filter).length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ion-text-color)' }}>
              No tienes reservas en esta categoría.
            </div>
          ) : (
            reservations.filter(r => r.estado === filter).map(res => {
              const dt = getFormatDateObj(res.fechaReserva);
              return (
                <div key={res.id} style={{ background: 'white', borderRadius: '12px', padding: '1.5rem', marginBottom: '1rem', display: 'flex', flexDirection: 'column', boxShadow: '0 4px 10px rgba(0,0,0,0.05)' }}>
                  
                  <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
                    <div style={{ display: 'flex', gap: '1rem' }}>
                      <div style={{ background: 'var(--ion-color-secondary)', color: 'white', borderRadius: '8px', padding: '10px', textAlign: 'center', width: '60px', height: '60px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <span style={{ fontSize: '1.2rem', fontWeight: 'bold' }}>{dt.day}</span>
                        <span style={{ fontSize: '0.8rem' }}>{dt.month}</span>
                      </div>
                      <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                        <h3 style={{ margin: '0 0 5px', fontWeight: 'bold', color: 'var(--ion-color-tertiary)', fontSize: '1.1rem' }}>{dt.time}</h3>
                        <p style={{ margin: 0, color: 'var(--ion-text-color)', fontSize: '0.9rem' }}>{res.numeroPersonas} personas</p>
                      </div>
                    </div>
                  </div>

                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '1.5rem', borderTop: '1px solid #f0f0f0', paddingTop: '1rem' }}>
                    <IonBadge color={getColorStatus(res.estado)} style={{ padding: '8px 12px', borderRadius: '20px', letterSpacing: '1px' }}>
                      {res.estado.toUpperCase()}
                    </IonBadge>
                    
                    { (res.estado === 'SOLICITADA' || res.estado === 'CONFIRMADA') && (
                      <IonButton fill="outline" color="danger" size="small" style={{ '--border-radius': '20px' }} onClick={() => handleCancelClick(res.id)}>
                        Cancelar
                      </IonButton>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </IonList>

        <IonModal isOpen={showProfile} onDidDismiss={() => setShowProfile(false)}>
          <ProfileModal onDismiss={() => setShowProfile(false)} />
        </IonModal>
        <IonToast isOpen={!!toastMessage} message={toastMessage} duration={3000} onDidDismiss={() => setToastMessage('')} />
        <IonLoading isOpen={loading} message="Cargando..." />
      </IonContent>
    </IonPage>
  );
};

export default ReservationsTab;
