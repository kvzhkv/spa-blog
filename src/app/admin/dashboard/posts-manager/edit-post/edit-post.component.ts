import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs/Observable';

// import { Quill } from 'quill';

const Quill = require('quill');

import { PostsManagerService } from '../posts-manager.service';
import { BlogTitleService } from '../../../../core/blog-title.service';
import { ConfirmService } from '../../../../core/confirm/confirm.service';

@Component({
  templateUrl: 'edit-post.component.html',
  styleUrls: ['edit-post.component.scss']
})

export class EditPostComponent implements OnInit, OnDestroy, AfterViewInit {

  public editMode = true;

  public editPostForm: FormGroup;
  public tagsFormArray: FormArray;
  public postId: string;
  public savedPost: any;

  public postReadingTime: number = null;

  public quill: any;

  public imagesToUpload: File[];

  constructor(public router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public postsManagerService: PostsManagerService,
    public blogTitleService: BlogTitleService,
    public confirmService: ConfirmService) { }

  ngOnInit() {
    this.tagsFormArray = this.fb.array([[{ value: '', disabled: false }, [Validators.required]]]);

    this.editPostForm = this.fb.group({
      title: [{ value: '', disabled: false }, [Validators.required]],
      date: [{ value: Date.now(), disabled: false }, [Validators.required]],
      tags: this.tagsFormArray,
      imageUrl: [{ value: '', disabled: false }, [Validators.required]],
      text: [{ value: '', disabled: false }, [Validators.required]],
      cut: [{ value: '', disabled: false }, [Validators.maxLength(200)]]
    });

    this.postId = this.route.snapshot.params['postId'];

    if (this.postId !== '0') {
      this.getPost(this.postId);
    } else {
      this.blogTitleService.pushTitle('Create Post');
    }

  }

  ngAfterViewInit() {

    this.quill = new Quill('#b-quill-editor', {
      modules: {
        toolbar: [
          ['bold', 'italic', 'underline', 'strike'],
          [{ 'align': [] }],
          [{ 'color': [] }, { 'background': [] }],
          [{ 'indent': '+1' }, 'link', 'blockquote', 'image', 'video'],
          [{ list: 'ordered' }, { list: 'bullet' }]
        ]
      },
      placeholder: 'Post body...',
      theme: 'bubble'
    });

    this.quill.format('align', 'justify');

    this.quill.on('text-change', () => {
      this.editPostForm.patchValue({
        text: this.quill.getContents()
      });
      this.countReadingTime();
    });

  }

  countReadingTime() {
    this.postReadingTime = Math.ceil(this.quill.getLength() / 1500);
  }

  getPost(id: string): void {
    this.postsManagerService.getPost(id).subscribe(res => {
      if (res) {
        this.updateForm(res);
        this.savedPost = res;
        this.blogTitleService.pushTitle(`Edit post - ${res.title}`);
      }
    });

  }

  updateForm(post: any): void {
    this.editPostForm.patchValue({
      title: post.title,
      imageUrl: post.imageUrl,
      date: post.date,
      cut: post.cut
    });
    this.quill.setContents(post.text);
    this.setTags(post.tags);
    this.countReadingTime();
    this.editMode = !this.editPostForm.valid;
  }

  savePost() {
    this.postsManagerService.savePost(this.editPostForm.value, this.postId !== '0' ? this.postId : undefined)
      .subscribe(res => {
        if (res) {
          this.savedPost = this.editPostForm.value;
          this.router.navigate(['/administrator/posts-manager']);
        }
      });
  }

  cancel() {
    this.router.navigate(['/administrator/posts-manager']);
  }

  setTags(tags: string[]): void {
    this.tagsFormArray.removeAt(0);
    tags.forEach((tag) => {
      this.tagsFormArray.push(this.fb.control({ value: tag, disabled: false }, [Validators.required]));
    });
  }

  addTag(): void {
    this.tagsFormArray.push(this.fb.control({ value: '', disabled: false }, [Validators.required]));
  }

  removeTag(index: number): void {
    this.tagsFormArray.removeAt(index);
  }

  getFiles(files: any) {
    this.imagesToUpload = <Array<File>>files.target.files;
  }

  clearImageInput() {
    this.editPostForm.controls.imageUrl.reset();
  }

  onSelectedFile(path: string): void {
    this.editPostForm.patchValue({
      imageUrl: path
    });
  }

  ngOnDestroy() {
    this.quill = undefined;
    this.editPostForm.reset();
  }

  canDeactivate(): Observable<boolean> | boolean {
    if (JSON.stringify(this.editPostForm.value) !== JSON.stringify(this.savedPost)) {
      return this.confirmService.confirm('You have unsaved changes. Are you sure you want to leave this page?');
    } else {
      return true;
    }
  }
}
