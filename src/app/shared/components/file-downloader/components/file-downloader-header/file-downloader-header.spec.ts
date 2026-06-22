import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloaderHeader } from './file-downloader-header';
import { FileDownloaderRow } from '../../models/file-downloader-row.interface';

const AVAILABLE_ROW_1: FileDownloaderRow = { name: 'smss.exe', device: 'Daniel', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'available' };
const AVAILABLE_ROW_2: FileDownloaderRow = { name: 'netsh.exe', device: 'Daniel', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available' };
const SCHEDULED_ROW: FileDownloaderRow = { name: 'uxtheme.dll', device: 'Tester', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\uxtheme.dll', status: 'scheduled' };

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
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      getDownloadBtn().click();

      const expectedMessage =
        `Path: ${AVAILABLE_ROW_1.path}\nDevice: ${AVAILABLE_ROW_1.device}` +
        `\n\n` +
        `Path: ${AVAILABLE_ROW_2.path}\nDevice: ${AVAILABLE_ROW_2.device}`;
      expect(alertSpy).toHaveBeenCalledWith(expectedMessage);
    });

    it('should include only the selected files in the alert, not all files', async () => {
      await setup([AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW], [AVAILABLE_ROW_2]);
      const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
      getDownloadBtn().click();

      const alertArg = alertSpy.mock.calls[0][0] as string;
      expect(alertArg).toContain(AVAILABLE_ROW_2.path);
      expect(alertArg).not.toContain(AVAILABLE_ROW_1.path);
    });
  });
});
