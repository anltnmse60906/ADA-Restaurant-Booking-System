import org.openqa.selenium.By;
import org.openqa.selenium.WebDriver;
import org.openqa.selenium.WebElement;
import org.openqa.selenium.chrome.ChromeDriver;
import org.testng.Assert;
import org.testng.annotations.*;

public class AuthenticationTest{
    /*
    Please go to website http://jonathansoma.com/lede/foundations-2017/classes/more-scraping/selenium/
    for setting the environment for MAC
    */
    public static WebDriver driver;
    String emailStr = "";


    @Test(priority = 0, groups = {"authentication"})
    public void testSignupFunction() {
        driver.get(Config.host + "signup");
        WebElement email=driver.findElement(By.cssSelector("#email"));
        int randomNumber = (int) (Math.random()*1000);
        emailStr = new StringBuilder("user01").append(randomNumber).append("@student.uts.edu.au").toString();
        email.sendKeys(emailStr);

        WebElement password =driver.findElement(By.cssSelector("#password"));
        password.sendKeys("test_0111111");

        WebElement firstName =driver.findElement(By.cssSelector("#firstName"));
        firstName.sendKeys("Tran Nhut");

        WebElement lastName =driver.findElement(By.cssSelector("#lastName"));
        lastName.sendKeys("Le");

        WebElement phoneNumber =driver.findElement(By.cssSelector("#phoneNumber"));
        phoneNumber.sendKeys("33387432");

        WebElement submitBtn = driver.findElement(By.xpath("/html/body/app-root/div/app-signup/div/div/div/div[2]/section/div/div/div/div[2]/div/form/button"));

        submitBtn.click();

        try {
            Thread.sleep(2000);
        } catch (Exception ex){
            System.out.println("Error while thread sleeping");
        }finally {
            WebElement loginMsg = driver.findElement(By.cssSelector("#swal2-title"));
            System.out.println(loginMsg.getText().trim());
            Assert.assertEquals(loginMsg.getText().trim(),"Sign up Success");
        }
    }

    @Test(priority = 1,groups = {"authentication"})
    public void testSignupEmailDupplicatedFunction() {

        driver.get(Config.host + "signup");
        WebElement email=driver.findElement(By.cssSelector("#email"));
        email.sendKeys(emailStr);

        WebElement password =driver.findElement(By.cssSelector("#password"));
        password.sendKeys("test_0111111");

        WebElement firstName =driver.findElement(By.cssSelector("#firstName"));
        firstName.sendKeys("Tran Nhut");

        WebElement lastName =driver.findElement(By.cssSelector("#lastName"));
        lastName.sendKeys("Le");

        WebElement phoneNumber =driver.findElement(By.cssSelector("#phoneNumber"));
        phoneNumber.sendKeys("33387432");

        WebElement submitBtn = driver.findElement(By.xpath("/html/body/app-root/div/app-signup/div/div/div/div[2]/section/div/div/div/div[2]/div/form/button"));

        submitBtn.click();

        try {
            Thread.sleep(2000);
        } catch (Exception ex){
            System.out.println("Error while thread sleeping");
        }finally {
            WebElement loginMsg = driver.findElement(By.cssSelector("#swal2-content"));
            System.out.println(loginMsg.getText().trim());
            Assert.assertEquals(loginMsg.getText().trim(),"Email has been registered");
        }
    }

    @Test(priority = 2,groups = {"authentication"})
    public void testLoginFunction() {
        driver.get(Config.host + "signin");
        WebElement email=driver.findElement(By.cssSelector("#username"));
        email.sendKeys(emailStr);

        WebElement password =driver.findElement(By.cssSelector("#password"));
        password.sendKeys("test_0111111");

        WebElement submitBtn = driver.findElement(By.cssSelector("#formLogin > button"));

        submitBtn.click();

        try {
            Thread.sleep(2000);
        } catch (Exception ex){
            System.out.println("Error while thread sleeping");
        }finally {
            WebElement loginMsg = driver.findElement(By.cssSelector("#swal2-content"));
            System.out.println(loginMsg.getText().trim());
            Assert.assertEquals(loginMsg.getText().trim(),"Login success");
        }
    }

    @BeforeClass
    public void start() {
        System.out.println(" before start");
        try{
            driver = new ChromeDriver();
        } catch (Exception ex){
            System.out.println("Exception while instantiating driver. " + ex.getMessage());
        }
    }
}
