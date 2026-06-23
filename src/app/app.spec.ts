import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { FileDownloaderRow } from './shared/components/file-downloader/interfaces/file-downloader-row.interface';
import { FileDownloaderFieldTypeEnum } from './shared/components/file-downloader/enums/file-downloader-field-type.enum';

const ROW_1: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', type: FileDownloaderFieldTypeEnum.Value },
  ]
};

const ROW_2: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'device', value: 'Tester', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', type: FileDownloaderFieldTypeEnum.Value },
  ]
};

describe('App', () => {
  let app: App;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();

    const fixture = TestBed.createComponent(App);
    app = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create the app', () => {
    expect(app).toBeTruthy();
  });

  describe('onDownloadSelected', () => {
    it('should alert with path and device for each selected row', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
      app.onDownloadSelected([ROW_1, ROW_2]);

      const expectedMessage =
        `Path: ${ROW_1.fields.find(f => f.fieldName === 'path')?.value}\nDevice: ${ROW_1.fields.find(f => f.fieldName === 'device')?.value}` +
        `\n\n` +
        `Path: ${ROW_2.fields.find(f => f.fieldName === 'path')?.value}\nDevice: ${ROW_2.fields.find(f => f.fieldName === 'device')?.value}`;
      expect(alertSpy).toHaveBeenCalledWith(expectedMessage);
    });

    it('should alert with a single entry when only one row is selected', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
      app.onDownloadSelected([ROW_1]);

      expect(alertSpy).toHaveBeenCalledWith(
        `Path: ${ROW_1.fields.find(f => f.fieldName === 'path')?.value}\nDevice: ${ROW_1.fields.find(f => f.fieldName === 'device')?.value}`
      );
    });

    it('should alert with an empty string when no rows are selected', () => {
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
      app.onDownloadSelected([]);

      expect(alertSpy).toHaveBeenCalledWith('');
    });
  });
});
