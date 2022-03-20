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
            axios.post('http://demo-angular-nikkipanda.xyz/api/login', {
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
                    console.log('login err ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : '');
            })
        } else {
            console.log('empty');
        }
    }
}
