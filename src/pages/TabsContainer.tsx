import React from 'react';
import {
  IonTabs,
  IonRouterOutlet,
  IonTabBar,
  IonTabButton,
  IonIcon,
  IonLabel,
} from '@ionic/react';
import { Redirect, Route } from 'react-router-dom';
import { calendarOutline, listOutline, headsetOutline } from 'ionicons/icons';

import ReserveTab from './ReserveTab';
import ReservationsTab from './ReservationsTab';
import CustomerServiceTab from './CustomerServiceTab';

const TabsContainer: React.FC = () => {
  return (
    <IonTabs>
      <IonRouterOutlet>
        <Route exact path="/app/reserve" component={ReserveTab} />
        <Route exact path="/app/reservations" component={ReservationsTab} />
        <Route exact path="/app/support" component={CustomerServiceTab} />
        <Route exact path="/app">
          <Redirect to="/app/reserve" />
        </Route>
      </IonRouterOutlet>
      
      <IonTabBar slot="bottom" color="primary">
        <IonTabButton tab="reserve" href="/app/reserve">
          <IonIcon icon={calendarOutline} />
          <IonLabel>Reserva</IonLabel>
        </IonTabButton>

        <IonTabButton tab="reservations" href="/app/reservations">
          <IonIcon icon={listOutline} />
          <IonLabel>Mis Reservas</IonLabel>
        </IonTabButton>

        <IonTabButton tab="support" href="/app/support">
          <IonIcon icon={headsetOutline} />
          <IonLabel>Ayuda</IonLabel>
        </IonTabButton>
      </IonTabBar>
    </IonTabs>
  );
};

export default TabsContainer;
