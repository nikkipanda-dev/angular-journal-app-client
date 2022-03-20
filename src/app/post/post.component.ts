import { Post } from '../Post';
import { Component, OnInit, Input } from '@angular/core';
import axios from 'axios';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
    @Input() post!: Post;

    constructor() { }

    ngOnInit(): void {
    }

    getData() {
        (document.getElementById('modal-body') as HTMLDivElement).innerHTML = ''

        const editForm = document.createElement('div');
        editForm.innerHTML = `<div class="container"><div class="mb-3"><label for="update-title" class="form-label">Title</label><input type='hidden' name='user_id' id="user-id" value="${this.post.id}" /><input type="text" class="form-control" id="update-title" value="${this.post.title}"><span id="update-title-error"></span></div><div class="mb-3"><label for="update-message" class="form-label">Body</label><textarea class="form-control" id="update-message" rows="3" value="${this.post.body}">${this.post.body}</textarea><span id="update-message-error"></span></div><div class="mb-3"><button type='button' class="btn btn-sm btn-secondary" id="update-button">Save</button></div></div>`;

        (document.getElementById('modal-body') as HTMLDivElement).appendChild(editForm);
        (document.getElementById('update-button') as HTMLButtonElement).addEventListener('click', this.updatePost);
    }

    updatePost() {
        let userId = null;
        let title = null;
        let body = null;

        if (document.getElementById('user-id') && document.getElementById('update-title') && document.getElementById('update-message')) {
            (document.getElementById('update-title-error') as HTMLInputElement).innerHTML = '';
            (document.getElementById('update-message-error') as HTMLInputElement).innerHTML = '';

            userId = (document.getElementById('user-id') as HTMLInputElement).value;
            title = (document.getElementById('update-title') as HTMLInputElement).value;
            body = (document.getElementById('update-message') as HTMLInputElement).value;
        }

        if (title && body) {
            axios.post('http://localhost:8000/api/update', {
                id: userId,
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
                (document.getElementById('update-title-error') as HTMLInputElement).innerHTML = 'Title error';
            }

            if (!(body)) {
                (document.getElementById('update-message-error') as HTMLInputElement).innerHTML = 'Body error';
            }
        }
    }
}
