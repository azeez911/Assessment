import { Component, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="container mt-5">
      <div class="row justify-content-center">
        <div class="col-md-11">
          
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="text-primary fw-bold">Business Card Manager</h2>
            <button *ngIf="cards.length > 0" (click)="exportToCSV()" class="btn btn-success shadow-sm">
              Export to CSV
            </button>
          </div>

          <div class="card shadow-sm mb-5">
            <div class="card-header bg-light">
              <h5 class="card-title mb-0">Add New Business Card</h5>
            </div>
            <div class="card-body">
              <div class="row g-3">
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Full Name</label>
                  <input [(ngModel)]="newCard.Name" class="form-control" placeholder="Name">
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Gender</label>
                  <select [(ngModel)]="newCard.Gender" class="form-select">
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Date of Birth</label>
                  <input [(ngModel)]="newCard.DateOfBirth" type="date" class="form-control">
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Email Address</label>
                  <input [(ngModel)]="newCard.Email" class="form-control" placeholder="email@example.com">
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Phone Number</label>
                  <input [(ngModel)]="newCard.Phone" 
                         class="form-control" 
                         [class.is-invalid]="phoneError" 
                         placeholder="Unique Phone Number">
                  <div *ngIf="phoneError" class="text-danger small mt-1 fw-bold">
                    {{ phoneError }}
                  </div>
                </div>
                <div class="col-md-4">
                  <label class="form-label small fw-bold">Home Address</label>
                  <input [(ngModel)]="newCard.Address" class="form-control" placeholder="City, Street...">
                </div>
                <div class="col-12">
                  <label class="form-label small fw-bold">Profile Photo (Optional)</label>
                  <input type="file" (change)="onFileChange($event)" class="form-control">
                </div>
              </div>

              <div *ngIf="formError" class="alert alert-danger mt-3 mb-0">
                {{ formError }}
              </div>

              <div class="mt-4 d-flex gap-2">
                <button (click)="saveCard()" class="btn btn-primary px-4">Save Card</button>
                <button (click)="toggleList()" class="btn btn-outline-secondary">
                  {{ isListVisible ? 'Hide Stored List' : 'Show Stored List' }}
                </button>
              </div>
            </div>
          </div>

          <div class="card shadow-sm" *ngIf="isListVisible">
            <div class="card-body p-0">
              <table class="table table-hover mb-0">
                <thead class="table-dark text-white">
                  <tr>
                    <th>Photo</th>
                    <th>Name</th>
                    <th>Gender</th>
                    <th>Phone</th>
                    <th>Address</th>
                    <th class="text-center">Action</th>
                  </tr>
                </thead>
                <tbody>
                  <tr *ngFor="let card of cards" class="align-middle">
                    <td>
                      <img *ngIf="card.PhotoBase64" [src]="card.PhotoBase64" 
                           class="rounded-circle border" style="width: 45px; height: 45px; object-fit: cover;">
                    </td>
                    <td class="fw-bold">{{ card.Name }}</td>
                    <td>{{ card.Gender }}</td>
                    <td>{{ card.Phone }}</td>
                    <td>{{ card.Address }}</td>
                    <td class="text-center">
                      <button (click)="deleteCard(card.Id)" class="btn btn-sm btn-outline-danger">Delete</button>
                    </td>
                  </tr>
                  <tr *ngIf="cards.length === 0">
                    <td colspan="6" class="text-center py-4 text-muted">The database is currently empty.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Success Modal -->
    <div class="modal fade show d-block" tabindex="-1" *ngIf="showSuccessModal" style="background-color: rgba(0,0,0,0.5);">
      <div class="modal-dialog modal-dialog-centered">
        <div class="modal-content">
          <div class="modal-header bg-success text-white">
            <h5 class="modal-title">Success</h5>
            <button type="button" class="btn-close btn-close-white" (click)="closeModal()"></button>
          </div>
          <div class="modal-body">
            <p class="mb-0">Business card saved successfully!</p>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-secondary" (click)="closeModal()">Close</button>
          </div>
        </div>
      </div>
    </div>
  `
})
export class AppComponent {
  apiUrl = 'http://localhost:5275/api/cards';
  cards: any[] = [];
  newCard: any = {};
  isListVisible = false;
  phoneError: string | null = null;
  formError: string | null = null;
  showSuccessModal = false;

  constructor(private http: HttpClient, private cdr: ChangeDetectorRef) {}

  toggleList() {
    this.isListVisible = !this.isListVisible;
    if (this.isListVisible) {
      this.loadCards();
    }
  }

  loadCards() {
    this.http.get<any[]>(this.apiUrl).subscribe({
      next: (data) => {
        this.cards = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.error('Failed to load cards:', err)
    });
  }

  onFileChange(event: any) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => this.newCard.PhotoBase64 = reader.result;
    if (file) reader.readAsDataURL(file);
  }

saveCard() {
  this.phoneError = null; 
  this.formError = null;

  if (!this.newCard.Name || !this.newCard.Gender || !this.newCard.DateOfBirth || 
      !this.newCard.Email || !this.newCard.Phone || !this.newCard.Address) {
    this.formError = 'Please fill in all fields before saving.';
    return;
  }

  this.http.post(this.apiUrl, this.newCard).subscribe({
    next: () => {
      this.newCard = {}; 
      this.showSuccessModal = true;
      if (this.isListVisible) {
        this.loadCards(); //refresh list 
      }
      this.cdr.detectChanges();
    },
    error: (err) => {
     
      if (typeof err.error === 'string') {
        this.phoneError = err.error;
      } else {
        this.phoneError = "This phone number is already registered.";
      }
      
 
      this.cdr.detectChanges(); 
    }
  });
}

  deleteCard(id: number) {
    if(window.confirm('Delete this card?')) {
      this.http.delete(`${this.apiUrl}/${id}`).subscribe(() => this.loadCards());
    }
  }

  closeModal() {
    this.showSuccessModal = false;
  }
// export to csv
  exportToCSV() {
    const headers = "Name,Gender,DateOfBirth,Email,Phone,Address\\n";
    const rows = this.cards.map(c => 
      `${c.Name},${c.Gender},${c.DateOfBirth},${c.Email},${c.Phone},${c.Address}`
    ).join("\\n");
    
    const blob = new Blob([headers + rows], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'BusinessCards_Export.csv';
    a.click();
    window.URL.revokeObjectURL(url);
  }
}