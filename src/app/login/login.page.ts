import { Component, OnInit } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { auth } from 'firebase/app';
import { Platform } from '@ionic/angular';
import { GooglePlus } from '@ionic-native/google-plus/ngx';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { CommonsService } from '../services/commons.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.scss'],
})
export class LoginPage implements OnInit {
  userdata: any;
  mensaje = false;
  submitting: boolean;

  public user: any;
  constructor( private authS: AngularFireAuth,private firebase: AngularFireAuth,
    private platform: Platform,private autService: AuthService,
    private googlePlus: GooglePlus, private commonS: CommonsService,
    private router: Router) { }

  ngOnInit() {
  }

  loginGoogle() {
    /**if (this.platform.is('cordova')) {
      this.loginGoogleAndroid();
    } else {
      this.loginGoogleWeb();
    }
    */
   if (this.submitting) { return; }

    this.commonS.showLoading("Cargando...");
    this.submitting = true;
    this.autService
      .loginGoogle()
      .then(res => {
        console.log(res);
        this.commonS.hideLoading();
        this.submitting = false;
        this.router.navigate(['./tabs/tab1']);
        this.commonS.toastCustom('Has iniciado sesión correctamente');
      })
      .catch(err => {
        this.commonS.hideLoading();
        this.submitting = false;
        this.autService.presentAlert(); // alert changed to fit device mode
        console.log(err);
      });


  }
  async loginGoogleAndroid() {
    return new Promise(async (resolve, reject) => {
      this.googlePlus
        .login({
      'webClientId': '605586204478-3uskc2gd2lulbsa9l2j4tej3bartjeum.apps.googleusercontent.com',
      'offline': true
    }).then(res => {
      this.user = {
        email: res.email // the response is different
      };
      resolve(true);
    
    this.router.navigate(['./tabs/tab1']);
  }).catch(async err =>{
    console.error(err);
    reject(err);
  });
});
}
isAuth(): boolean {
  return this.autService.isLogged();
}

  async loginGoogleWeb() {
	  const provider = new auth.GoogleAuthProvider();
    const res = await this.authS.signInWithPopup(provider);
    const user = res.user;
    console.log(user);
    this.router.navigate(['./tabs/tab1']);
  }

}
