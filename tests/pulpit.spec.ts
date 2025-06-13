import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';

test.describe('Pulpit tests', () => {
  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto('/');

    const loginPage = new LoginPage(page);
    await loginPage.loginInput.fill(userId);
    await loginPage.passwordInput.fill(userPassword);
    await loginPage.loginButton.click();
  });

  test('quick payment with correct data', async ({ page }) => {
    //Arrange
    const receiverId = '2';
    const transferAmount = '150';
    const transerTitle = 'pizza';

    //Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.quickPaymentReceiverSelect.selectOption(receiverId);
    await pulpitPage.quickPaymentTransferAmountInput.fill(transferAmount);
    await pulpitPage.quickPaymentTransferTitleInput.fill(transerTitle);
    await pulpitPage.quickPaymentProceedButton.click();
    await pulpitPage.closeButton.click();

    //Assert
    await expect(pulpitPage.messageHeader).toHaveText(
      `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - ${transerTitle}`,
    );
  });

  test('successful mobile top-up', async ({ page }) => {
    //Arrange
    const transferAmount = '50';
    const receiverNumber = '500 xxx xxx';
    const expectedMessage = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${receiverNumber}`;

    //Act
    const pulpitPage = new PulpitPage(page);
    await pulpitPage.mobileTopupReceiverSelect.selectOption(receiverNumber);
    await pulpitPage.mobileTopupTransferAmountInput.fill(transferAmount);
    await pulpitPage.mobileTopupAcceptConditionsCheckbox.check();
    await pulpitPage.mobileTopupProceedButton.click();
    await pulpitPage.closeButton.click();

    //Assert
    await expect(pulpitPage.messageHeader).toHaveText(expectedMessage);
  });

  test('correct balance after successful mobile top-up', async ({ page }) => {
    //Arrange
    const transferAmount = '50';
    const receiverNumber = '500 xxx xxx';
    const expectedMessage = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${receiverNumber}`;
    const pulpitPage = new PulpitPage(page);
    const initialBalance = await pulpitPage.balanceValue.innerText();
    const expectedBalance = Number(initialBalance) - Number(transferAmount);

    //Act
    await pulpitPage.mobileTopupReceiverSelect.selectOption(receiverNumber);
    await pulpitPage.mobileTopupTransferAmountInput.fill(transferAmount);
    await pulpitPage.mobileTopupAcceptConditionsCheckbox.check();
    await pulpitPage.mobileTopupProceedButton.click();
    await pulpitPage.closeButton.click();

    //Assert
    await expect(pulpitPage.balanceValue).toHaveText(`${expectedBalance}`);
  });
});
