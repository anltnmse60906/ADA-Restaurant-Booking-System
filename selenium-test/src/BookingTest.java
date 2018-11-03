import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.*;

import java.util.ArrayList;
import java.util.List;

public class BookingTest {
    public static WebDriver driver;
    private int retryCount = 0;
    private List<String> tableNumberLlt = new ArrayList<>();

    @Test(priority = 3, groups = {"booking"})
    public void reserveThreeTablesTest() {
        selectTable();
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {

            //Check the table name on confirm-booking screen
            List<WebElement> listTables = driver.findElements(
                    By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > div.text-center.header-confirm-booking > div:nth-child(3) > div >*"));
            int cnt = 0;

            // Compare the selected table from Home screen to confirm booking screen
            for (WebElement tblElement : listTables) {
                for (String tblElementStr : tableNumberLlt) {
                    if (tblElement.getText().equals(tblElementStr)) {
                        cnt++;
                    }
                }
            }
            Assert.assertEquals(cnt, tableNumberLlt.size());
        }
    }

    @Test(priority = 4, groups = {"booking"})
    public void confirmBookingTest() {

        // Find the confirm button.
        WebElement confirmBtn = driver.findElement(
                By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > form > div:nth-child(4) > div.col.text-center.show > input"));
        confirmBtn.click();
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {

            // Retry three time for getting the message from server
            WebElement successMsg = getSuccessMessage();
            Assert.assertNotNull(successMsg);
        }
    }

    @Test(priority = 5, groups = {"booking"})
    public void cancelBookingTest() {
        selectTable();
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {


            //Get list reserved tables
            List<WebElement> listTables = driver.findElements(
                    By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > div.text-center.header-confirm-booking > div:nth-child(3) > div >*"));

            //Cast to string
            List<String> tableNameList = new ArrayList<>();
            for(WebElement e : listTables){
                tableNameList.add(e.getText());
            }

            //Find cancel button
            WebElement cancelElement = driver.findElement(
                    By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > form > div:nth-child(4) > div.col.text-center.show > button"));
            cancelElement.click();

            // Click confirm button on alert
            driver.switchTo().alert().accept();

            try {
                Thread.sleep(3000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            } finally {
                // Get all tables on current date.
                int count = 0;
                for (String e : tableNameList) {
                    try {
                        // Check the reserved tables change the state to "not reserve" state.
                        driver.findElement(
                                By.xpath("//app-table-element/label/div[text()='" + e + "']/preceding-sibling::div[1 and not(@class='selected')]"));
                        count++;
                    } catch (Exception ex) {
                        System.out.println("Table is selected");
                    }
                }
                Assert.assertEquals(count, listTables.size());
            }
        }
    }


    @BeforeClass
    public void start() {
        System.out.println(" before start");
        try {
            driver = AuthenticationTest.driver;
        } catch (Exception ex) {
            System.out.println("Exception while instantiating driver. " + ex.getMessage());
        }
    }

    // Close browser after finishing the test
    @AfterClass(alwaysRun = true)
    public void tearDown() throws Exception {
        if (driver != null) {
            driver.quit();
        }
    }

    private void selectTable() {
        driver.get(Config.host);
        int count = 0;
        try {
            Thread.sleep(2000);
        } catch (Exception ex) {
            System.out.println("Error while thread sleeping");
        } finally {

            // Get all tables on current date.
            List<WebElement> allTables = driver.findElements(
                    By.cssSelector("label.res-table"));
            for (WebElement tblElement : allTables) {
                try {
                    tblElement.click();

                    // Make sure that the table has change the css
                    WebElement e = tblElement.findElement(By.cssSelector("app-table-element > label > div.selected"));

                    // Get table number
                    if (e != null) {
                        count++;
                        WebElement tableNumber = tblElement.findElement(By.cssSelector("app-table-element > label > div.table-number"));
                        tableNumberLlt.add(tableNumber.getText().trim());
                    }

                    // Just select the first three table for booking
                    if (count == 3) {
                        break;
                    }
                } catch (Exception e) {
                    System.out.println("Do not have the disable div");
                }
            }
        }
        WebElement bookingBtn = driver.findElement(By.cssSelector("body > app-root > div > app-home > nav > button"));
        bookingBtn.click();
    }

    private WebElement getSuccessMessage() {
        do {
            try {
                Thread.sleep(1000);
            } catch (InterruptedException e) {
                e.printStackTrace();
            }
            try {
                return driver.findElement(
                        By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > div.alert.alert-primary.show"));
            } catch (Exception ex) {
                retryCount++;
                System.out.println("it goes to the catch loop: " + retryCount);
            }
        } while (retryCount < 3);
        return null;
    }

}
