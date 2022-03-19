import { Component, Injectable, OnInit } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
    private cookieValue!: string;

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {

        window.addEventListener('load', function (evt) {
            console.log('loaded');

            (document.getElementById('register-form') as HTMLFormElement).addEventListener('submit', function (evt) {
                evt.preventDefault();

                let email = (document.getElementById('email') as HTMLInputElement).value;
                let password = (document.getElementById('password') as HTMLInputElement).value;
                let passwordConfirmation = (document.getElementById('password-confirmation') as HTMLInputElement).value;

                console.log(evt);

                if (email && password && passwordConfirmation) {
                    axios.post('https://demo-angular-nikkipanda.xyz/api/register', {
                        email: email,
                        password: password,
                        password_confirmation: passwordConfirmation
                    }, {
                        headers: { 
                            'Content-Type': 'application/json',
                            'Accept': 'application/json',
                            'Access-Control-Allow-Origin' : '*'
                        }
                    })

                    .then (response => {
                        console.log('res ', response.data);
                    })

                    .catch (err => {
                        console.log('err ', err.response ? err.response : '');
                    })
                } else {
                    console.log('empty');
                }

                console.log('submit');
            });
        });

        (document.getElementById('login-form') as HTMLFormElement).addEventListener('submit', function (evt) {
            evt.preventDefault();

            let email = (document.getElementById('user-email') as HTMLInputElement).value;
            let password = (document.getElementById('user-password') as HTMLInputElement).value;

            console.log(evt);

            if (email && password) {
                axios.post('https://demo-angular-nikkipanda.xyz/api/login', {
                    email: email,
                    password: password,
                }, {
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                    },
                    withCredentials: true,
                })

                    .then(response => {
                        if (response.data.isSuccess) {
                            window.location.href = "http://localhost:4200/posts";
                        }
                    })

                    .catch(err => {
                        console.log('err ', err);
                    });
            } else {
                console.log('empty');
            }

            console.log('submit');
        });

        axios.get('http://localhost:8000/api/get', )
    }
}
