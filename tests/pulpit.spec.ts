import { test, expect } from '@playwright/test';

test.describe('Pulpit tests', () => {

    //Arrange
    const url = 'https://demo-bank.vercel.app/';
    const userId = 'testerLO';
    const userPassword = '12345678';

    test.only('quick payment with correct data', async ({ page }) => {
        //Arrange
        const receiverId = '2';
        const transferAmount = '150';
        const transerTitle = 'pizza';

        //Act
        await page.goto(url);
        await page.getByTestId('login-input').fill(userId);
        await page.getByTestId('password-input').fill(userPassword);
        await page.getByTestId('login-button').click();

        await page.locator('#widget_1_transfer_receiver').selectOption(receiverId);
        await page.locator('#widget_1_transfer_amount').fill(transferAmount);
        await page.locator('#widget_1_transfer_title').fill(transerTitle);

        await page.getByRole('button', { name: 'wykonaj' }).click();
        await page.getByTestId('close-button').click();

        //Assert
        await expect(page.getByTestId('message-text')).toHaveText(
            `Przelew wykonany! BDDChuck Demobankowy - ${transferAmount},00PLN - ${transerTitle}`)
    });

    test('successful mobile top-up', async ({ page }) => {
        //Arrange
        const receiverNumber = '500 xxx xxx';
        const transferAmount = '50';

        //Act
        await page.goto(url);
        await page.getByTestId('login-input').fill(userId);
        await page.getByTestId('password-input').fill(userPassword);
        await page.getByTestId('login-button').click();

        await page.locator('#widget_1_topup_receiver').selectOption(receiverNumber);
        await page.locator('#widget_1_topup_amount').fill(transferAmount);
        await page.locator('#uniform-widget_1_topup_agreement span').check();
        await page.getByRole('button', { name: 'doładuj telefon' }).click();
        await page.getByTestId('close-button').click();

        //Assert
        await expect(page.getByTestId('message-text')).toHaveText(
            `Doładowanie wykonane! ${transferAmount},00PLN na numer ${receiverNumber}`);
    });
});