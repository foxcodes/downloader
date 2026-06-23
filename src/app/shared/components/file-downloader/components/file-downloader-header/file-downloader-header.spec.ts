import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloaderHeader } from './file-downloader-header';
import { FileDownloaderRow } from '../../interfaces/file-downloader-row.interface';
import { FileDownloaderFieldTypeEnum } from '../../enums/file-downloader-field-type.enum';

const AVAILABLE_ROW_1: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', type: FileDownloaderFieldTypeEnum.Value },
  ]
};

const AVAILABLE_ROW_2: FileDownloaderRow = {
  canDownload: true,
  fields: [
    { fieldName: 'device', value: 'Daniel', type: FileDownloaderFieldTypeEnum.Value },
    { fieldName: 'path', value: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', type: FileDownloaderFieldTypeEnum.Value },
  ]
};

const SCHEDULED_ROW: FileDownloaderRow = {
  canDownload: false,
  fields: []
};

describe('FileDownloaderHeader', () => {
  let component: FileDownloaderHeader;
  let fixture: ComponentFixture<FileDownloaderHeader>;

  function getCheckbox(): HTMLInputElement {
    return fixture.nativeElement.querySelector('.file-downloader-header-checkbox');
  }

  function getCountText(): string {
    return fixture.nativeElement.querySelector('.file-downloader-header-count').textContent.trim();
  }

  function getDownloadBtn(): HTMLButtonElement {
    return fixture.nativeElement.querySelector('.file-downloader-header-download-btn');
  }

  async function setup(rows: FileDownloaderRow[], selectedRows: FileDownloaderRow[] = []): Promise<void> {
    fixture.componentRef.setInput('rows', rows);
    fixture.componentRef.setInput('selectedRows', selectedRows);
    fixture.detectChanges();
    await fixture.whenStable();
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDownloaderHeader],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDownloaderHeader);
    component = fixture.componentInstance;
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it('should create', async () => {
    await setup([AVAILABLE_ROW_1]);
    expect(component).toBeTruthy();
  });

  describe('select-all checkbox state', () => {
    it('should be unchecked and not indeterminate when no items are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW]);

      expect(getCheckbox().checked).toBe(false);
      expect(getCheckbox().indeterminate).toBe(false);
    });

    it('should be checked when every row in the dataset is selected', async () => {
      // Only possible when all rows are available — scheduled rows cannot be selected
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2], [AVAILABLE_ROW_1, AVAILABLE_ROW_2]);

      expect(getCheckbox().checked).toBe(true);
      expect(getCheckbox().indeterminate).toBe(false);
    });

    it('should be indeterminate when some but not all rows are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1]);

      expect(getCheckbox().indeterminate).toBe(true);
      expect(getCheckbox().checked).toBe(false);
    });

    it('should be indeterminate (not checked) when all available rows are selected but scheduled rows also exist', async () => {
      // Scheduled rows count towards the total, so "all selected" is not reachable with mixed data
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1, AVAILABLE_ROW_2]);

      expect(getCheckbox().indeterminate).toBe(true);
      expect(getCheckbox().checked).toBe(false);
    });
  });

  describe('selected count text', () => {
    it('should display "None Selected" when no items are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW]);

      expect(getCountText()).toBe('None Selected');
    });

    it('should display "Selected 1" when one item is selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1]);

      expect(getCountText()).toBe('Selected 1');
    });

    it('should display "Selected 2" when two items are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1, AVAILABLE_ROW_2]);

      expect(getCountText()).toBe('Selected 2');
    });
  });

  describe('select-all checkbox click', () => {
    it('should emit true to select all when no items are currently selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW]);
      const spy = vi.spyOn(component.selectAllClicked, 'emit');
      getCheckbox().click();

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should emit true to select all when some but not all available items are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1]);
      const spy = vi.spyOn(component.selectAllClicked, 'emit');
      getCheckbox().click();

      expect(spy).toHaveBeenCalledWith(true);
    });

    it('should emit false to deselect all when all available items are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
      const spy = vi.spyOn(component.selectAllClicked, 'emit');
      getCheckbox().click();

      expect(spy).toHaveBeenCalledWith(false);
    });
  });

  describe('download button', () => {
    it('should be disabled when no items are selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW]);

      expect(getDownloadBtn().disabled).toBe(true);
    });

    it('should be enabled when at least one item is selected', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1]);

      expect(getDownloadBtn().disabled).toBe(false);
    });

    it('should show an alert with the path and device of each selected file', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
      getDownloadBtn().click();

      const expectedMessage =
        `Path: ${AVAILABLE_ROW_1.fields.find(f => f.fieldName === 'path')?.value}\nDevice: ${AVAILABLE_ROW_1.fields.find(f => f.fieldName === 'device')?.value}` +
        `\n\n` +
        `Path: ${AVAILABLE_ROW_2.fields.find(f => f.fieldName === 'path')?.value}\nDevice: ${AVAILABLE_ROW_2.fields.find(f => f.fieldName === 'device')?.value}`;
      expect(alertSpy).toHaveBeenCalledWith(expectedMessage);
    });

    it('should include only the selected files in the alert, not all files', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_2]);
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => { });
      getDownloadBtn().click();

      const alertArg = alertSpy.mock.calls[0][0] as string;
      const path2 = AVAILABLE_ROW_2.fields.find(f => f.fieldName === 'path')?.value;
      const path1 = AVAILABLE_ROW_1.fields.find(f => f.fieldName === 'path')?.value;
      expect(alertArg).toContain(path2);
      expect(alertArg).not.toContain(path1);
    });
  });
});
