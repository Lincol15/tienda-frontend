import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [RouterLink, FormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent {
  username = '';
  password = '';
  error = false;
  loading = false;

  constructor(
    private auth: AuthService,
    private router: Router
  ) {}

  submit(): void {
    this.error = false;
    this.loading = true;
    this.auth.login({ username: this.username, password: this.password }).subscribe({
      next: (res) => {
        this.loading = false;
        if (res) {
          this.router.navigate(['/admin']);
        } else {
          this.error = true;
        }
      },
      error: () => {
        this.loading = false;
        this.error = true;
      }
    });
  }
}
