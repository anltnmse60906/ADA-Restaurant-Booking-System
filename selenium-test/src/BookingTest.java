import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.testng.Assert;
import org.testng.annotations.*;

import java.util.ArrayList;
import java.util.List;

public class BookingTest {
    static WebDriver driver;
    static String host = "localhost:4200/";
    List<String> tableNumberLlt = new ArrayList<>();

    @BeforeMethod(groups = "booking")
    public void selectTable() {
        driver.get(this.host);
        int count = 0;
        try {
            Thread.sleep(2000);
        } catch (Exception ex) {
            System.out.println("Error while thread sleeping");
        } finally {

            // Get all tables on current date.
            List<WebElement> topRightTables = driver.findElements(
                    By.cssSelector("label.res-table"));
            for (WebElement tblElement : topRightTables) {
                try {
                    tblElement.click();
                    WebElement e = tblElement.findElement(By.cssSelector("app-table-element > label > div.selected"));
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

    @Test(priority = 3, groups = "booking")
    public void reserveThreeTablesTest() {
        try {
            Thread.sleep(2000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
//            Check the table name on confirmbooking screen
            List<WebElement> listTables = driver.findElements(
                    By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > div.text-center.header-confirm-booking > div:nth-child(3) > div >*"));
            int cnt = 0;
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


    @Test(priority = 4)
    public void confirmBookingTest() {
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            WebElement confirmBtn = driver.findElement(
                    By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > form > div:nth-child(4) > div.col.text-center.show > input"));
            confirmBtn.click();
        }
        try {
            Thread.sleep(3000);
        } catch (InterruptedException e) {
            e.printStackTrace();
        } finally {
            WebElement successMsg = driver.findElement(
                    By.cssSelector("body > app-root > div > app-confirm-booking > div > div > div.card-body > div.alert.alert-primary.show"));
            Assert.assertEquals(successMsg.getText().trim(), "Your table is reserved successfully!!!");
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

    @AfterClass(alwaysRun = true)
    public void tearDown() throws Exception {
        if (driver != null) {
            driver.quit();
        }
    }
}
