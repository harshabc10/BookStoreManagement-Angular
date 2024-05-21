import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BookService } from 'src/app/services/book-service/book.service';

@Component({
  selector: 'app-customer-details',
  templateUrl: './customer-details.component.html',
  styleUrls: ['./customer-details.component.scss']
})
export class CustomerDetailsComponent implements OnInit {

  customerForm: FormGroup;
  showAddressForm: boolean = false;

  constructor(private fb: FormBuilder,private bookService: BookService) {
    this.customerForm = this.fb.group({
      fullName: ['', Validators.required],
      mobileNumber: ['', [Validators.required, Validators.pattern(/^[0-9]{10}$/)]],
      address: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      type: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.bookService.getAllAddress().subscribe(
      (response: any) => {
        if (response && response.data) {
          console.log('Fetched Address Data:', response.data);
          this.populateForm(response.data); // Populate form fields with response data
        } else {
          console.error('Invalid data received:', response);
        }
      },
      (error) => {
        console.error('Error fetching addresses:', error);
      }
    );
  }
  
  toggleAddressForm(): void {
    this.showAddressForm = !this.showAddressForm;
  }

  populateForm(data: any): void {
    if (data) {
      this.customerForm.patchValue({
        fullName: data.userFirstName || '', // Provide default value if data is undefined
        mobileNumber: data.userPhone || '',
        address: data.address || '',
        city: data.city || '',
        state: data.state || '',
        type: data.type || ''
      });
    }
  }

  onSubmit(): void {
    if (this.customerForm.valid) {
      console.log('Form Submitted!', this.customerForm.value);
    } else {
      console.log('Form not valid');
    }
  }

}
