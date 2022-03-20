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
        (document.getElementById('modal-body') as HTMLDivElement).innerHTML = '';

        console.log('this ', this)

        const editForm = document.createElement('div');
        editForm.innerHTML = `<div class="container"><div class="mb-3"><label for="update-title" class="form-label">Title</label><input type='hidden' name='post_id' id="post-id" value="${this.post.id}" /><input type="text" class="form-control" id="update-title" value="${this.post.title}"><span id="update-title-error"></span></div><div class="mb-3"><label for="update-message" class="form-label">Body</label><textarea class="form-control" id="update-message" rows="3" value="${this.post.body}">${this.post.body}</textarea><span id="update-message-error"></span></div><div class="mb-3"><button type='button' class="btn btn-sm btn-secondary" id="update-button">Save</button></div></div>`;

        (document.getElementById('modal-body') as HTMLDivElement).appendChild(editForm);
        (document.getElementById('update-button') as HTMLButtonElement).addEventListener('click', this.updatePost);
    }

    showAlert() {
        (document.getElementById('modal-body') as HTMLDivElement).innerHTML = '';

        console.log('this ', this)

        const deleteAlert = document.createElement('div');
        deleteAlert.innerHTML = `<div class="alert alert-danger" role="alert">You are about to delete this post. Continue?</div><input type='hidden' name='post_id' id="post-id" value="${this.post.id}" /><div class="mb-3 d-flex flex-column flex-sm-row justify-content-center align-items-stretch align-items-sm-center"><button type='button' class="btn btn-sm btn-danger" id="delete-button">Delete</button></div>`;

        (document.getElementById('modal-body') as HTMLDivElement).appendChild(deleteAlert);
        (document.getElementById('delete-button') as HTMLButtonElement).addEventListener('click', this.deletePost);
    }

    updatePost() {
        let postId = null;
        let title = null;
        let body = null;

        if (document.getElementById('post-id') && document.getElementById('update-title') && document.getElementById('update-message')) {
            (document.getElementById('update-title-error') as HTMLInputElement).innerHTML = '';
            (document.getElementById('update-message-error') as HTMLInputElement).innerHTML = '';

            postId = (document.getElementById('post-id') as HTMLInputElement).value;
            title = (document.getElementById('update-title') as HTMLInputElement).value;
            body = (document.getElementById('update-message') as HTMLInputElement).value;
        }

        if (postId && title && body) {
            axios.post('http://localhost:8000/api/update', {
                id: postId,
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
            if (!(postId)) {
                console.log('Invalid post ID provided.');
            }

            if (!(title)) {
                (document.getElementById('update-title-error') as HTMLInputElement).innerHTML = 'Title error';
            }

            if (!(body)) {
                (document.getElementById('update-message-error') as HTMLInputElement).innerHTML = 'Body error';
            }
        }
    }

    deletePost() {
        let postId = null;

        if (document.getElementById('post-id')) {
            postId = (document.getElementById('post-id') as HTMLInputElement).value;
        }

        if (postId) {
            axios.post('http://localhost:8000/api/destroy', {
                id: postId,
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
            if (!(postId)) {
                console.log('Invalid post ID provided.');
            }
        }
    }
}
