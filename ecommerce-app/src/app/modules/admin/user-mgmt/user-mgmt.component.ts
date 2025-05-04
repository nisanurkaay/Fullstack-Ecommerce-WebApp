import { Component } from '@angular/core';
import { OnInit } from '@angular/core';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models/user.model';

import { AuthService } from '../../../core/services/auth.service';
@Component({
  selector: 'app-user-mgmt',
  standalone: false,
  templateUrl: './user-mgmt.component.html',
  styleUrl: './user-mgmt.component.css'
})

export class UserMgmtComponent implements OnInit {
  users: User[] = [];
  filteredUsers: User[] = [];
  filter: 'ALL' | 'ROLE_USER' | 'ROLE_SELLER' | 'ROLE_ADMIN' = 'ALL';
  currentUserEmail: string | null = null;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit() {
    this.currentUserEmail = this.authService.getCurrentUserEmail();
    console.log('Current User Email:', this.currentUserEmail);
    this.loadUsers();
  }

  loadUsers() {
    this.userService.getAll().subscribe(users => {
      // Şu anki kullanıcıyı listeden çıkar
      this.users = users.filter(user => user.email !== this.currentUserEmail);
      this.applyFilter();
    });
  }

  applyFilter() {
    if (this.filter === 'ALL') {
      this.filteredUsers = this.users;
    } else {
      this.filteredUsers = this.users.filter(u => u.role === this.filter);
    }
  }

  setFilter(role: 'ALL' | 'ROLE_USER' | 'ROLE_SELLER' | 'ROLE_ADMIN') {
    this.filter = role;
    this.applyFilter();
  }

  toggleBan(user: User) {
    const action = user.userStatus === 'ACTIVE' ? this.userService.banUser(user.id!) : this.userService.unbanUser(user.id!);
    action.subscribe(() => {
      user.userStatus = user.userStatus === 'ACTIVE' ? 'BANNED' : 'ACTIVE';
    });
  }
}
