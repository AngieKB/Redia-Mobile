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
} from '@ionic/react';
import { checkmarkCircleOutline, personCircleOutline } from 'ionicons/icons';
import ProfileModal from '../components/ProfileModal';

const ReserveTab: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Nueva Reserva</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowProfile(true)}>
              <IonIcon slot="icon-only" icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        
        <div style={{ textAlign: 'center', margin: '1rem 0 2rem 0' }}>
          <h2 style={{ color: 'var(--ion-color-secondary)', fontWeight: 'bold' }}>Preparar tu mesa</h2>
          <p style={{ color: 'var(--ion-text-color)' }}>Selecciona los detalles de tu reserva.</p>
        </div>

        <IonItem color="light" style={{ marginBottom: '1rem', borderRadius: '8px' }}>
          <IonLabel position="stacked" color="primary">Número de Personas</IonLabel>
          <IonSelect placeholder="Selecciona" interface="popover">
            {[1, 2, 3, 4, 5, 6, 7, 8].map(num => (
              <IonSelectOption key={num} value={num}>
                {num} {num === 1 ? 'Persona' : 'Personas'}
              </IonSelectOption>
            ))}
          </IonSelect>
        </IonItem>

        <IonItem color="light" style={{ marginBottom: '1rem', borderRadius: '8px' }}>
          <IonLabel position="stacked" color="primary">Fecha y Hora</IonLabel>
          <IonDatetime 
            presentation="date-time"
            min={new Date().toISOString()}
            style={{ width: '100%', '--background': 'transparent' }}
          ></IonDatetime>
        </IonItem>

        <IonItem color="light" style={{ marginBottom: '2rem', borderRadius: '8px' }}>
          <IonLabel position="stacked" color="primary">Ocasión Especial (Opcional)</IonLabel>
          <IonSelect placeholder="Ninguna" interface="popover">
            <IonSelectOption value="cumpleanos">Cumpleaños</IonSelectOption>
            <IonSelectOption value="aniversario">Aniversario</IonSelectOption>
            <IonSelectOption value="negocios">Reunión de Negocios</IonSelectOption>
          </IonSelect>
        </IonItem>

        <IonButton expand="block" color="secondary" size="large">
          <IonIcon slot="start" icon={checkmarkCircleOutline} />
          Confirmar Reserva
        </IonButton>

        {/* Modal Perfil */}
        <IonModal isOpen={showProfile} onDidDismiss={() => setShowProfile(false)}>
          <ProfileModal onDismiss={() => setShowProfile(false)} />
        </IonModal>

      </IonContent>
    </IonPage>
  );
};

export default ReserveTab;
