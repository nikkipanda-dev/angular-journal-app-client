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
    page: number = 1;
    allPostsLen!: number;
    pageLen!: number;
    private userId!: number;

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        } else {
            this.userId = JSON.parse(this.cookieService.get('journal_app_user')).id;
        }

        this.populatePosts();
    }

    previous() {
        if (this.allPostsLen > 5) { 
            this.posts = [];

            ((this.page > 1) && (this.page <= Math.ceil(this.allPostsLen / 5))) && (this.page -= 1);

            axios.get('https://demo-angular-nikkipanda.xyz/api/paginate', {
                params: {
                    user_id: this.userId,
                    offset: (this.page * 5) - 5,
                    limit: 5
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })

            .then(response => {
                if (response.data.isSuccess) {
                    for (let val of response.data.data.posts) {
                        const date = new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            hourCycle: 'h12',
                        }).format(new Date(val.created_at));

                        this.posts.push({
                            ...val,
                            parsed_date: date,
                            parsed_image: (val.images.length > 0) ? new URL(val.images[0].path, 'https://demo-angular-nikkipanda.xyz/') : '',
                        })
                    }
                } else {
                    console.log('paginate ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : err)
            });
        }
    }

    next() {
        if (this.allPostsLen > 5) {
            this.posts = [];

            ((this.page >= 1) && (this.page <= Math.ceil(this.allPostsLen / 5) - 1)) && (this.page += 1);

            axios.get('https://demo-angular-nikkipanda.xyz/api/paginate', {
                params: {
                    user_id: this.userId,
                    offset: (this.page * 5) - 5,
                    limit: 5
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })

            .then(response => {
                if (response.data.isSuccess) {
                    for (let val of response.data.data.posts) {
                        const date = new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            hourCycle: 'h12',
                        }).format(new Date(val.created_at));

                        this.posts.push({
                            ...val,
                            parsed_date: date,
                            parsed_image: (val.images.length > 0) ? new URL(val.images[0].path, 'https://demo-angular-nikkipanda.xyz/') : '',
                        })
                    }
                } else {
                    console.log('paginate err ', response.data.errorText)
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : err)
            });
        }
    }

    populatePosts() {
        axios.get('https://demo-angular-nikkipanda.xyz/api/get', {
            params: {
                user_id: this.userId,
            },
            headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                'Access-Control-Allow-Origin': '*',
            },
        })

        .then(response => {
            if (response.data.isSuccess) {
                this.allPostsLen = response.data.data.posts.length;
                if (this.allPostsLen > 0) {
                    this.pageLen = Math.ceil(this.allPostsLen / 5) - 1;
                } else {
                    this.pageLen = 0;
                }

                for (let val of response.data.data.posts.slice(0, 5)) {
                    const date = new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Manila',
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        hourCycle: 'h12',
                    }).format(new Date(val.created_at));

                    this.posts.push({
                        ...val,
                        parsed_date: date,
                        parsed_image: (val.images.length > 0) ? new URL(val.images[0].path, 'https://demo-angular-nikkipanda.xyz/') : '',
                        
                    })
                }
            } else {
                console.log('err get all ', response.data.errorText);
            }
        })

        .catch(err => {
            console.log('err ', err.response ? err.response : err)
        });
    }
}
