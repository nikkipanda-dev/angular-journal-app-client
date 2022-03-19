import { Post } from '../Post';
import { Component, OnInit } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-all-posts',
  templateUrl: './all-posts.component.html',
  styleUrls: ['./all-posts.component.css']
})
export class AllPostsComponent implements OnInit {
    posts: Post[] = [];

    constructor() {
        this.populatePosts();
    }

    ngOnInit(): void {
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
            const postsResponse = response.data;
            console.log('HELOOOOOOO', postsResponse);

            this.posts = (postsResponse.data.posts.length > 0) ? postsResponse.data.posts : [];
            // console.log('posts ', this.posts)

            // for (let i of this.posts) {
            //     (document.getElementById('all-posts') as HTMLDivElement).append(i.title);
            // }
        })

        .catch(err => {
            console.log('err ', err.response ? err.response : '')
        });
    }
}
