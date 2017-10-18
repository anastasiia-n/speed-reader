import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { FileSystemService } from 'app/providers/file-system.service';
import { ElectronService } from 'app/providers/electron.service';

@Component({
  selector: 'app-library',
  templateUrl: './library.component.html',
  styleUrls: ['./library.component.scss']
})
export class LibraryComponent implements OnInit {
  constructor(
    public fileSystemService: FileSystemService,
    public electronService: ElectronService,
    public router: Router
  ) { 
    electronService.ipcRenderer.on('fromFile', () => {
      console.log("FILE");
    });
  }

  ngOnInit() {

  }

  read() {
    this.router.navigate(['/read/1']);
  }
}
