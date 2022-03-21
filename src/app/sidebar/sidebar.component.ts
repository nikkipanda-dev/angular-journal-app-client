import { Component, OnInit } from '@angular/core';
import axios from 'axios';
import { Post } from '../Post';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css']
})
export class SidebarComponent implements OnInit {
    postsLen!: number;
    userDetails: any = [];
    randomPost: any = [];

    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        } else {
            this.userDetails = JSON.parse(this.cookieService.get('journal_app_user'));

            const date = new Intl.DateTimeFormat('en-US', {
                timeZone: 'Asia/Manila',
                dateStyle: 'medium',
                hourCycle: 'h12',
            }).format(new Date(this.userDetails.created_at));

            this.userDetails = {
                ...this.userDetails,
                created_at: date
            }
        }

        this.getLen();
        this.getRandomPost();
    }

    getLen() {
        axios.get('http://localhost:8000/api/get', {
            params: {
                user_id: JSON.parse(this.cookieService.get('journal_app_user')).id,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })

        .then(response => {
            if (response.data.isSuccess) {
                this.postsLen = response.data.data.posts.length;
            } else {
                console.log('err get all ', response.data.errorText);
            }
        })

        .catch(err => {
            console.log('err ', err.response ? err.response : err)
        });
    }

    getRandomPost() {
        axios.get('http://localhost:8000/api/get/random', {
            params: {
                user_id: JSON.parse(this.cookieService.get('journal_app_user')).id,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })

        .then(response => {
            if (response.data.isSuccess) {
                const date = new Intl.DateTimeFormat('en-US', {
                    timeZone: 'Asia/Manila',
                    dateStyle: 'medium',
                    timeStyle: 'short',
                    hourCycle: 'h12',
                }).format(new Date(response.data.data.post.created_at));

                this.randomPost = {
                    ...response.data.data.post, 
                    'created_at': date
                };

                console.log('random ', this.randomPost)
            } else {
                console.log('err get all ', response.data.errorText);
            }
        })

        .catch(err => {
            console.log('err ', err.response ? err.response : err)
        });
    }
}
