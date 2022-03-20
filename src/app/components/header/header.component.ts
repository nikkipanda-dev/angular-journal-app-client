import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'Digital Journal';
  showAuthActions!: boolean;
  
    constructor(private cookieService: CookieService) {
        this.checkCookies();
  }

    ngOnInit(): void {}

    checkCookies() {
        if (this.cookieService.check('journal_app_user') && this.cookieService.check('journal_app_token')) {
            this.showAuthActions = false;
        } else {
            this.showAuthActions = true;
        }
    }

    logout() {
        console.log('logout', JSON.parse(this.cookieService.get('journal_app_user')))

        if (!(this.showAuthActions)) {
            axios.post('http://localhost:8000/api/logout', {
                id: JSON.parse(this.cookieService.get('journal_app_user')).id
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*'
                }
            })

            .then(response => {
                if (response.data.isSuccess) {
                    this.cookieService.delete('journal_app_user');

                    this.cookieService.delete('journal_app_token');

                    if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
                        window.location.pathname = '/'
                    } else {
                        window.location.pathname = '/posts'
                    }
                } else {
                    console.log('logout err ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response.data.errors : '');
            })
        }
    }
}
