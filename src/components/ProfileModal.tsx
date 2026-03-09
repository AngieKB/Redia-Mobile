import React from 'react';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonAvatar,
  IonItem,
  IonLabel,
  IonList,
  IonIcon,
  IonButtons,
} from '@ionic/react';
import { closeOutline, logOutOutline } from 'ionicons/icons';
import { getUser, logout } from '../services/authService';
import { useHistory } from 'react-router-dom';

interface ProfileModalProps {
  onDismiss: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onDismiss }) => {
  const history = useHistory();
  const user = getUser();

  const handleLogout = async () => {
    await logout();
    onDismiss();
    history.push('/home');
  };

  return (
    <>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonTitle>Mi Perfil</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="ion-padding auth-page-content">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2.5rem', marginBottom: '2rem' }}>
          <IonAvatar style={{ width: '120px', height: '120px', border: '4px solid white', boxShadow: '0 4px 15px rgba(0,0,0,0.1)' }}>
            <img 
              alt="Foto de Perfil" 
              src={user?.fotoUrl || "https://ionicframework.com/docs/img/demos/avatar.svg"} 
            />
          </IonAvatar>
          
          <h2 style={{ color: 'var(--ion-color-primary)', marginTop: '1.5rem', fontWeight: 'bold', fontSize: '1.6rem' }}>
            {user?.nombre || 'Invitado'}
          </h2>
          <p style={{ color: '#666', fontSize: '1.1rem', marginTop: '0.2rem' }}>
            {user?.email || 'Sin correo'}
          </p>
        </div>

        <div className="auth-card" style={{ padding: '0.5rem', borderRadius: '15px' }}>
          <IonList lines="none">
            <IonItem button onClick={handleLogout} detail={false} className="logout-item">
              <IonIcon icon={logOutOutline} slot="start" color="danger" />
              <IonLabel color="danger" style={{ fontWeight: '600' }}>Cerrar Sesión</IonLabel>
            </IonItem>
          </IonList>
        </div>

        <div style={{ textAlign: 'center', marginTop: '2rem' }}>
          <p style={{ color: '#999', fontSize: '0.8rem' }}>Redia App v0.1.0</p>
        </div>
      </IonContent>
    </>
  );
};

export default ProfileModal;
