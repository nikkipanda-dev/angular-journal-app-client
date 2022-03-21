import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-posts',
  templateUrl: './posts.component.html',
  styleUrls: ['./posts.component.css']
})
export class PostsComponent implements OnInit {

    constructor(private cookieService: CookieService) { }

  ngOnInit(): void {
      if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
      }
  }
}
