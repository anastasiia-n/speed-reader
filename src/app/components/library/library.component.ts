import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemService } from 'app/providers/file-system.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  constructor(
    public fileSystemService: FileSystemService,
    public router: Router
  ) { }

  ngOnInit() {

  }

  read() {
    this.router.navigate(['/read/1']);
  }
}
