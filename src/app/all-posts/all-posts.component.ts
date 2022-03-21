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

    constructor(private cookieService: CookieService) {}

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        }

        this.populatePosts();
    }

    previous() {
        if (this.allPostsLen > 5) { 
            this.posts = [];

            ((this.page > 1) && (this.page <= Math.ceil(this.allPostsLen / 5))) && (this.page -= 1);

            axios.get('https://demo-angular-nikkipanda.xyz/api/paginate', {
                params: {
                    user_id: JSON.parse(this.cookieService.get('journal_app_user')).id,
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
                console.log('response ', response.data.data.posts)
                if (response.data.isSuccess) {
                    for (let val of response.data.data.posts) {
                        console.log('id ', val.id);

                        const date = new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            hourCycle: 'h12',
                        }).format(new Date(val.created_at));

                        this.posts.push({
                            ...val,
                            parsed_date: date
                        })
                    }
                } else {
                    console.log('paginate ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : err)
            });
        } else {
            console.log('not more than 5');
        }
    }

    next() {
        if (this.allPostsLen > 5) {
            this.posts = [];

            ((this.page >= 1) && (this.page <= Math.ceil(this.allPostsLen / 5) - 1)) && (this.page += 1);

            axios.get('https://demo-angular-nikkipanda.xyz/api/paginate', {
                params: {
                    user_id: JSON.parse(this.cookieService.get('journal_app_user')).id,
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
                        console.log('id ', val.id);

                        const date = new Intl.DateTimeFormat('en-US', {
                            timeZone: 'Asia/Manila',
                            dateStyle: 'medium',
                            timeStyle: 'short',
                            hourCycle: 'h12',
                        }).format(new Date(val.created_at));

                        this.posts.push({
                            ...val,
                            parsed_date: date
                        })
                    }
                } else {
                    console.log('paginate err ', response.data.errorText)
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : err)
            });
        } else {
            console.log('not more than 5 ', this.posts);
        }
    }

    populatePosts() {
        axios.get('https://demo-angular-nikkipanda.xyz/api/get', {
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
                this.allPostsLen = response.data.data.posts.length;

                for (let val of response.data.data.posts.slice(0, 5)) {
                    const date = new Intl.DateTimeFormat('en-US', {
                        timeZone: 'Asia/Manila',
                        dateStyle: 'medium',
                        timeStyle: 'short',
                        hourCycle: 'h12',
                    }).format(new Date(val.created_at));

                    this.posts.push({
                        ...val,
                        parsed_date: date
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
