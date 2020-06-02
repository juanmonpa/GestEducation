import { Injectable } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { AlertController } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { auth } from 'firebase/app';
import { User } from '../model/User';
import { NativeStorage } from '@ionic-native/native-storage/ngx';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  // keep in RAM user credentials (email if it's logged in, null if it's not logged in, see user model interface)
  user:User;

  constructor(private authS: AngularFireAuth,
    private router: Router,
    public alertController: AlertController,
    private googlePlus: GooglePlus,
    private firebase: AngularFireAuth,
    private local: NativeStorage) 
    { 
    this.isLogged();
  }

  async presentAlertAuth(msg?) {
    const mes = msg
      ? msg
      : 'Has iniciado sesión correctamente';
    const alert = await this.alertController.create({
      header: 'Bienvenid@',
      subHeader: '',
      message: mes,
      buttons: ['OK']
    });
  }
  async presentAlert() {
    const alert = await this.alertController.create({
      header: 'Alert',
      subHeader: 'No esta logueado',
      message:
        'Las credenciales son incorrectas o el servicio no está disponible. Comprueba la conexión a internet',
      buttons: ['OK']
    });

    await alert.present();
  }



  /**
   * Almacena el usuario en local con el nombre 'user'
   * @param user el usuario a almacenar, en caso de omisión
   * saveSession() emilinará el usuario-> se emplea cuando cerramos
   * sesión.
   */
  public async saveSession(user?:any){
    if(user){
      await localStorage.setItem('user',user);
    }else{
      await localStorage.remove('user');
    }
  }

  public async checkSession(): Promise<void> {
    if (!this.user) {
      try {
        this.user = await JSON.parse(localStorage.getItem('user'));
      } catch (err) {
        this.user = null;
      }
    }
  }

    async loginGoogle() {
      return new Promise(async (resolve, reject) => {
        this.googlePlus
          .login({
            'webClientId': '605586204478-3uskc2gd2lulbsa9l2j4tej3bartjeum.apps.googleusercontent.com',
            'offline': true,
          }) // trying native mode
          .then(d => {
            if(d && d.email) {
              this.user = {
                email: d.email,
                displayName: d.displayName,
                imageUrl: d.imageUrl,
                userId: d.userId
              }
              
              localStorage.setItem('user', JSON.stringify(this.user));
            resolve(true);
            }else{
              resolve(false);
            }
          }).catch(async err => {
            console.error(err); // trying pwa mode
            try {
              // it uses Google auth by google credentials with pop up window
              console.log('Trying pwa mode');
              const provider = new auth.GoogleAuthProvider();
              const res = await this.authS.signInWithPopup(provider);
              this.user = res.user;
              localStorage.setItem('user', JSON.stringify(this.user));
              
              resolve(true);
            } catch (err) {
              console.log(err);
              reject(err);
            }}
          );
    });
    }


    public isAuthenticated(): boolean {
      return this.user ? true : false;
    }

    /**
   * it returns true is user is logged in.
   */
  public isLogged(): boolean {
    if (this.user != null) {
      return true; // it is already logged and stored in RAM (user variable)
    } else {
      // is it stored in cookies (we keep user logged in by default)?
      if (localStorage.getItem('user')) {
        this.user = JSON.parse(localStorage.getItem('user')); // ok, let's store in variable
        return true;
      } else {
        // if not in cookies, is it logged in cloud (server keeps cookies too)?
        this.authS.authState.subscribe(user => {
          if (user) {
            this.user = user; // YES, let's store in cookies and in RAM (variable)
            localStorage.setItem('user', JSON.stringify(this.user));
            return true;
          } else {
            // it is definitely not logged id. Let's remove from cookies to avoid bugs
            localStorage.removeItem('user');
            return false;
          }
        });
      }
      this.router.navigate(['login']);
    }
  }

  /**
   * Router Guard. This method is called from routing module.
   * If it returns true, then the page that user is trying to visit will be recheable.
   * The page won't be loaded if it returns false
   */
  public canActivate(): boolean {
    if (!this.isLogged()) {
      // this avoid bugs if user enters the url http//localhost:8100/tab2 directly.
      // The page wouldn't be recheable (thanks to routing module and canActivate call), but a blank
      // page'd be loaded. To avoid this, we make sure to redirect user to login page.
      this.router.navigate(['login']);
      return false;
    }
    return true;
  }
   /**
   * Sign out in Cloud, in Cookies and in RAM. Then, user is redirected to login page.
   */
  public async logOut() {
    try {
      await this.googlePlus.logout();

      this.firebase.signOut();

      this.user = null;
      localStorage.removeItem('user');
      this.router.navigate(['./login']);
    } catch (err) {
      try {
        console.log('logout pwa');
        await this.authS.signOut(); // next line executed when is loggout in cloud
        this.user = null;
        localStorage.removeItem('user');
        this.router.navigate(['./login']);
      } catch (err) {
        console.log(err);
      }
    }
  }





}
