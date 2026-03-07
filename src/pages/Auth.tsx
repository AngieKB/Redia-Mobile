import React, { useState } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
  IonLabel,
  IonSegment,
  IonSegmentButton,
  IonIcon,
} from '@ionic/react';
import { logInOutline, personAddOutline, arrowBackOutline } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Auth: React.FC = () => {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const history = useHistory();

  const handleLogin = () => {
    // Navigate to tabs layout after login/registration
    history.push('/app/reserve');
  };

  return (
    <IonPage>
      <IonHeader>
        <IonToolbar color="primary">
          <IonButton fill="clear" slot="start" color="light" routerLink="/home">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Autenticación</IonTitle>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding" style={{ '--background': 'var(--ion-background-color)' }}>
        
        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <h2 style={{ color: 'var(--ion-color-secondary)', fontWeight: 'bold' }}>Redia Restaurante</h2>
          <p style={{ color: 'var(--ion-text-color)' }}>Ingresa tus datos para continuar</p>
        </div>

        <IonSegment value={mode} onIonChange={e => setMode(e.detail.value as any)} color="secondary" style={{ marginBottom: '2rem' }}>
          <IonSegmentButton value="login">
            <IonLabel>Iniciar Sesión</IonLabel>
          </IonSegmentButton>
          <IonSegmentButton value="register">
            <IonLabel>Crear Cuenta</IonLabel>
          </IonSegmentButton>
        </IonSegment>

        {mode === 'login' ? (
          <div className="login-form">
            <IonItem color="light" style={{ marginBottom: '1rem', borderRadius: '8px' }}>
              <IonLabel position="floating" color="primary">Correo Electrónico</IonLabel>
              <IonInput type="email" placeholder="ejemplo@correo.com" />
            </IonItem>
            
            <IonItem color="light" style={{ marginBottom: '2rem', borderRadius: '8px' }}>
              <IonLabel position="floating" color="primary">Contraseña</IonLabel>
              <IonInput type="password" placeholder="***" />
            </IonItem>

            <IonButton expand="block" color="primary" onClick={handleLogin}>
              <IonIcon slot="start" icon={logInOutline} />
              Iniciar Sesión
            </IonButton>
            
            <div style={{ textAlign: 'center', marginTop: '1rem' }}>
              <IonButton fill="clear" color="secondary" size="small">
                ¿Olvidaste tu contraseña?
              </IonButton>
            </div>
          </div>
        ) : (
          <div className="register-form">
            <IonItem color="light" style={{ marginBottom: '1rem', borderRadius: '8px' }}>
              <IonLabel position="floating" color="primary">Nombre Completo</IonLabel>
              <IonInput type="text" placeholder="Juan Pérez" />
            </IonItem>

            <IonItem color="light" style={{ marginBottom: '1rem', borderRadius: '8px' }}>
              <IonLabel position="floating" color="primary">Correo Electrónico</IonLabel>
              <IonInput type="email" placeholder="ejemplo@correo.com" />
            </IonItem>
            
            <IonItem color="light" style={{ marginBottom: '2rem', borderRadius: '8px' }}>
              <IonLabel position="floating" color="primary">Contraseña</IonLabel>
              <IonInput type="password" placeholder="Mínimo 8 caracteres" />
            </IonItem>

            <IonButton expand="block" color="secondary" onClick={handleLogin}>
              <IonIcon slot="start" icon={personAddOutline} />
              Registrarse
            </IonButton>
          </div>
        )}

      </IonContent>
    </IonPage>
  );
};

export default Auth;
