import { Component, OnInit, OnDestroy, AfterViewInit } from '@angular/core';
import { FormGroup, FormBuilder, FormArray, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';

// import { Quill } from 'quill';

const Quill = require('quill');

import { PostsManagerService } from '../posts-manager.service';
import { BlogTitleService } from '../../../../core/blog-title.service';

@Component({
  templateUrl: 'edit-post.component.html',
  styleUrls: ['edit-post.component.scss']
})

export class EditPostComponent implements OnInit, OnDestroy, AfterViewInit {

  public editMode = true;

  public editPostForm: FormGroup;
  public tagsFormArray: FormArray;
  public post: any;
  public postId: string;

  public quill: any;

  public imagesToUpload: File[];

  constructor(public router: Router,
    public route: ActivatedRoute,
    private fb: FormBuilder,
    public postsManagerService: PostsManagerService,
    public blogTitleService: BlogTitleService) { }

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
    });

  }

  getPost(id: string): void {
    this.postsManagerService.getPost(id).subscribe(res => {
      if (res) {
        this.updateForm(res);
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
    this.editMode = !this.editPostForm.valid;
  }

  savePost() {
    this.postsManagerService.savePost(this.editPostForm.value, this.postId !== '0' ? this.postId : undefined)
      .subscribe(res => {
        if (res) {
          this.editPostForm.reset();
          this.router.navigate(['/administrator/posts-manager']);
        }
      });
  }

  cancel() {
    this.editPostForm.reset();
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
  }
}
