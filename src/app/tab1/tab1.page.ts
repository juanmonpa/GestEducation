import { Component, OnInit, ViewChild } from '@angular/core';
import { FileChooser } from '@ionic-native/file-chooser/ngx';
import { File } from '@ionic-native/file/ngx';
import * as firebase from 'firebase/app';
import { AngularFireStorage } from '@angular/fire/storage';
import { ToastController, AlertController, IonVirtualScroll, IonInfiniteScroll } from '@ionic/angular';
import { InAppBrowser } from '@ionic-native/in-app-browser/ngx';
import { CommonsService } from '../services/commons.service';
@Component({
  selector: 'app-tab1',
  templateUrl: 'tab1.page.html',
  styleUrls: ['tab1.page.scss']
})
export class Tab1Page {
  @ViewChild('infiniteScroll', null) ionInfiniteScroll: IonInfiniteScroll;
  @ViewChild(IonVirtualScroll, null) virtualScroll: IonVirtualScroll;
  resetInfinityScroll: IonInfiniteScroll;
  cloudFiles = [];
  

  constructor(private filechooser: FileChooser, private file: File, private toastCtrl: ToastController, private commonS: CommonsService, private alertController: AlertController,
    private storage: AngularFireStorage, private iab: InAppBrowser) {

    }
    ionViewDidEnter() {
    this.loadFiles(); 
  }

  loadFiles() {
    this.cloudFiles = [];
    this.commonS.showLoading("Cargando...");
    const storageRef = firebase.storage().ref('files');
    storageRef.listAll().then(result => {
      result.items.forEach(async ref => {
        console.log(ref);
        this.cloudFiles.push({
          name: ref.name,
          full: ref.fullPath,
          url: await ref.getDownloadURL(),
          ref: ref
        });
    
      });
      this.commonS.hideLoading();
    });
    
  }

  public async refreshEntries(e) {
    await this.loadFiles();
    // close the refresher
    e.target.complete();
  }

  openExternal(url) {
    this.iab.create(url);
  }

  deleteFile(ref: firebase.storage.Reference) {
    this.presentAlertConfirm(ref);
  }

  async presentAlertConfirm(ref) {
    const alert = await this.alertController.create({
      header: 'Aviso',
      message: '¿Eliminar <strong>' + ref.name + '</strong>?',
      buttons: [
        {
          text: 'Cancelar',
          role: 'cancel',
          cssClass: 'secondary',
          handler: blah => {
            console.log('Confirm Cancel: blah');
          }
        },
        {
          text: 'Confirmar',
          handler: () => {
            this.commonS.showLoading();
            ref.delete().then(() => {
              this.commonS.hideLoading();
              this.loadFiles();
            });
          }
        }
      ]
    });

    await alert.present();
  }
}
