import { Locator, Page } from '@playwright/test';
import { SideMenuComponent } from '../components/side-menu.component';

export class PulpitPage {
  messageHeader: Locator;
  balanceValue: Locator;

  quickPaymentReceiverSelect: Locator;
  quickPaymentTransferAmountInput: Locator;
  quickPaymentTransferTitleInput: Locator;
  quickPaymentProceedButton: Locator;

  mobileTopupReceiverSelect: Locator;
  mobileTopupTransferAmountInput: Locator;
  mobileTopupAcceptConditionsCheckbox: Locator;
  mobileTopupProceedButton: Locator;

  closeButton: Locator;

  sideMenu: SideMenuComponent;

  constructor(private page: Page) {
    this.messageHeader = this.page.getByTestId('message-text');
    this.balanceValue = this.page.locator('#money_value');
    this.quickPaymentReceiverSelect = this.page.locator(
      '#widget_1_transfer_receiver',
    );
    this.quickPaymentTransferAmountInput = this.page.locator(
      '#widget_1_transfer_amount',
    );
    this.quickPaymentTransferTitleInput = this.page.locator(
      '#widget_1_transfer_title',
    );
    this.quickPaymentProceedButton = this.page.getByRole('button', {
      name: 'wykonaj',
    });
    this.mobileTopupReceiverSelect = this.page.locator(
      '#widget_1_topup_receiver',
    );
    this.mobileTopupTransferAmountInput = this.page.locator(
      '#widget_1_topup_amount',
    );
    this.mobileTopupAcceptConditionsCheckbox = this.page.locator(
      '#uniform-widget_1_topup_agreement span',
    );
    this.mobileTopupProceedButton = this.page.getByRole('button', {
      name: 'doładuj telefon',
    });
    this.closeButton = this.page.getByTestId('close-button');
    this.sideMenu = new SideMenuComponent(this.page);
  }

  async executeQuickPayment(
    receiverId: string,
    transferAmount: string,
    transerTitle: string,
  ): Promise<void> {
    await this.quickPaymentReceiverSelect.selectOption(receiverId);
    await this.quickPaymentTransferAmountInput.fill(transferAmount);
    await this.quickPaymentTransferTitleInput.fill(transerTitle);
    await this.quickPaymentProceedButton.click();
    await this.closeButton.click();
  }

  async executeMobileTopup(
    receiverNumber: string,
    transferAmount: string,
  ): Promise<void> {
    await this.mobileTopupReceiverSelect.selectOption(receiverNumber);
    await this.mobileTopupTransferAmountInput.fill(transferAmount);
    await this.mobileTopupAcceptConditionsCheckbox.check();
    await this.mobileTopupProceedButton.click();
    await this.closeButton.click();
  }
}
