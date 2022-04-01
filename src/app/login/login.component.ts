import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {

    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
    }

    login() {
        let email = (document.getElementById('login-email') as HTMLInputElement).value;
        let password = (document.getElementById('login-password') as HTMLInputElement).value;

        if (email && password) {
            axios.post('http://localhost:8000/api/login', {
                email: email,
                password: password,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

            .then(response => {
                (document.getElementById('login-error') as HTMLDivElement).innerHTML = '';
                (document.getElementById('email-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('password-error') as HTMLSpanElement).innerHTML = '';

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
                    (document.getElementById('login-error') as HTMLDivElement).innerHTML = `<div class="alert alert-danger" role="alert">${response.data.errorText}</div>`;
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
            if (!(email)) {
                (document.getElementById('email-error') as HTMLSpanElement).innerHTML = 'Email address field cannot be empty.';
            }

            if (!(password)) {
                (document.getElementById('password-error') as HTMLSpanElement).innerHTML = 'Email address field cannot be empty.';
            }
        }
    }
}
