import { Post } from '../Post';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {
    posts: Post[] = [];

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        }

        this.populatePosts();
    }

    populatePosts() {
        axios.get('http://localhost:8000/api/get', {
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })

        .then(response => {
            for (let val of response.data.data.posts) {
                const date = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Manila',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    hourCycle: 'h12',
                }).format(new Date(val.created_at));
                console.log('val', date)

                this.posts.push({
                    ...val,
                    parsed_date: date
                })
            }
        })

        .catch(err => {
            console.log('err ', err.response ? err.response : err)
        });
    }
}
