import React from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonButtons,
} from '@ionic/react';
import Footer from '../components/Footer';
import { useHistory } from 'react-router-dom';
import './Home.css';

const Home: React.FC = () => {
  const history = useHistory();

  // Redirigir si ya está autenticado
  React.useEffect(() => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      history.replace('/app/reservations');
    }
  }, [history]);

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar style={{ '--background': '#ffffff', padding: '0.5rem 1rem' }}>
          <IonTitle slot="start" style={{ color: 'var(--ion-color-primary)', fontWeight: 'bold', fontSize: '1.4rem', letterSpacing: '1px', margin: 0 }}>
            REDIA
          </IonTitle>
          <IonButtons slot="end" style={{ gap: '0.5rem' }}>
            <IonButton color="primary" onClick={() => history.push('/auth', { mode: 'login' })} style={{ fontWeight: '600', textTransform: 'none', fontSize: '0.9rem' }}>
              Iniciar sesión
            </IonButton>
            <IonButton 
              color="primary" 
              fill="solid" 
              onClick={() => history.push('/auth', { mode: 'register' })} 
              style={{ borderRadius: '20px', padding: '0 0.8rem', textTransform: 'none', fontWeight: 'bold', fontSize: '0.9rem' }}
            >
              Registrarse
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>

      <IonContent fullscreen>
        <div className="hero-section">
          <div className="hero-overlay"></div>
          <div className="hero-content">
            <h1>Bienvenidos a <span style={{ color: '#B65C7C' }}>Redia</span></h1>
            <p>
              Vive una experiencia gastronómica inolvidable. Sabores auténticos, ambiente
              acogedor y un servicio excepcional que te hará sentir como en casa.
            </p>
            <IonButton shape="round" color="secondary" size="large" onClick={() => history.push('/auth', { mode: 'login' })} style={{ marginTop: '1.5rem', fontWeight: 'bold' }}>
              Reservar ahora
            </IonButton>
          </div>
        </div>

        <div className="info-cards-section">
          <div className="info-card">
            <h3 style={{ color: 'var(--ion-color-secondary)', fontWeight: 'bold' }}>Horarios de atención</h3>
            <p>Lunes a Viernes: 8:00 am - 10:00 pm</p>
            <p>Sábados: 8:00 am - 4:00 pm</p>
            <p>Domingos y Festivos: Cerrado</p>
          </div>
          <div className="info-card">
            <h3 style={{ color: 'var(--ion-color-secondary)', fontWeight: 'bold' }}>Nuestra Ubicación</h3>
            <p>Carrera 23 #36-48</p>
            <p>Visítanos y disfruta de un momento especial.</p>
          </div>
        </div>

        <Footer />
      </IonContent>
    </IonPage>
  );
};

export default Home;
