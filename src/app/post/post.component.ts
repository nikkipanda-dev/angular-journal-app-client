import { Post } from '../Post';
import { Component, OnInit, Input } from '@angular/core';
import axios from 'axios';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-post',
  templateUrl: './post.component.html',
  styleUrls: ['./post.component.css']
})
export class PostComponent implements OnInit {
    @Input() post!: Post;
    private userId!: number;

    constructor(private cookieService: CookieService) { }

    ngOnInit(): void {
        if (!(this.cookieService.check('journal_app_user')) && !(this.cookieService.check('journal_app_token'))) {
            window.location.pathname = '/'
        } else {
            this.userId = JSON.parse(this.cookieService.get('journal_app_user')).id;
        }
    }

    getData() {
        (document.getElementById('modal-body') as HTMLDivElement).innerHTML = '';
        (document.getElementById('static-modal-label') as HTMLDivElement).innerHTML = 'Update Post';

        console.log('edit this ', this.post)

        const editForm = document.createElement('div');
        editForm.innerHTML = `<div class="container"><div id="edit-post-alert" class="text-center text-sm-start"></div><div class="mb-3"><label for="update-title" class="form-label me-sm-2 header">Title</label><input type='hidden' name='user_id' id="user-id" value="${this.userId}" /><input type='hidden' name='post_id' id="post-id" value="${this.post.id}" /><input type="text" class="form-control" id="update-title" value="${this.post.title}"><span id="update-title-error" class="text-center text-sm-start text-danger small"></span></div><div class="mb-3"><label for="update-message" class="form-label header">Body</label><textarea class="form-control" id="update-message" rows="3" value="${this.post.body}">${this.post.body}</textarea><span id="update-message-error" class="text-center text-sm-start text-danger small"></span></div><div class="mb-3"><label for="update-image" class="form-label header">Update image:</label><input class="form-control form-control-sm" id="update-image" name="image" type="file" accept="image/*" /><span class="text-center text-sm-start" id="image-error"></span></div><div class="mb-5"><h6 class="header">Current image:</h6><img src="${this.post.parsed_image}" class="post-image" /></div><div class="mb-3 d-flex justify-content-center align-items-stretch align-items-sm-center"><button type='button' class="mt-3 btn btn-sm btn-outline-primary header" id="update-button">Save</button></div></div>`;

        (document.getElementById('modal-body') as HTMLDivElement).appendChild(editForm);
        (document.getElementById('update-button') as HTMLButtonElement).addEventListener('click', this.updatePost);
    }

    showAlert() {
        (document.getElementById('modal-body') as HTMLDivElement).innerHTML = '';
        (document.getElementById('static-modal-label') as HTMLDivElement).innerHTML = 'Confirm Deletion';

        const deleteAlert = document.createElement('div');
        deleteAlert.innerHTML = `<div id="delete-post-alert" class="text-center text-sm-start"><div class="alert alert-danger" role="alert">You are about to delete this post. Continue?</div></div><input type='hidden' name='user_id' id="user-id" value="${this.userId}" /><input type='hidden' name='post_id' id="post-id" value="${this.post.id}" /><div class="mb-3 d-flex flex-column flex-sm-row justify-content-center align-items-stretch align-items-sm-center"><button type='button' class="mt-3 btn btn-sm btn-danger header" id="delete-button">Delete</button></div>`;

        (document.getElementById('modal-body') as HTMLDivElement).appendChild(deleteAlert);
        (document.getElementById('delete-button') as HTMLButtonElement).addEventListener('click', this.deletePost);
    }

    updatePost() {
        let userId = null;
        let postId = null;
        let title = null;
        let body = null;
        let image: any = null;

        if (document.getElementById('user-id') && document.getElementById('post-id') && document.getElementById('update-title') && document.getElementById('update-message')) {
            (document.getElementById('update-title-error') as HTMLInputElement).innerHTML = '';
            (document.getElementById('update-message-error') as HTMLInputElement).innerHTML = '';

            userId = (document.getElementById('user-id') as HTMLInputElement).value;
            postId = (document.getElementById('post-id') as HTMLInputElement).value;
            title = (document.getElementById('update-title') as HTMLInputElement).value;
            body = (document.getElementById('update-message') as HTMLInputElement).value;
            image = (document.getElementById('update-image') as HTMLInputElement).files;
        }

        if (userId && postId && title && body) {
            const updatePostForm: any = new FormData();
            updatePostForm.append('user_id', userId);
            updatePostForm.append('post_id', postId);
            updatePostForm.append('title', title);
            updatePostForm.append('body', body);
            image[0] && updatePostForm.append('image', image[0]);

            axios.post('https://demo-angular-nikkipanda.xyz/api/update', updatePostForm, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })

            .then(response => {
                if (response.data.isSuccess) {
                    let ctr = 3;

                    const redirect = setInterval(function () {
                        if (ctr <= 0) {
                            clearInterval(redirect);
                            window.location.pathname = '/posts';
                            window.scrollTo(0, 0);
                        } else {
                            (document.getElementById('edit-post-alert') as HTMLDivElement).innerHTML = `<div class="alert alert-success" role="alert">Successfully updated post. Reloading in ${ctr + (ctr > 1 ? ' seconds...' : ' second...')}</div>`;
                        }
                        ctr -= 1;
                    }, 1000);
                } else {
                    let ctr = 3;

                    const redirect = setInterval(function () {
                        if (ctr <= 0) {
                            clearInterval(redirect);
                            window.location.pathname = '/posts';
                            window.scrollTo(0, 0);
                        } else {
                            (document.getElementById('edit-post-alert') as HTMLDivElement).innerHTML = `<div class="alert alert-secondary" role="alert">${response.data.errorText} Reloading in ${ctr + (ctr > 1 ? ' seconds...' : ' second...')}</div>`;
                        }
                        ctr -= 1;
                    }, 1000);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : '');
            });
        } else {
            if (!(postId)) {
                console.log('Invalid post ID provided.');
            }

            if (!(title)) {
                (document.getElementById('update-title-error') as HTMLInputElement).innerHTML = 'Title field is required.';
            }

            if (!(body)) {
                (document.getElementById('update-message-error') as HTMLInputElement).innerHTML = 'Body field is required.';
            }
        }
    }

    deletePost() {
        let userId = null;
        let postId = null;

        if (document.getElementById('user-id') && document.getElementById('post-id')) {
            userId = userId = (document.getElementById('user-id') as HTMLInputElement).value;
            postId = (document.getElementById('post-id') as HTMLInputElement).value;
        }

        if (postId) {
            axios.post('https://demo-angular-nikkipanda.xyz/api/destroy', {
                user_id: userId,
                post_id: postId,
            }, {
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                },
            })

            .then(response => {
                if (response.data.isSuccess) {
                    let ctr = 3;

                    const redirect = setInterval(function () {
                        if (ctr <= 0) {
                            clearInterval(redirect);
                            window.location.pathname = '/posts';
                            window.scrollTo(0, 0);
                        } else {
                            (document.getElementById('delete-post-alert') as HTMLDivElement).innerHTML = `<div class="alert alert-success" role="alert">Successfully deleted post. Reloading in ${ctr + (ctr > 1 ? ' seconds...' : ' second...')}</div>`;
                        }
                        ctr -= 1;
                    }, 1000);
                } else {
                    console.log('post err ', response.data.errorText);
                }
            })

            .catch(err => {
                console.log('err ', err.response ? err.response : '');
            });
        } else {
            if (!(postId)) {
                console.log('Invalid post ID provided.');
            }
        }
    }
}
