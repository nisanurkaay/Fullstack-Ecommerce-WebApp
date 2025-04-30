import { Component } from '@angular/core';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-auth',
  standalone: false,
  templateUrl: './auth.component.html',
  styleUrl: './auth.component.css'
})
export class AuthComponent implements OnInit {
  ngOnInit(): void {
    console.log('AuthComponent loaded');
  }
}
