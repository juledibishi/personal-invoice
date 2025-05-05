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

  rabat: number = 0;
  discountedTotal: number = 0;
  items: any[] = [
    { name: '', description: '', quantity: 1, unit: 'pcs', price: 0, total: 0 }
  ];
  ngOnInit() {
    this.calculateDiscountedTotal();
  }


  get grandTotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  updateTotal(index: number) {
    const item = this.items[index];
    item.total = item.quantity * item.price;
    this.calculateDiscountedTotal(); // Add this line
  }
  addItem() {
    this.items.push({ name: '', description: '', quantity: 1, unit: 'pcs', price: 0, total: 0 });
    this.calculateDiscountedTotal();
  }

  removeItem(index: number) {
    if (this.items.length > 1) {
      this.items.splice(index, 1);
      this.calculateDiscountedTotal();
    }
  }

  getGrandTotal(): number {
    return this.items.reduce((sum, item) => sum + item.total, 0);
  }

  calculateDiscountedTotal(): void {
    const total = this.getGrandTotal();

    if (this.rabat === null || this.rabat === undefined || this.rabat === 0) {
      this.discountedTotal = total; // Keep full total if no valid discount
      return;
    }

    const discount = Number(this.rabat);
    if (!isNaN(discount) && discount >= 0) {
      this.discountedTotal = total - (total * discount / 100);
    } else {
      this.discountedTotal = total;
    }
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
