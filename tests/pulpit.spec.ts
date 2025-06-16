import { test, expect } from '@playwright/test';
import { loginData } from '../test-data/login.data';
import { LoginPage } from '../pages/login.page';
import { PulpitPage } from '../pages/pulpit.page';
import { PaymentPage } from '../pages/payment.page';

test.describe('Pulpit tests', () => {
  let pulpitPage: PulpitPage;

  test.beforeEach(async ({ page }) => {
    const userId = loginData.userId;
    const userPassword = loginData.userPassword;

    await page.goto('/');

    const loginPage = new LoginPage(page);
    await loginPage.login(userId, userPassword);

    pulpitPage = new PulpitPage(page);
  });

  test('quick payment with correct data', async ({ page }) => {
    //Arrange
    const receiverId = '2';
    const transferAmount = '150';
    const transerTitle = 'pizza';

    //Act
    await pulpitPage.executeQuickPayment(receiverId, transferAmount, transerTitle);

    //Assert
    await expect(pulpitPage.messageHeader).toHaveText(
      `Przelew wykonany! Chuck Demobankowy - ${transferAmount},00PLN - ${transerTitle}`,
    );
  });

  test('successful mobile top-up', async ({ page }) => {
    //Arrange
    const receiverNumber = '500 xxx xxx';
    const transferAmount = '50';
    const expectedMessage = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${receiverNumber}`;

    //Act
    await pulpitPage.executeMobileTopup(receiverNumber, transferAmount);

    //Assert
    await expect(pulpitPage.messageHeader).toHaveText(expectedMessage);
  });

  test('correct balance after successful mobile top-up', async ({ page }) => {
    //Arrange
    const receiverNumber = '500 xxx xxx';
    const transferAmount = '50';
    const expectedMessage = `Doładowanie wykonane! ${transferAmount},00PLN na numer ${receiverNumber}`;
    const initialBalance = await pulpitPage.balanceValue.innerText();
    const expectedBalance = Number(initialBalance) - Number(transferAmount);

    //Act
    await pulpitPage.executeMobileTopup(receiverNumber, transferAmount);

    //Assert
    await expect(pulpitPage.balanceValue).toHaveText(`${expectedBalance}`);
  });
});
