import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
    ngOnInit(): void { 
        setTimeout(() => {
            (document.getElementById('loader') as HTMLDivElement).classList.remove('d-block');
            (document.getElementById('loader') as HTMLDivElement).classList.add('d-none');
            (document.getElementById('main') as HTMLDivElement).classList.remove('d-none');
        }, 300);
    }
}
