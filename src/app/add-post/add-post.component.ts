import axios from 'axios';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-add-post',
  templateUrl: './add-post.component.html',
  styleUrls: ['./add-post.component.css']
})
export class AddPostComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
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
                console.log('response ', response.data)
                // const allPosts = (document.getElementById('all-posts') as HTMLDivElement)
                // console.log('all posts', allPosts);
                // allPosts.prepend('hello');
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : '');
            })
        } else {
            if (!(title)) {
                (document.getElementById('title-error') as HTMLInputElement).innerHTML = 'Title error';
            }

            if (!(body)) {
                (document.getElementById('message-error') as HTMLInputElement).innerHTML = 'Title error';
            }
        }
    }
}
