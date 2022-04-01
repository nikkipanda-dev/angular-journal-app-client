import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';
import axios from 'axios';

@Component({
  selector: 'app-reset-password',
  templateUrl: './reset-password.component.html',
  styleUrls: ['./reset-password.component.css']
})
export class ResetPasswordComponent implements OnInit {
    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
    }

    resetPassword() {
        let email = (document.getElementById('email') as HTMLInputElement).value;
        let password = (document.getElementById('password') as HTMLInputElement).value;
        let passwordConfirmation = (document.getElementById('password-confirmation') as HTMLInputElement).value;

        if (email && password && passwordConfirmation) {
            axios.post('https://demo-angular-nikkipanda.xyz/api/account/reset_password', {
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
                (document.getElementById('reset-password-alert') as HTMLDivElement).innerHTML = '';
                (document.getElementById('email-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('password-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('password_confirmation-error') as HTMLSpanElement).innerHTML = '';

                if (response.data.isSuccess) {
                    this.cookieService.delete('journal_app_user');

                    this.cookieService.delete('journal_app_token');

                    if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
                        let ctr = 5;

                        const redirect = setInterval(function () {
                            if (ctr <= 0) {
                                clearInterval(redirect);
                                window.location.pathname = '/login';
                            } else {
                                (document.getElementById('reset-password-alert') as HTMLDivElement).innerHTML = `<div class="alert alert-success" role="alert">Successfully reset password. Redirecting to login in ${ctr + (ctr > 1 ? ' seconds...' : ' second...')}</div>`;
                            }
                            ctr -= 1;
                        }, 1000);
                    } else {
                        window.location.pathname = '/'
                    }
                } else {
                    (document.getElementById('reset-password-alert') as HTMLDivElement).innerHTML = `<div class="alert alert-danger" role="alert">${response.data.errorText}</div>`;
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
                (document.getElementById('password-error') as HTMLSpanElement).innerHTML = 'Password field cannot be empty.';
            }
        }
    }
}
