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
            axios.post('http://localhost:8000/api/register', {
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
                        console.log('register err ', response.data.errorText);
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
