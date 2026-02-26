import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';

interface Post {
  id: number;
  title: string;
  body: string;
}

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit {
  // Form
  contactForm: FormGroup;
  submitted = false;
  submitSuccess = false;

  // HTTP - posts from API
  posts: Post[] = [];
  loadingPosts = false;
  postError = '';

  constructor(private fb: FormBuilder, private http: HttpClient) {
    this.contactForm = this.fb.group({
      name: ['', [Validators.required, Validators.minLength(3)]],
      email: ['', [Validators.required, Validators.email]],
      message: ['', [Validators.required, Validators.minLength(10)]]
    });
  }

  ngOnInit(): void {
    this.loadPosts();
  }

  // Business logic: getter for easy template access
  get f() {
    return this.contactForm.controls;
  }

  // Business logic: check if field is invalid and touched
  isInvalid(field: string): boolean {
    const control = this.contactForm.get(field);
    return !!(control && control.invalid && (control.touched || this.submitted));
  }

  // Business logic: form submission
  onSubmit(): void {
    this.submitted = true;
    if (this.contactForm.invalid) return;

    // HTTP POST - simulate sending form data to API
    this.http.post('https://jsonplaceholder.typicode.com/posts', this.contactForm.value)
      .subscribe({
        next: () => {
          this.submitSuccess = true;
          this.contactForm.reset();
          this.submitted = false;
        },
        error: () => {
          this.postError = 'Submission failed. Please try again.';
        }
      });
  }

  // HTTP GET - load posts from JSONPlaceholder
  loadPosts(): void {
    this.loadingPosts = true;
    this.http.get<Post[]>('https://jsonplaceholder.typicode.com/posts?_limit=5')
      .subscribe({
        next: (data) => {
          this.posts = data;
          this.loadingPosts = false;
        },
        error: () => {
          this.postError = 'Failed to load posts.';
          this.loadingPosts = false;
        }
      });
  }
}
