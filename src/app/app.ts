import { Component, inject, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { FileDownloader } from './shared/components/file-downloader/file-downloader';
import { DataService } from './services/data-service/data.service';
import { FileDownloaderRow } from './shared/components/file-downloader/models/file-downloader-row.interface';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, FileDownloader],
  providers: [DataService],
  templateUrl: './app.html',
  styleUrl: './app.scss'
})
export class App implements OnInit {
  protected readonly title = signal('downloader');

  public rows = signal<FileDownloaderRow[]>([]);

  private dataService = inject(DataService);

  async ngOnInit() {
    this.rows.set(await this.dataService.getData());
  }
}
