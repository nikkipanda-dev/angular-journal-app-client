import axios from 'axios';
import { Component, OnInit } from '@angular/core';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {
    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        }
    }

    post() {
        let title = null;
        let body = null;

        if (document.getElementById('title') && document.getElementById('message')) {
            (document.getElementById('title-error') as HTMLInputElement).innerHTML = '';
            (document.getElementById('message-error') as HTMLInputElement).innerHTML = '';

            title = (document.getElementById('title') as HTMLInputElement).value;
            body = (document.getElementById('message') as HTMLInputElement).value;
        }

        if (title && body) {
            axios.post('http://localhost:8000/api/store', {
                title: title,
                body: body,
                // posted: new Intl.DateTimeFormat('en-US', {
                //     timeZone: 'Asia/Manila',
                //     dateStyle: 'medium',
                //     timeStyle: 'short',
                //     hourCycle: 'h12',
                // }).format(posted)
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
                withCredentials: true,
            })

            .then(response => {
                console.log('response post ', response.data)

                if (response.data.isSuccess) {
                    const allPosts = (document.getElementById('all-posts') as HTMLDivElement)

        //                 < div class="card mt-3" >
        //                     <div class="card-header" >
        //                         {{ post.id }
        //         }
        //         </div>
        //             < div class="card-body" >
        //                 <app-button text = "Edit" class="btn-dark" > </app-button>
        //                     < div >
        //                     {{ post.title }
        //     }
        // </div>
        //         < div >
        //         {{ post.body }}
        // </div>
        //     < p class="card-text text-center text-sm-end" > <small class="text-muted" > Last updated 3 mins ago < /small></p >
        //         </div>
        //         < /div>

                    const test = document.createElement('div');
                    allPosts.prepend(test);
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
