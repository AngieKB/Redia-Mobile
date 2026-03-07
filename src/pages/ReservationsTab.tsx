import React, { useState } from 'react';
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
} from '@ionic/react';
import { timeOutline, closeCircleOutline, checkmarkCircleOutline, banOutline, personCircleOutline } from 'ionicons/icons';
import ProfileModal from '../components/ProfileModal';

const ReservationsTab: React.FC = () => {
  const [filter, setFilter] = useState<'pendientes' | 'pasadas' | 'canceladas' | 'rechazadas'>('pendientes');
  const [showProfile, setShowProfile] = useState(false);

  // Datos mockeados para visualizar las tarjetas
  const mockReservations = [
    { id: 1, status: 'pendientes', date: 'Mañana - 20:00', pax: 2, note: 'Aniversario' },
    { id: 2, status: 'pasadas', date: '10 de Marzo - 14:00', pax: 4, note: 'Ninguna' },
    { id: 3, status: 'canceladas', date: '5 de Marzo - 19:30', pax: 2, note: 'Motivos personales' },
    { id: 4, status: 'rechazadas', date: '1 de Marzo - 21:00', pax: 15, note: 'Sin disponibilidad' },
  ];

  const getIconStatus = (status: string) => {
    switch(status) {
      case 'pendientes': return timeOutline;
      case 'pasadas': return checkmarkCircleOutline;
      case 'canceladas': return closeCircleOutline;
      case 'rechazadas': return banOutline;
      default: return timeOutline;
    }
  };

  const getColorStatus = (status: string) => {
    switch(status) {
      case 'pendientes': return 'warning';
      case 'pasadas': return 'success';
      case 'canceladas': return 'danger';
      case 'rechazadas': return 'dark';
      default: return 'primary';
    }
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mis Reservas</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowProfile(true)}>
              <IonIcon slot="icon-only" icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
        <IonToolbar color="primary">
          <IonSegment scrollable value={filter} onIonChange={e => setFilter(e.detail.value as any)} color="light">
            <IonSegmentButton value="pendientes">
              <IonLabel>Pendientes</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="pasadas">
              <IonLabel>Pasadas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="canceladas">
              <IonLabel>Canceladas</IonLabel>
            </IonSegmentButton>
            <IonSegmentButton value="rechazadas">
              <IonLabel>Rechazadas</IonLabel>
            </IonSegmentButton>
          </IonSegment>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        <IonList style={{ background: 'transparent' }}>
          {mockReservations.filter(r => r.status === filter).length === 0 ? (
            <div style={{ textAlign: 'center', marginTop: '3rem', color: 'var(--ion-text-color)' }}>
              No tienes reservas en esta categoría.
            </div>
          ) : (
            mockReservations.filter(r => r.status === filter).map(res => (
              <IonItem key={res.id} style={{ marginBottom: '1rem', borderRadius: '8px' }} color="light" lines="none">
                <IonIcon icon={getIconStatus(res.status)} color={getColorStatus(res.status)} slot="start" size="large" />
                <IonLabel>
                  <h2 style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold' }}>Mesa para {res.pax}</h2>
                  <p style={{ color: 'var(--ion-text-color)' }}>{res.date}</p>
                  <p style={{ color: '#6d6d6d', fontSize: '0.9rem' }}>Nota: {res.note}</p>
                </IonLabel>
                <IonBadge color={getColorStatus(res.status)} slot="end">{res.status.toUpperCase()}</IonBadge>
              </IonItem>
            ))
          )}
        </IonList>

        <IonModal isOpen={showProfile} onDidDismiss={() => setShowProfile(false)}>
          <ProfileModal onDismiss={() => setShowProfile(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default ReservationsTab;
