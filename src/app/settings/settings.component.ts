import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {
    private userId!: number;

    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        } else {
            this.userId = JSON.parse(this.cookieService.get('journal_app_user')).id;
        }
    }

    changePassword() {
        let currentPassword = null;
        let password = null;
        let passwordConfirmation = null;

        if (document.getElementById('current-password') && document.getElementById('password') && document.getElementById('password-confirmation')) {
            currentPassword = (document.getElementById('current-password') as HTMLInputElement).value;
            password = (document.getElementById('password') as HTMLInputElement).value;
            passwordConfirmation = (document.getElementById('password-confirmation') as HTMLInputElement).value;
        }

        if (currentPassword && password && passwordConfirmation) {
            axios.post('https://demo-angular-nikkipanda.xyz/api/account/update_password', {
                id: this.userId,
                current_password: currentPassword,
                password: password,
                password_confirmation: passwordConfirmation
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

            .then(response => {
                (document.getElementById('update-password-error') as HTMLDivElement).innerHTML = '';
                (document.getElementById('current_password-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('password-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('password_confirmation-error') as HTMLSpanElement).innerHTML = '';

                if (response.data.isSuccess) {
                    (document.getElementById('update-password-error') as HTMLDivElement).innerHTML = `<div class="alert alert-success" role="alert">Password updated.</div>`;
                } else {
                    (document.getElementById('update-password-error') as HTMLDivElement).innerHTML = `<div class="alert alert-danger" role="alert">${response.data.errorText}</div>`;
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    Object.keys(err.response.data.errors).map((i, val) => {
                        const error: any = Object.values(err.response.data.errors)[val];
                        (document.getElementById(i + '-error') as HTMLSpanElement).innerHTML = error[0];
                    });
                };
            })
        } else {
            if (!(currentPassword)) {
                (document.getElementById('current_password-error') as HTMLSpanElement).innerHTML = 'Current password field cannot be empty.';
            }

            if (!(password)) {
                (document.getElementById('password-error') as HTMLSpanElement).innerHTML = 'Password field cannot be empty.';
            }

            if (!(passwordConfirmation)) {
                (document.getElementById('password_confirmation-error') as HTMLSpanElement).innerHTML = 'Password confirmation field cannot be empty.';
            }
        }
    }
}
