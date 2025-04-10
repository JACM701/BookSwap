import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AuthService } from 'src/app/services/auth.service';
import { AngularFireAuth } from '@angular/fire/compat/auth';
import { GoogleAuthProvider } from '@angular/fire/auth';
import { Firestore, collection, addDoc } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { generateUsername } from 'unique-username-generator';
import axios from 'axios';
import { ToastrService } from 'ngx-toastr';
import { HostListener } from '@angular/core';
import { doc, setDoc, getDoc } from '@angular/fire/firestore';
import { GoogleAuth } from '@codetrix-studio/capacitor-google-auth';  // Importar Capacitor Google Auth

@Component({
  selector: 'app-auth-modal',
  templateUrl: './auth-modal.component.html',
  styleUrls: ['./auth-modal.component.css'],
})
export class AuthModalComponent {

  emailLogin = '';
  passwordLogin = '';
  emailRegister = '';
  passwordRegister = '';
  confirmPassword = '';
  name = '';
  showPassword: boolean = false;
  isFocused1: boolean = false;
  isFocused2: boolean = false;
  @Input() showModal!: boolean;
  @Output() closeModal = new EventEmitter<void>();

  //Validacion de Gmail o Email.
  validateEmail(email: string): boolean {
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    return regex.test(email);
  }

  // Método para emitir el cierre del modal
  closeModalOnOutsideClick(event: MouseEvent): void {
    const modal = document.getElementById('authentication-modal');
    if (modal && event.target === modal) {
      this.closeModal.emit();
    }
  }

  @HostListener('document:keydown', ['$event'])
  onKeyDown(event: KeyboardEvent): void {
    if (event.key === 'Escape') {
      this.closeModal.emit();
    }
  }

  constructor(
    private authService: AuthService,
    private afAuth: AngularFireAuth,
    private router: Router,
    private firestore: Firestore,
    private toastr: ToastrService
  ) {}

  togglePassword() {
    this.showPassword = !this.showPassword;
  }

