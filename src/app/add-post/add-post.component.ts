import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
    private userId!: number;

    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        } else {
            this.userId = JSON.parse(this.cookieService.get('journal_app_user')).id;
        }
    }

    post() {
        let userId = null;
        let title = null;
        let body = null;

        if (document.getElementById('title') && document.getElementById('message')) {
            (document.getElementById('title-error') as HTMLInputElement).innerHTML = '';
            (document.getElementById('message-error') as HTMLInputElement).innerHTML = '';

            userId = this.userId;
            title = (document.getElementById('title') as HTMLInputElement).value;
            body = (document.getElementById('message') as HTMLInputElement).value;
        }

        if (userId && title && body) {
            axios.post('https://demo-angular-nikkipanda.xyz/api/store', {
                user_id: userId,
                title: title,
                body: body,
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
                    location.reload();
                    window.scrollTo(0, 0);
                } else {
                    console.log('post err ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : '');
            })
        } else {
            if (!(title)) {
                (document.getElementById('title-error') as HTMLInputElement).innerHTML = 'Title error';
            }

            if (!(body)) {
                (document.getElementById('message-error') as HTMLInputElement).innerHTML = 'Body error';
            }
        }
    }
}
