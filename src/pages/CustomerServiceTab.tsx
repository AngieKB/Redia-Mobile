import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonIcon,
  IonItem,
  IonLabel,
  IonButton,
  IonTextarea,
  IonButtons,
  IonModal,
} from '@ionic/react';
import { chatbubblesOutline, callOutline, mailOutline, personCircleOutline, sendOutline } from 'ionicons/icons';
import ProfileModal from '../components/ProfileModal';
import Footer from '../components/Footer';

const CustomerServiceTab: React.FC = () => {
  const [showProfile, setShowProfile] = useState(false);

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Atención al Cliente</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={() => setShowProfile(true)}>
              <IonIcon slot="icon-only" icon={personCircleOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        
        <div style={{ textAlign: 'center', margin: '1rem 0 2rem 0' }}>
          <IonIcon icon={chatbubblesOutline} style={{ fontSize: '4rem', color: 'var(--ion-color-secondary)' }} />
          <h2 style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold' }}>¿Necesitas ayuda?</h2>
          <p style={{ color: 'var(--ion-text-color)' }}>Estamos aquí para resolver tus dudas.</p>
        </div>

        <IonCard style={{ margin: '0 0 2rem 0', borderRadius: '12px' }}>
          <IonCardHeader>
            <IonCardTitle style={{ color: 'var(--ion-color-primary)' }}>Contacto Rápido</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem lines="none">
              <IonIcon icon={callOutline} slot="start" color="secondary" />
              <IonLabel>+1 234 567 8900</IonLabel>
            </IonItem>
            <IonItem lines="none">
              <IonIcon icon={mailOutline} slot="start" color="secondary" />
              <IonLabel>soporte@redia.com</IonLabel>
            </IonItem>
          </IonCardContent>
        </IonCard>

        <IonCard style={{ margin: '0 0 3rem 0', borderRadius: '12px' }}>
          <IonCardHeader>
            <IonCardTitle style={{ color: 'var(--ion-color-primary)' }}>Déjanos un mensaje</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonItem color="light" style={{ borderRadius: '8px', marginBottom: '1rem' }}>
              <IonLabel position="floating" color="primary">Asunto</IonLabel>
              <IonTextarea placeholder="Ej: Duda sobre menú" />
            </IonItem>
            
            <IonItem color="light" style={{ borderRadius: '8px', marginBottom: '1rem' }}>
              <IonLabel position="floating" color="primary">Mensaje</IonLabel>
              <IonTextarea rows={4} placeholder="Escribe aquí tu duda o sugerencia..." />
            </IonItem>

            <IonButton expand="block" color="secondary">
              <IonIcon slot="start" icon={sendOutline} />
              Enviar Mensaje
            </IonButton>
          </IonCardContent>
        </IonCard>

        <Footer />

        <IonModal isOpen={showProfile} onDidDismiss={() => setShowProfile(false)}>
          <ProfileModal onDismiss={() => setShowProfile(false)} />
        </IonModal>
      </IonContent>
    </IonPage>
  );
};

export default CustomerServiceTab;
