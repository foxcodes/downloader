import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FileDownloaderTable } from './file-downloader-table';
import { FileDownloaderRow } from '../../models/file-downloader-row.interface';

const AVAILABLE_ROW_1: FileDownloaderRow = { name: 'smss.exe', device: 'Daniel', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\smss.exe', status: 'available' };
const AVAILABLE_ROW_2: FileDownloaderRow = { name: 'netsh.exe', device: 'Daniel', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\netsh.exe', status: 'available' };
const SCHEDULED_ROW: FileDownloaderRow = { name: 'uxtheme.dll', device: 'Tester', path: '\\Device\\HarddiskVolume2\\Windows\\System32\\uxtheme.dll', status: 'scheduled' };
const ALL_ROWS = [AVAILABLE_ROW_1, AVAILABLE_ROW_2, SCHEDULED_ROW];

describe('FileDownloaderTable', () => {
  let component: FileDownloaderTable;
  let fixture: ComponentFixture<FileDownloaderTable>;

  function getTableRows(): NodeListOf<HTMLElement> {
    return fixture.nativeElement.querySelectorAll('.file-downloader-table-row');
  }

  function getCheckboxes(): NodeListOf<HTMLInputElement> {
    return fixture.nativeElement.querySelectorAll('.file-downloader-select-checkbox');
  }

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FileDownloaderTable],
    }).compileComponents();

    fixture = TestBed.createComponent(FileDownloaderTable);
    component = fixture.componentInstance;
    fixture.componentRef.setInput('rows', ALL_ROWS);
    fixture.componentRef.setInput('selectAll', null);
    fixture.detectChanges();
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('row availability', () => {
    it('should disable the checkbox for scheduled rows', () => {
      expect(getCheckboxes()[2].disabled).toBe(true);
    });

    it('should not disable the checkbox for available rows', () => {
      expect(getCheckboxes()[0].disabled).toBe(false);
      expect(getCheckboxes()[1].disabled).toBe(false);
    });

    it('should not select a scheduled row when clicked', () => {
      getTableRows()[2].click();
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([]);
    });

    it('should not emit selectedRowsChanged when a scheduled row is clicked', () => {
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      getTableRows()[2].click();

      expect(spy).not.toHaveBeenCalled();
    });
  });

  describe('row selection', () => {
    it('should select an available row when clicked', () => {
      getTableRows()[0].click();
      fixture.detectChanges();

      expect(component.selectedRows()).toContain(AVAILABLE_ROW_1);
    });

    it('should deselect a selected row when clicked again', () => {
      getTableRows()[0].click();
      getTableRows()[0].click();
      fixture.detectChanges();

      expect(component.selectedRows()).not.toContain(AVAILABLE_ROW_1);
    });

    it('should allow multiple available rows to be selected independently', () => {
      getTableRows()[0].click();
      getTableRows()[1].click();
      fixture.detectChanges();

      expect(component.selectedRows()).toContain(AVAILABLE_ROW_1);
      expect(component.selectedRows()).toContain(AVAILABLE_ROW_2);
    });

    it('should emit selectedRowsChanged with the updated selection when a row is clicked', () => {
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      getTableRows()[0].click();

      expect(spy).toHaveBeenCalledWith([AVAILABLE_ROW_1]);
    });

    it('should emit an empty array when the last selected row is deselected', () => {
      getTableRows()[0].click();
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      getTableRows()[0].click();

      expect(spy).toHaveBeenCalledWith([]);
    });
  });

  describe('selectAll input', () => {
    it('should select all available rows when selectAll is set to true', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });

    it('should not select scheduled rows when selectAll is true', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();

      expect(component.selectedRows()).not.toContain(SCHEDULED_ROW);
    });

    it('should deselect all rows when selectAll is set to false', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('selectAll', false);
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([]);
    });

    it('should emit selectedRowsChanged with all available rows when selectAll is true', () => {
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });

    it('should emit selectedRowsChanged with an empty array when selectAll is false', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();
      const spy = vi.spyOn(component.selectedRowsChanged, 'emit');
      fixture.componentRef.setInput('selectAll', false);
      fixture.detectChanges();

      expect(spy).toHaveBeenCalledWith([]);
    });

    it('should not react to a null selectAll value', () => {
      fixture.componentRef.setInput('selectAll', true);
      fixture.detectChanges();
      fixture.componentRef.setInput('selectAll', null);
      fixture.detectChanges();

      expect(component.selectedRows()).toEqual([AVAILABLE_ROW_1, AVAILABLE_ROW_2]);
    });
  });
});
