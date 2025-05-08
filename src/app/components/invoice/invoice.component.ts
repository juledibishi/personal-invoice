import { CommonModule } from '@angular/common';
import { Component, ElementRef, ViewChild, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-invoice',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './invoice.component.html',
  styleUrls: ['./invoice.component.scss'],
})
export class InvoiceComponent implements OnInit {
  invoiceForm: FormGroup;
  today: Date = new Date();
  @ViewChild('invoice') invoiceElement!: ElementRef;

  totalPrice: number = 0;
  totalPriceAfterDiscount: number = 0;
  discountForm = new FormControl(0);
  summary = new FormControl('');
  clientName = new FormControl('');
  clientAddress = new FormControl('');
  clientPhone = new FormControl('');
  companyName = new FormControl('');
  companyPhone = new FormControl('');
  companyAddress = new FormControl('');

  constructor(private fb: FormBuilder) {
    this.invoiceForm = this.fb.group({
      items: this.fb.array([this.createItem()]),
    });
  }

  ngOnInit(): void {
    this.invoiceForm.valueChanges.subscribe(() => {
      this.calculateTotalPrice();
    })
  }

  get items(): FormArray {
    return this.invoiceForm.get('items') as FormArray;
  }

  printInvoice() {
    const invoiceData = {
      today: new Date().toLocaleDateString('en-GB'),
      items: this.invoiceForm.value.items,
      total: this.getTotal(),
      discount: this.discountForm.value,
      totalPriceAfterDiscount: this.totalPriceAfterDiscount,
      summary: this.summary.value,
      clientName: this.clientName.value,
      clientAddress: this.clientAddress.value,
      clientPhone: this.clientPhone.value,
      companyName: this.companyName.value,
      companyAddress: this.companyAddress.value,
      companyPhone: this.companyPhone.value,
    };
    let discountRow = '';
    let summaryRow = '';
    if (invoiceData.discount) {
      discountRow = `
    <tr>
  <td class="total-label">Zbritje</td>
  <td colspan="6">${invoiceData.discount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} %</td>
</tr>
        <tr>
          <td class="total-label">Totali pas Zbritjes</td>
<td colspan="8">${invoiceData.totalPriceAfterDiscount.toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
        </tr>
      `;
    }

    if (invoiceData.summary) {
      summaryRow = `
     <div class="textarea">
      <textare>${invoiceData.summary}</textare>
     </div>
        `;
    }

    const printContents = `
    <div class="container">
      <section class="jumbotron">
          <div class="left-side">
              <h2>Oferta për:</h2>
              <p><strong>Emri:</strong> ${invoiceData.clientName}</p>
              <p><strong>Adresa:</strong> ${invoiceData.clientAddress}</p>
              <p><strong>Telefoni:</strong> ${invoiceData.clientPhone}</p>
          </div>
  
          <div class="right-side">
              <p><strong>Emri Kompanisë:</strong> ${invoiceData.companyName}</p>
              <p><strong>Adresa:</strong> ${invoiceData.companyAddress}</p>
              <p><strong>Telefoni:</strong> ${invoiceData.companyPhone}</p>
              <p><strong>Data:</strong> ${invoiceData.today}</p>
          </div>
      </section>
  
      <table class="table">
            <thead>
                <tr>
                    <th>Nr.</th>
                    <th>Artikulli</th>
                    <th>Përshkrimi</th>
                    <th>Sasia</th>
                    <th>Çmimi (€)</th>
                    <th>Gjithësej (€)</th>
                </tr>
            </thead>
            <tbody>
                ${invoiceData.items.map((item: any, i: number) => `
                  <tr>
                    <td style="text-align:center;">${i + 1}</td>
                    <td>${item.name}</td>
                    <td>${item.description}</td>
<td>${Number.isInteger(item.qty) ? item.qty : item.qty.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${item.unit}</td>

                   <td>${Number(item.price).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                    <td>${(item.qty * item.price).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}</td>
                  </tr>
                `).join('')}
                
                
              
            </tbody>
        </table>
        <table class="table-discount"> 
              <tr>
                  <td class="total-label">Total</td>
                    <td>${Number(invoiceData.total).toLocaleString('de-DE', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} €</td>
                </tr>
         ${discountRow}
         </table>
        <br>
                ${summaryRow}
        <div class="signature">
            <div>
                <span>Pronari</span><br><br><br>
                <span>_______________________</span>
            </div>
            <div>
                <span>Klienti</span><br><br><br>
                <span>_______________________</span>
            </div>
        </div>
      </div>
    `;

    // Open a new print window
    const popupWin = window.open('', '_blank', 'width=900,height=600');

    if (popupWin) {
      popupWin.document.open();
      popupWin.document.write(`
        <html>
          <head>
            <style>
              body {
                  font-family: Arial, sans-serif;
                  margin: 20px;
                  padding: 10px;
              }
              .container {
                  padding: 20px;
              }
              .jumbotron {
                  display: flex;
                  justify-content: space-between;
                  align-items: center;
                  background-color: #f5f5f5;
                  padding: 20px;
                  border-radius: 5px;
              }
              .left-side h2 {
                  font-size: 24px;
              }
              .right-side {
                  text-align: right;
              }
              .company-logo {
                  width: 200px;
                  margin-bottom: 10px;
              }
              .table {
                  width: 100%;
                  border-collapse: collapse;
                  margin-top: 20px;
              }
              .table th, .table td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
              }
              .table th {
                  background-color: #f2f2f2;
              }
                  .table-discount{
                    margin-top: 20px;
                     border-collapse: collapse;
                  display: flex;
               justify-content: flex-end;
                  }
                  .table-discount td {
                  border: 1px solid #000;
                  padding: 8px;
                  text-align: left;
              }
              .signature {
                  display: flex;
                  justify-content: space-between;
                  margin-top: 40px;
              }

               .footer {
                display:flex;
                justify-content:center;
                gap:30px;
                margin-top: 40px;
                padding-top: 10px;
                border-top: 1px solid #ccc;
                text-align: center;
                font-size: 14px;
            }
            textarea {
              width: 50%; /* Ensures it takes full width */
              max-width: 50%; /* Prevents it from overflowing */
              word-wrap: break-word;
              overflow-wrap: break-word;
              white-space: pre-wrap; /* Ensures proper text wrapping */
              resize: vertical; /* Allows resizing vertically */
            }
          </style>
          </head>
          <body onload="window.print();">
            ${printContents}
          </body>
        </html>
      `);
      popupWin.document.close();
    } else {
      alert("Popup blocked! Please allow popups for this site.");
    }
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required],
      description: [''],
      qty: [1, [Validators.required, Validators.min(1)]],
      unit: ['pcs', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
    });
  }

  addItem(): void {
    this.items.push(this.createItem());
    this.calculateTotalPrice();
  }

  removeItem(index: number): void {
    if (this.items.length > 1) {
      this.items.removeAt(index);
      this.calculateTotalPrice();
    }
  }

  getTotal(): number {
    return this.items.controls.reduce((total, item) => {
      const qty = item.get('qty')?.value || 0;
      const price = item.get('price')?.value || 0;
      return total + qty * price;
    }, 0);
  }

  calculateTotalPrice() {
    this.totalPrice = this.getTotal();
    const valueAfterDiscount = this.calculateDiscount(this.discountForm.value!, this.totalPrice)
    this.totalPriceAfterDiscount = this.totalPrice - valueAfterDiscount;

    if (!this.discountForm.value) {
      this.totalPriceAfterDiscount = 0;
    }
  }

  calculateDiscount(partialValue: number, totalValue: number) {
    return (totalValue * partialValue) / 100;
  }
}
