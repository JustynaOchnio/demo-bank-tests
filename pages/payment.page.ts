import { Locator, Page } from '@playwright/test';

export class PaymentPage {
  transferReceiver: Locator;
  transferAccount: Locator;
  transferAmount: Locator;
  proceedButton: Locator;
  closeButton: Locator;

  constructor(private page: Page) {
    this.transferReceiver = this.page.getByTestId('transfer_receiver');
    this.transferAccount = this.page.getByTestId('form_account_to');
    this.transferAmount = this.page.getByTestId('form_amount');
    this.proceedButton = this.page.getByRole('button', {
      name: 'wykonaj przelew',
    });
     this.closeButton = this.page.getByTestId('close-button');
  }
}
