import { Component, OnInit } from '@angular/core';
import { User } from '../model/User';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.page.html',
  styleUrls: ['./profile.page.scss'],
})
export class ProfilePage implements OnInit {
  user:User;

  constructor(private auth : AuthService) { }

  ngOnInit() {
  }

}
