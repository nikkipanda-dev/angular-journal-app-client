import { Component, Injectable, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Injectable()
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {

    constructor(private cookieService: CookieService) {
        this.checkCookies();
    }

    ngOnInit(): void {}

    checkCookies() {
        if (this.cookieService.get('journal_app_user') && this.cookieService.get('journal_app_token')) {
            window.location.pathname = '/posts';
        }
    }
}
