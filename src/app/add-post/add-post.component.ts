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
        let image: any = null;

        if (document.getElementById('title') && document.getElementById('message') && document.getElementById('image')) {
            (document.getElementById('title-error') as HTMLSpanElement).innerHTML = '';
            (document.getElementById('body-error') as HTMLSpanElement).innerHTML = '';
            (document.getElementById('image-error') as HTMLSpanElement).innerHTML = '';

            userId = this.userId;
            title = (document.getElementById('title') as HTMLInputElement).value;
            body = (document.getElementById('message') as HTMLInputElement).value;
            image = (document.getElementById('image') as HTMLInputElement).files;
        }

        if (userId && title && body) {
            const formData: any = new FormData();
            formData.append('user_id', userId);
            formData.append('title', title);
            formData.append('body', body);
            image[0] && formData.append('image', image[0]);

            axios.post('https://demo-angular-nikkipanda.xyz/api/store', formData, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                withCredentials: true,
            })

            .then(response => {
                (document.getElementById('title-error') as HTMLSpanElement).innerHTML = '';
                (document.getElementById('body-error') as HTMLSpanElement).innerHTML = '';

                if (response.data.isSuccess) {
                    location.reload();
                    window.scrollTo(0, 0);
                } else {
                    console.log('post err ', response.data.errorText);
                }
            })

            .catch(err => {
                if (err.response && err.response.data.errors) {
                    Object.keys(err.response.data.errors).map((i, val) => {
                        const error: any= Object.values(err.response.data.errors)[val];
                        (document.getElementById(i + '-error') as HTMLSpanElement).innerHTML = error[0];
                    });
                };
            })
        } else {
            if (!(title)) {
                (document.getElementById('title-error') as HTMLSpanElement).innerHTML = 'Title error';
            }

            if (!(body)) {
                (document.getElementById('body-error') as HTMLSpanElement).innerHTML = 'Body error';
            }
        }
    }
}
