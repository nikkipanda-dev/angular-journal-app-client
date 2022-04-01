import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent implements OnInit {

    constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
  }

    register() {
        let email = (document.getElementById('email') as HTMLInputElement).value;
        let password = (document.getElementById('password') as HTMLInputElement).value;
        let passwordConfirmation = (document.getElementById('password-confirmation') as HTMLInputElement).value;

        if (email && password && passwordConfirmation) {
            axios.post('https://demo-angular-nikkipanda.xyz/api/register', {
                email: email,
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
                (document.getElementById('register-error') as HTMLDivElement).innerHTML = '';
                (document.getElementById('register-email-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('register-password-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('register-password_confirmation-error') as HTMLSpanElement).innerHTML = '';

                if (response.data.isSuccess) {
                    this.cookieService.set('journal_app_user', JSON.stringify(response.data.data.user.details), {
                        expires: new Date().getHours() + 1,
                        sameSite: 'Strict',
                        secure: true,
                    });

                    this.cookieService.set('journal_app_token', JSON.stringify(response.data.data.user.token), {
                        expires: new Date().getHours() + 1,
                        sameSite: 'Strict',
                        secure: true,
                    });

                    if (this.cookieService.check('journal_app_user') && this.cookieService.check('journal_app_token')) {
                        window.location.pathname = '/posts'
                    } else {
                        window.location.pathname = '/'
                    }
                } else {
                    (document.getElementById('register-error') as HTMLDivElement).innerHTML = `<div class="alert alert-danger" role="alert">${response.data.errorText}</div>`;
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    Object.keys(err.response.data.errors).map((i, val) => {
                        const error: any = Object.values(err.response.data.errors)[val];
                        (document.getElementById('register-' + i + '-error') as HTMLSpanElement).innerHTML = error[0];
                    });
                };
            })
        } else {
            if (!(email)) {
                (document.getElementById('register-email-error') as HTMLSpanElement).innerHTML = 'Email address field cannot be empty.';
            }

            if (!(password)) {
                (document.getElementById('register-password-error') as HTMLSpanElement).innerHTML = 'Password field cannot be empty.';
            }
        }
    }
}
