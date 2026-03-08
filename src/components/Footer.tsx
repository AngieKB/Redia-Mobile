import React from 'react';
import './Footer.css';
import { IonIcon } from '@ionic/react';
import { logoInstagram } from 'ionicons/icons';
import { useHistory } from 'react-router-dom';

const Footer: React.FC = () => {
  const history = useHistory();

  return (
    <footer className="app-footer">
      <div className="footer-content">
        <div className="footer-section">
          <h3>Redia</h3>
          <p>Sabores que inspiran. Nuestro objetivo es brindar a nuestros clientes la mejor experiencia culinaria con ingredientes frescos y recetas excepcionales.</p>
        </div>

        <div className="footer-section contact-info">
          <h4>Contacto</h4>
          <p><strong>Dirección:</strong> Carrera 23 #36-48</p>
          <p><strong>Teléfono:</strong> 3186113505</p>
          <p><strong>Correo:</strong> redia.serviciocliente@gmail.com</p>
        </div>

        <div className="footer-section">
          <h4>Enlaces Rápidos</h4>
          <p>
            <a onClick={() => history.push('/home')} style={{ color: 'inherit', textDecoration: 'none', borderBottom: '1px solid transparent', transition: 'border-color 0.3s', cursor: 'pointer' }}>
              Home
            </a>
          </p>
        </div>

        <div className="footer-section">
          <h4>Horario</h4>
          <p>Lunes a Viernes de 8am-10pm</p>
          <p>Sábados de 8am-4pm</p>
          <p>Domingos y Festivos: Cerrado</p>
        </div>

        <div className="footer-section">
          <h4>Síguenos</h4>
          <div className="social-links" style={{ display: 'flex', gap: '1rem', marginTop: '10px' }}>
            <a href="https://www.instagram.com/redia.restaurante?igsh=MXhwNnd3MGZqdDJ3cg==" target="_blank" rel="noopener noreferrer" className="instagram-btn">
              <IonIcon icon={logoInstagram} style={{ fontSize: '20px' }} />
              <span>Instagram</span>
            </a>
          </div>
        </div>
      </div>

      <div className="footer-bottom">
        <p>&copy; 2026 con todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
