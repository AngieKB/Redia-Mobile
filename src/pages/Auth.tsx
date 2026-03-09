import React, { useState, useEffect } from 'react';
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonIcon,
  IonToast,
  IonLoading,
  IonInputPasswordToggle,
} from '@ionic/react';
import { arrowBackOutline, eyeOutline, eyeOffOutline } from 'ionicons/icons';
import { useHistory, useLocation } from 'react-router-dom';
import ReCAPTCHA from 'react-google-recaptcha';
import { GoogleLogin } from '@react-oauth/google';
import { login, register, setTokens, forgotPassword, resetPassword, googleLogin, completeProfile } from '../services/authService';
import './Auth.css';

const Auth: React.FC = () => {
  const history = useHistory();
  const location = useLocation<{ mode?: 'login' | 'register' | 'forgot' }>();
  const [mode, setMode] = useState<'login' | 'register' | 'forgot' | 'reset' | 'complete'>(location.state?.mode || 'login');

  // Form states
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [nombre, setNombre] = useState('');
  const [telefono, setTelefono] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [fotoUrl, setFotoUrl] = useState<File | null>(null);
  const [recaptchaToken, setRecaptchaToken] = useState<string | null>(null);
  
  // Validation states
  const [errors, setErrors] = useState<any>({});

  // UI states
  const [loading, setLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const validateEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const validatePassword = (val: string) => /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/.test(val);
  const validatePhone = (val: string) => /^\d{10,}$/.test(val);

  const toggleMode = (newMode: 'login' | 'register' | 'forgot' | 'reset') => {
    setMode(newMode);
    if (newMode !== 'reset') setEmail('');
    setPassword('');
    setConfirmPassword('');
    setNombre('');
    setTelefono('');
    setVerificationCode('');
    setFotoUrl(null);
    setRecaptchaToken(null);
    setErrors({});
  };

  const onCaptchaChange = (token: string | null) => {
    setRecaptchaToken(token);
  };

  const handleLogin = async () => {
    if (!email || !password) {
      setToastMessage('Por favor completa todos los campos.');
      return;
    }

    if (!recaptchaToken) {
      setToastMessage('Por favor completa el reCAPTCHA.');
      return;
    }
    
    setLoading(true);
    try {
      const data = await login(email, password, recaptchaToken);
      setTokens(data.accessToken, data.refreshToken, data);
      setToastMessage('¡Bienvenido a Redia!');
      history.push('/app/reservations');
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleRegister = async () => {
    // Validaciones previas al envío
    const newErrors: any = {};
    if (!nombre) newErrors.nombre = 'Nombre requerido';
    if (!validateEmail(email)) newErrors.email = 'Email inválido';
    if (!validatePhone(telefono)) newErrors.telefono = 'Mínimo 10 dígitos';
    if (!validatePassword(password)) newErrors.password = 'Debe incluir Mayúscula, Minúscula y Número';
    if (password !== confirmPassword) newErrors.confirmPassword = 'Las contraseñas no coinciden';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage('Revisa los campos con errores');
      return;
    }

    if (!recaptchaToken) {
      setToastMessage('Por favor completa el reCAPTCHA.');
      return;
    }
    
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('email', email);
      formData.append('password', password);
      formData.append('telefono', telefono);
      formData.append('role', 'CLIENTE'); 
      if (fotoUrl) {
        formData.append('fotoUrl', fotoUrl);
      }
      
      const resMsg = await register(formData, recaptchaToken);
      setToastMessage('¡Registro exitoso! Iniciando sesión...');
      
      // Auto-login después de registrar exitosamente
      const loginData = await login(email, password, recaptchaToken);
      setTokens(loginData.accessToken, loginData.refreshToken, loginData);
      
      history.push('/app/reservations');
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSuccess = async (response: any) => {
    setLoading(true);
    try {
      const data = await googleLogin(response.credential);
      setTokens(data.accessToken, data.refreshToken, data);
      
      // Si el teléfono está vacío, el usuario es nuevo por Google y debe completar perfil
      if (!data.telefono || data.telefono === '') {
        setMode('complete');
        setToastMessage('Por favor completa tu perfil para continuar.');
      } else {
        setToastMessage(`¡Bienvenido ${data.nombre}!`);
        history.push('/app/reservations');
      }
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCompleteProfile = async () => {
    const newErrors: any = {};
    if (!validatePhone(telefono)) newErrors.telefono = 'El teléfono debe tener exactamente 10 dígitos';
    if (!validatePassword(password)) newErrors.password = 'La contraseña debe incluir Mayúscula, Minúscula y un Número';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      setToastMessage('Revisa los campos con errores');
      return;
    }

    setLoading(true);
    try {
      const formData = new FormData();
      formData.append('telefono', telefono);
      formData.append('password', password);
      if (fotoUrl) formData.append('fotoUrl', fotoUrl);

      await completeProfile(formData);
      setToastMessage('Perfil completado con éxito.');
      history.push('/app/reservations');
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleForgotPassword = async () => {
    if (!validateEmail(email)) {
      setToastMessage('Ingresa un correo válido.');
      return;
    }
    setLoading(true);
    try {
      await forgotPassword(email);
      setToastMessage('Código enviado a tu correo.');
      setMode('reset');
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!verificationCode || !validatePassword(password) || password !== confirmPassword) {
      setToastMessage('Revisa los campos del formulario');
      return;
    }
    setLoading(true);
    try {
      await resetPassword(email, verificationCode, password);
      setToastMessage('Contraseña actualizada correctamente.');
      toggleMode('login');
    } catch (error: any) {
      setToastMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <IonPage>
      <IonHeader className="ion-no-border">
        <IonToolbar color="primary">
          <IonButton fill="clear" slot="start" color="light" routerLink="/home">
            <IonIcon icon={arrowBackOutline} />
          </IonButton>
          <IonTitle>Acceso</IonTitle>
        </IonToolbar>
      </IonHeader>
      
      <IonContent className="auth-page-content">
        <div className="auth-container">
          <div className="auth-header">
            <h2>Redia</h2>
            <p>
              {mode === 'login' && 'Bienvenido de nuevo'}
              {mode === 'register' && 'Crear nueva cuenta'}
              {mode === 'forgot' && 'Recuperar contraseña'}
              {mode === 'reset' && 'Restablecer contraseña'}
            </p>
          </div>

          <div className="auth-card">
            {mode === 'login' && (
              <div className="login-form">
                <IonInput 
                  className="custom-input"
                  type="email" 
                  placeholder="Correo electrónico"
                  value={email} 
                  onIonInput={e => setEmail(e.detail.value!)} 
                />
                
                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <IonInput 
                    className="custom-input"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Contraseña" 
                    value={password} 
                    onIonInput={e => setPassword(e.detail.value!)} 
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '5px', top: '5px', zIndex: 10, '--padding-start': '8px', '--padding-end': '8px' }}
                  >
                    <IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eyeOutline} color="medium" />
                  </IonButton>
                </div>

                <div className="captcha-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                  <ReCAPTCHA
                    sitekey="6Lcg2IMsAAAAABsnQqPhTVEBU0I2lg0Yxd39UaVH"
                    onChange={onCaptchaChange}
                  />
                </div>

                <div className="google-login-container" style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.5rem' }}>
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={() => setToastMessage('Error al iniciar sesión con Google')}
                    useOneTap
                    theme="filled_blue"
                    shape="pill"
                    text="continue_with"
                    width="280px"
                  />
                </div>

                <IonButton expand="block" color="primary" onClick={handleLogin} className="auth-button">
                  Iniciar sesión
                </IonButton>
              </div>
            )}

            {mode === 'register' && (
              <div className="register-form">
                <IonInput 
                  className={`custom-input ${errors.nombre ? 'input-error' : ''}`}
                  placeholder="Nombre completo"
                  value={nombre} 
                  onIonInput={e => {
                    setNombre(e.detail.value!);
                    if (errors.nombre) setErrors({...errors, nombre: ''});
                  }} 
                />
                {errors.nombre && <span className="error-text">{errors.nombre}</span>}

                <div className="file-input-container">
                  <label className="file-input-label">Foto de perfil (opcional)</label>
                  <input 
                    type="file" 
                    className="file-input" 
                    onChange={e => setFotoUrl(e.target.files ? e.target.files[0] : null)}
                    accept="image/*"
                  />
                </div>

                <IonInput 
                  className={`custom-input ${errors.email ? 'input-error' : ''}`}
                  type="email" 
                  placeholder="Correo electrónico"
                  value={email} 
                  onIonInput={e => {
                    setEmail(e.detail.value!);
                    if (validateEmail(e.detail.value!)) setErrors({...errors, email: ''});
                    else setErrors({...errors, email: 'Email inválido'});
                  }} 
                />
                {errors.email && <span className="error-text">{errors.email}</span>}

                <IonInput 
                  className={`custom-input ${errors.telefono ? 'input-error' : ''}`}
                  type="tel" 
                  placeholder="Teléfono"
                  value={telefono} 
                  onIonInput={e => {
                    const val = e.detail.value!.replace(/\D/g, '').slice(0, 10);
                    setTelefono(val);
                    if (val.length === 10) setErrors({...errors, telefono: ''});
                    else setErrors({...errors, telefono: 'El teléfono debe tener 10 dígitos'});
                  }} 
                />
                {errors.telefono && <span className="error-text">{errors.telefono}</span>}
                
                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <IonInput 
                    className={`custom-input ${errors.password ? 'input-error' : ''}`}
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Contraseña" 
                    value={password} 
                    onIonInput={e => {
                      setPassword(e.detail.value!);
                      if (validatePassword(e.detail.value!)) setErrors({...errors, password: ''});
                      else setErrors({...errors, password: 'Mínimo 8 caracteres, Mayúscula, Minúscula y Número'});
                    }} 
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '5px', top: '5px', zIndex: 10, '--padding-start': '8px', '--padding-end': '8px' }}
                  >
                    <IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eyeOutline} color="medium" />
                  </IonButton>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}

                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <IonInput 
                    className={`custom-input ${errors.confirmPassword ? 'input-error' : ''}`}
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="Confirmar contraseña" 
                    value={confirmPassword} 
                    onIonInput={e => {
                      setConfirmPassword(e.detail.value!);
                      if (e.detail.value === password) setErrors({...errors, confirmPassword: ''});
                      else setErrors({...errors, confirmPassword: 'No coinciden'});
                    }} 
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '5px', top: '5px', zIndex: 10, '--padding-start': '8px', '--padding-end': '8px' }}
                  >
                    <IonIcon slot="icon-only" icon={showConfirmPassword ? eyeOffOutline : eyeOutline} color="medium" />
                  </IonButton>
                </div>
                {errors.confirmPassword && <span className="error-text">{errors.confirmPassword}</span>}

                <div className="captcha-container" style={{ display: 'flex', justifyContent: 'center', margin: '1rem 0' }}>
                  <ReCAPTCHA
                    sitekey="6Lcg2IMsAAAAABsnQqPhTVEBU0I2lg0Yxd39UaVH"
                    onChange={onCaptchaChange}
                  />
                </div>

                <IonButton expand="block" color="primary" onClick={handleRegister} className="auth-button">
                  Registrarse
                </IonButton>

                <div style={{ display: 'flex', alignItems: 'center', margin: '1.5rem 0' }}>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
                  <span style={{ margin: '0 10px', color: '#999', fontSize: '0.8rem' }}>O REGÍSTRATE CON</span>
                  <div style={{ flex: 1, height: '1px', background: '#e0e0e0' }}></div>
                </div>

                <div className="google-login-container" style={{ display: 'flex', justifyContent: 'center' }}>
                  <GoogleLogin 
                    onSuccess={handleGoogleSuccess}
                    onError={() => setToastMessage('Error al registrarse con Google')}
                    theme="outline"
                    shape="pill"
                    text="signup_with"
                    width="280px"
                  />
                </div>
              </div>
            )}

            {mode === 'complete' && (
              <div className="complete-form">
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                  Casi terminamos. Necesitamos algunos datos extra para tu cuenta.
                </p>
                
                <IonInput 
                  className={`custom-input ${errors.telefono ? 'input-error' : ''}`}
                  type="tel" 
                  placeholder="Teléfono móvil"
                  value={telefono} 
                  onIonInput={e => {
                    const val = e.detail.value!.replace(/\D/g, '').slice(0, 10);
                    setTelefono(val);
                    if (val.length === 10) setErrors({...errors, telefono: ''});
                    else setErrors({...errors, telefono: 'El teléfono debe tener 10 dígitos'});
                  }} 
                />
                {errors.telefono && <span className="error-text">{errors.telefono}</span>}

                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <IonInput 
                    className={`custom-input ${errors.password ? 'input-error' : ''}`}
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Crea una contraseña" 
                    value={password} 
                    onIonInput={e => {
                      setPassword(e.detail.value!);
                      if (validatePassword(e.detail.value!)) setErrors({...errors, password: ''});
                      else setErrors({...errors, password: 'Mínimo 8 caracteres, Mayúscula, Minúscula y Número'});
                    }} 
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '5px', top: '5px', zIndex: 10, '--padding-start': '8px', '--padding-end': '8px' }}
                  >
                    <IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eyeOutline} color="medium" />
                  </IonButton>
                </div>
                {errors.password && <span className="error-text">{errors.password}</span>}

                <div className="file-input-container">
                  <label className="file-input-label">Foto de perfil (opcional)</label>
                  <input 
                    type="file" 
                    className="file-input" 
                    onChange={e => setFotoUrl(e.target.files ? e.target.files[0] : null)}
                    accept="image/*"
                  />
                </div>

                <IonButton expand="block" color="primary" onClick={handleCompleteProfile} className="auth-button">
                  Finalizar Registro
                </IonButton>
              </div>
            )}

            {mode === 'forgot' && (
              <div className="forgot-form">
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                  Ingresa tu correo para recibir un código de verificación.
                </p>
                <IonInput 
                  className="custom-input"
                  type="email" 
                  placeholder="Correo electrónico"
                  value={email} 
                  onIonInput={e => setEmail(e.detail.value!)} 
                />
                <IonButton expand="block" color="primary" onClick={handleForgotPassword} className="auth-button">
                  Enviar Código
                </IonButton>
              </div>
            )}

            {mode === 'reset' && (
              <div className="reset-form">
                <p style={{ textAlign: 'center', marginBottom: '1.5rem', color: '#666', fontSize: '0.9rem' }}>
                  Ingresa el código que recibiste y tu nueva contraseña.
                </p>
                <IonInput 
                  className="custom-input"
                  placeholder="Código de verificación"
                  value={verificationCode} 
                  onIonInput={e => setVerificationCode(e.detail.value!)} 
                />
                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <IonInput 
                    className="custom-input"
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Nueva contraseña" 
                    value={password} 
                    onIonInput={e => setPassword(e.detail.value!)} 
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-btn"
                    onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '5px', top: '5px', zIndex: 10, '--padding-start': '8px', '--padding-end': '8px' }}
                  >
                    <IonIcon slot="icon-only" icon={showPassword ? eyeOffOutline : eyeOutline} color="medium" />
                  </IonButton>
                </div>
                <div className="password-input-wrapper" style={{ position: 'relative' }}>
                  <IonInput 
                    className="custom-input"
                    type={showConfirmPassword ? 'text' : 'password'} 
                    placeholder="Confirmar nueva contraseña" 
                    value={confirmPassword} 
                    onIonInput={e => setConfirmPassword(e.detail.value!)} 
                  />
                  <IonButton 
                    fill="clear" 
                    className="password-toggle-btn"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    style={{ position: 'absolute', right: '5px', top: '5px', zIndex: 10, '--padding-start': '8px', '--padding-end': '8px' }}
                  >
                    <IonIcon slot="icon-only" icon={showConfirmPassword ? eyeOffOutline : eyeOutline} color="medium" />
                  </IonButton>
                </div>
                <IonButton expand="block" color="primary" onClick={handleResetPassword} className="auth-button">
                  Restablecer Contraseña
                </IonButton>
              </div>
            )}
          </div>

          <div className="auth-footer-links">
            {mode === 'login' && (
              <>
                <a className="footer-link" onClick={() => toggleMode('register')}>
                  ¿No tienes cuenta? <span>Crear cuenta</span>
                </a>
                <a className="footer-link" onClick={() => setMode('forgot')}>¿Olvidaste tu contraseña?</a>
              </>
            )}

            {mode === 'register' && (
              <a className="footer-link" onClick={() => toggleMode('login')}>
                ¿Ya tienes cuenta? <span>Iniciar sesión</span>
              </a>
            )}

            {mode === 'complete' && (
              <a className="footer-link" onClick={() => {
                setMode('login');
              }}>
                Cancelar y <span>Volver</span>
              </a>
            )}

            {(mode === 'forgot' || mode === 'reset') && (
              <a className="footer-link" onClick={() => toggleMode('login')}>
                Volver al <span>Inicio de sesión</span>
              </a>
            )}
          </div>
        </div>

        <IonLoading isOpen={loading} message="Procesando..." />
        <IonToast isOpen={!!toastMessage} message={toastMessage} duration={3000} onDidDismiss={() => setToastMessage('')} />

      </IonContent>
    </IonPage>
  );
};

export default Auth;
