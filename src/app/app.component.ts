import { Component } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { AuthService } from './services/auth.service';
import { User } from './model/User';
import { Router,NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss']
})
export class AppComponent {
  logged: Boolean;
  user:User;
  constructor(
    private platform: Platform,
    private splashScreen: SplashScreen,
    private statusBar: StatusBar,
    private auth : AuthService,private router :Router
  ) {
    this.initializeApp();
  }
  logOut(){
    this.auth.logOut();
  }
  isLogged() : boolean {
    return this.auth.isAuthenticated();
  }

  initializeApp() {
    this.platform.ready().then(async() => {
      await this.auth.isLogged();
      /**he comprobado si puedes o no ir a login */
      if(this.auth.isAuthenticated()){
        this.router.events.subscribe(event=>{
          if(event instanceof NavigationEnd){
            if(this.router.url==='/' 
            || this.router.url==='/login'){
              this.router.navigate(['/tabs/tab1']);
            }
          }
        })
      }

      this.statusBar.styleDefault();
      this.splashScreen.hide();
    });
  }
}
