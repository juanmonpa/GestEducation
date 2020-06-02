import { Component } from '@angular/core';
import { AngularFireAuth } from '@angular/fire/auth';
import { AngularFireDatabase } from '@angular/fire/database';
import { AuthService } from '../services/auth.service';
import { User } from '../model/User';

@Component({
  selector: 'app-tab2',
  templateUrl: 'tab2.page.html',
  styleUrls: ['tab2.page.scss']
})
export class Tab2Page {
  connected = false;
  userId: any;
  messageText: any;
  public messages: any = [];
  user:User;
  email:any;

  constructor(private afAuth: AngularFireAuth,private afDB: AngularFireDatabase,private auths: AuthService) { 
    this.connected=auths.isLogged();
    
      if (!this.connected) {
        console.log('no esta conectado');
      } else {
        console.log(this.connected);
        this.user = JSON.parse(localStorage.getItem('user'));
        console.log(this.user)
        this.userId=this.user.userId;
        this.email=this.user.email;
        console.log(this.userId);
        this.getMessages();
      }
    
  }
  sendMessage() {
    this.afDB.list('Messages/').push({
      userId: this.user.email,
      text: this.messageText,
      date: new Date().toISOString()
    });
    this.messageText = '';
  }
  getMessages() {
    this.afDB.list('Messages/', ref => ref.orderByChild('date')).snapshotChanges(['child_added'])
    .subscribe(actions => {
      this.messages = [];
      actions.forEach(action => {
        this.messages.push({
          userId: action.payload.exportVal().userId,
          text: action.payload.exportVal().text,
          date: action.payload.exportVal().date
        });
      });
    });
  }

}
