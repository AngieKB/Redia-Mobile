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
import { closeOutline, logOutOutline, personCircleOutline } from 'ionicons/icons';

interface ProfileModalProps {
  onDismiss: () => void;
}

const ProfileModal: React.FC<ProfileModalProps> = ({ onDismiss }) => {
  return (
    <>
      <IonHeader>
        <IonToolbar color="primary">
          <IonTitle>Mi Perfil</IonTitle>
          <IonButtons slot="end">
            <IonButton onClick={onDismiss}>
              <IonIcon icon={closeOutline} />
            </IonButton>
          </IonButtons>
        </IonToolbar>
      </IonHeader>
      <IonContent className="ion-padding">
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginTop: '2rem' }}>
          <IonAvatar style={{ width: '100px', height: '100px' }}>
            <img alt="Foto de Perfil" src="https://ionicframework.com/docs/img/demos/avatar.svg" />
          </IonAvatar>
          <h2 style={{ color: 'var(--ion-color-primary)', marginTop: '1rem', fontWeight: 'bold' }}>Cliente Frecuente</h2>
          <p style={{ color: 'var(--ion-text-color)', margin: '0' }}>cliente@ejemplo.com</p>
        </div>

        <IonList style={{ marginTop: '2rem' }} inset={true}>
          <IonItem button>
            <IonIcon icon={personCircleOutline} slot="start" color="secondary" />
            <IonLabel>Editar Información</IonLabel>
          </IonItem>
          <IonItem button lines="none" routerLink="/home" onClick={onDismiss}>
            <IonIcon icon={logOutOutline} slot="start" color="danger" />
            <IonLabel color="danger">Cerrar Sesión</IonLabel>
          </IonItem>
        </IonList>
      </IonContent>
    </>
  );
};

export default ProfileModal;
