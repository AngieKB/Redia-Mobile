import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonCard,
  IonCardHeader,
  IonCardTitle,
  IonCardContent,
  IonImg,
  IonIcon,
} from '@ionic/react';
import { calendarOutline, restaurantOutline, locationOutline, starOutline } from 'ionicons/icons';

const Home: React.FC = () => {
  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Redia - Tu Restaurante</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent fullscreen style={{ '--background': 'var(--ion-background-color)' }}>
        <IonHeader collapse="condense">
          <IonToolbar color="primary">
            <IonTitle size="large">Redia</IonTitle>
          </IonToolbar>
        </IonHeader>

        <div style={{ textAlign: 'center', padding: '2rem 1rem' }}>
          <IonImg
            src="https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&w=800&q=80"
            alt="Interior del restaurante"
            style={{ borderRadius: '15px', marginBottom: '1.5rem', boxShadow: '0 4px 10px rgba(0,0,0,0.1)' }}
          />
          <h1 style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold' }}>Bienvenido a Redia</h1>
          <p style={{ color: 'var(--ion-text-color)', fontSize: '1.1rem', marginBottom: '2rem' }}>
            La mejor experiencia culinaria a tu alcance. Disfruta de nuestros platillos exclusivos
            en un ambiente inolvidable.
          </p>
          
          <IonButton expand="block" color="secondary" size="large" routerLink="/auth" style={{ fontWeight: 'bold' }}>
            <IonIcon icon={calendarOutline} slot="start" />
            ¡Reserva Ya!
          </IonButton>
        </div>

        <IonCard>
          <IonCardHeader>
            <IonCardTitle>¿Qué ofrecemos?</IonCardTitle>
          </IonCardHeader>
          <IonCardContent>
            <IonButton fill="clear" color="primary">
              <IonIcon slot="start" icon={restaurantOutline} />
              Chef Internacional
            </IonButton>
            <br />
            <IonButton fill="clear" color="secondary">
              <IonIcon slot="start" icon={locationOutline} />
              Excelente Ubicación
            </IonButton>
            <br />
            <IonButton fill="clear" color="primary">
              <IonIcon slot="start" icon={starOutline} />
              Servicio de 5 Estrellas
            </IonButton>
          </IonCardContent>
        </IonCard>
      </IonContent>
    </IonPage>
  );
};

export default Home;
