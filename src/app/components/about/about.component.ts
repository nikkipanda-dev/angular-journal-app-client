import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {
    pathname!: string;

    constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
      if (this.cookieService.get('journal_app_user') && this.cookieService.get('journal_app_token')) {
        this.pathname = '/posts'
      } else {
          this.pathname = '/'
      }
  }

}