  validatePassword(password: string): string | null {
    if (password.length < 6) {
      return 'La contraseña debe tener al menos 6 caracteres.';
    }
    if (!/[A-Za-z]/.test(password)) {
      return 'La contraseña debe incluir al menos una letra.';
    }
    if (!/\d/.test(password)) {
      return 'La contraseña debe incluir al menos un número.';
    }
    if (!/[!@#$%^&*()_+]/.test(password)) {
      return 'La contraseña debe incluir al menos un carácter especial (!@#$%^&*()).';
    }
    return null; // Contraseña válida
  }

  async generateRandomUsernameAndAvatar() {
    const username = generateUsername('', 0, 10);
    let avatarUrl = '';

    try {
      const avatarResponse = await axios.get(
        `https://api.dicebear.com/7.x/micah/svg?flip=true&backgroundType=gradientLinear&backgroundRotation[]&baseColor=f9c9b6,ac6651&earringsProbability=15&facialHair=scruff&facialHairProbability=30&hair=dannyPhantom,fonze,full,pixie,turban,mrClean&hairProbability=95&backgroundColor=b6e3f4,c0aede,d1d4f9,ffd5dc,ffdfbf&seed=${username}`
      );
      avatarUrl = avatarResponse.request.responseURL;
    } catch (error) {
      console.error('API request failed:', error);
      avatarUrl =
        'https://res.cloudinary.com/dnp36kqdc/image/upload/v1694805447/user_s2emcd.png';
    }
    return { username, avatarUrl };
  }

  async register() {
    if (!this.validateEmail(this.emailRegister)) {
      this.toastr.warning('Por favor ingresa un correo electrónico válido.', 'Error');
      return;
    }

    if (this.passwordRegister !== this.confirmPassword) {
      this.toastr.warning('Las contraseñas no coinciden.', 'Error');
      return;
    }

    const passwordError = this.validatePassword(this.passwordRegister);
    if (passwordError) {
      this.toastr.warning(passwordError, 'Error');
      return;
    }

    const { emailRegister, passwordRegister } = this;
    try {
      // Registro de usuario con Firebase Authentication
      const userCredential = await this.authService.register(
        emailRegister,
        passwordRegister
      );

      if (userCredential && userCredential.user) {
        const userUID = userCredential.user.uid;
        const userEmail = userCredential.user.email;

        const { username, avatarUrl } =
          await this.generateRandomUsernameAndAvatar();

         // Guardar datos de usuario en Firestore
        const userData = {
          username,
          avatarUrl,
          userUID,
          userEmail,
          firstName: '',
          lastName: '',
          gender: '',
          location: '',
          birthday: '',
          summary: '',
          instaId: '',
          twitterId: '',
        };

        // En lugar de addDoc, usa doc + setDoc con un UID único
        const userInstance = doc(this.firestore, `users/${userUID}`);
        await setDoc(userInstance, userData);

        console.log(
          'Usuario registrado exitosamente con nombre de usuario y avatar aleatorios.'
        );
        this.toastr.success('¡Usuario registrado exitosamente!', 'Éxito');
        this.handleAuthResult(userCredential, 'Registro');
      }
    } catch (error) {
      console.error('Error en el registro:', error);
      this.toastr.error('Ocurrió un error al registrar el usuario', 'Error');
    }
  }

  async login() {
    if (!this.validateEmail(this.emailLogin)) {
      this.toastr.warning('Por favor ingresa un correo electrónico válido.', 'Error');
      return;
    }

    const { emailLogin, passwordLogin } = this;
    const userCredential = await this.authService.login(
      emailLogin,
      passwordLogin
    );
    this.handleAuthResult(userCredential, 'Inicio de sesión');
  }

  //Logica para movil inicio de sesion o web
  async signInOrSignUpWithGoogle() {
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);

    try {
      let result;
      if (isMobile) {
        // Si es móvil, usa Capacitor Google Auth para evitar abrir navegador
        const googleUser = await GoogleAuth.signIn();
        const user = googleUser;
        if (!user) {
          console.error('No se pudo obtener el usuario de Google.');
          this.toastr.error('No se pudo obtener el usuario de Google.', 'Error');
          return;
        }

        const userUID = user.id;
        const userEmail = user.email;

        // Verificar si el usuario ya existe en Firestore
        const userRef = doc(this.firestore, `users/${userUID}`);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          // Si el usuario no existe, se registra y se guarda en Firestore
          const { username, avatarUrl } = await this.generateRandomUsernameAndAvatar();
          const userData = {
            username,
            avatarUrl,
            userUID,
            userEmail,
            firstName: '',
            lastName: '',
            gender: '',
            location: '',
            birthday: '',
            summary: '',
            instaId: '',
            twitterId: '',
          };

          await setDoc(userRef, userData);
          this.toastr.success('Usuario registrado exitosamente con Google', 'Éxito');
        } else {
          console.log('Usuario ya registrado en Firestore.');
        }
      } else {
        // Si es web, usar el popup de Firebase
        result = await this.afAuth.signInWithPopup(new GoogleAuthProvider());
      }

      // ✅ Mostrar mensaje de inicio de sesión exitoso
      this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');

      // ✅ Redirigir a la página de libros
      this.router.navigate(['/bookStore']);
    } catch (error) {
      console.error('Error en la autenticación con Google:', error);
      this.toastr.error('Error en el inicio de sesión con Google', 'Error');
    }
  }

  private handleAuthResult(userCredential: any, action: string) {
    if (userCredential) {
      console.log(`${action} exitoso:`, userCredential.user);
      this.router.navigate(['/bookStore']);
    } else {
      console.error(`${action} fallido.`);
      this.toastr.error('Algo salió mal', 'Error');
    }
  }

  ngOnInit() {
    this.afAuth.getRedirectResult().then(async (result) => {
      if (result.user) {
        const user = result.user;
        const userUID = user.uid;
        const userEmail = user.email;

        const userRef = doc(this.firestore, `users/${userUID}`);
        const userSnapshot = await getDoc(userRef);

        if (!userSnapshot.exists()) {
          // Registrar usuario si es nuevo
          const { username, avatarUrl } = await this.generateRandomUsernameAndAvatar();
          const userData = {
            username,
            avatarUrl,
            userUID,
            userEmail,
            firstName: '',
            lastName: '',
            gender: '',
            location: '',
            birthday: '',
            summary: '',
            instaId: '',
            twitterId: '',
          };

          await setDoc(userRef, userData);
          this.toastr.success('Usuario registrado exitosamente con Google', 'Éxito');
        }

        this.toastr.success('Inicio de sesión exitoso', 'Bienvenido');
        this.router.navigate(['/bookStore']);
      }
    }).catch(error => {
      console.error('Error en el inicio de sesión con Google:', error);
      this.toastr.error('Error en el inicio de sesión con Google', 'Error');
    });
  }
}
