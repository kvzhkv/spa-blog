import { Component, OnInit, ElementRef, Input, Output, EventEmitter, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';

import { MediaManagerService } from './media-manager.service';
import { BlogTitleService } from '../../../core/blog-title.service';
import { ConfirmService } from '../../../core/confirm/confirm.service';

@Component({
  selector: 'blog-media-manager',
  templateUrl: 'media-manager.component.html',
  styleUrls: ['media-manager.component.scss']
})

export class MediaManagerComponent implements OnInit {
  @Input() editPostMode = false;
  @Output() selectedFile: EventEmitter<string> = new EventEmitter<string>();
  @ViewChild('fileInput') fileInput: ElementRef;

  public filesList: {}[] = [];
  public uploadFileForm: FormGroup;

  constructor(public mediaManagerService: MediaManagerService,
    public fb: FormBuilder,
    public blogTitleService: BlogTitleService,
    public confirmService: ConfirmService) { }

  ngOnInit() {
    if (!this.editPostMode) {
      this.blogTitleService.pushTitle('Media Manager');
    }
    this.uploadFileForm = this.fb.group({
      file: [{ value: '', disabled: false }, [Validators.required]]
    });
    this.getList();
  }

  chooseFile() {
    this.fileInput.nativeElement.click();
  }

  selectFile(fileName: string) {
    if (this.editPostMode) {
      this.selectedFile.emit(`media/${fileName}`);
    }
  }

  getList() {
    this.mediaManagerService.getList().subscribe(res => {
      if (res) {
        this.filesList = res;
      }
    });
  }

  uploadFile() {
    const formData = new FormData();
    formData.append('file', this.uploadFileForm.value.file);
    this.mediaManagerService.uploadFile(formData).subscribe(res => {
      this.uploadFileForm.reset();
      if (res) {
        this.getList();
      }
    });
  }

  deleteFile(fileName: string) {
    this.confirmService.confirm(`Are you sure you want to delete file ${fileName}?`, 'Delete', 'Cancel')
      .subscribe((value) => {
        if (value) {
          this.mediaManagerService.deleteFile(fileName).subscribe(res => {
            if (res) {
              this.getList();
            }
          });
        }
      });
  }
}
