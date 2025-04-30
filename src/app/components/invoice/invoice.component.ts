import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, MatInputModule, MatFormFieldModule, FormsModule, MatDatepickerModule, MatCardModule, ReactiveFormsModule],
  templateUrl: './invoice.component.html',
  styleUrl: './invoice.component.scss'
})
export class InvoiceComponent implements OnInit {
  logoPreview: string | ArrayBuffer | null = null;  // Variable to hold the logo preview


  ngOnInit() {

  }

  onFileChange(event: any): void {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image')) {
      const reader = new FileReader();
      reader.onload = () => {
        this.logoPreview = reader.result;  // Set the result as logoPreview
      };
      reader.readAsDataURL(file);  // Read the selected file as Data URL
    }
  }

  printInvoice() {
    window.print();
  }
}
