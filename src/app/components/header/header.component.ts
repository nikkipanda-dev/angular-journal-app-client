import { Component, OnInit } from '@angular/core';
import { UiService } from '../../services/ui.service';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit {
  title: string = 'Journal';
  showAddTask!: boolean;
  subscription!: Subscription;
  
  constructor() {}

  ngOnInit(): void {}

  hasRoute(route: string) {
    // console.log('route: ', this.router.url === route);
    // return this.router.url === route;
  }
}
