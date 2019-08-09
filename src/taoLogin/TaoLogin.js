const puppeteer = require('puppeteer');
const TUSER = require('../config/TaobaoUser');
const {
  js1,
  js2,
  js3,
  js4,
  js5
} = require('./webdriverChange') 

const TAO_LOGIN_URL = "https://login.taobao.com/member/login.jhtml?style=mini&from=b2b&full_redirect=true"

async function login() {
  const browser = await puppeteer.launch({
    headless: false
  })
  browser.userAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/58.0.3029.110 Safari/537.36 Edge/16.16299')
  const page = await browser.newPage();
  // page.setViewport({
  //   width: 1376,
  //   height: 1376
  // });
  await page.goto(TAO_LOGIN_URL)

  const opts = {
    delay: 2 + Math.floor(Math.random() * 20), //每个字母之间输入的间隔
  }

  await page.evaluate(js1)
  // await page.evaluate(js2)
  await page.evaluate(js3)
  await page.evaluate(js4)
  await page.evaluate(js5)

  await page.tap('#TPL_username_1');
  await page.type('#TPL_username_1',TUSER.username,opts)
  await page.waitFor(2000)
  await page.tap('#TPL_password_1');
  await page.type('#TPL_password_1',TUSER.password,opts)

  const slider = await page.$eval('#nocaptcha', node => node.style)
  if (slider && Object.keys(slider).length) {
    // await page.screenshot({
    //   'path': path.join(__dirname, 'screenshots', 'login-slide.png')
    // })
    await mouseSlide(page)
  }

  await page.waitFor(1000 + Math.floor(Math.random() * 2000));
  // await page.tap('##nc_1_n1z');
  let loginBtn = await page.$('#J_SubmitStatic')
  await loginBtn.click({
    delay: 20
  })
  
  await page.waitFor(20)
  await page.waitForNavigation()
  
  let errr = await page.$('.error')
  // console.log(errr);
  
  // try {
  //   const error = await page.$eval('.error', node => node.textContent)
  
  //   let cookies = await getCookie(page)
  //   console.log(cookies)
  // } catch (error) {
  //   console.log('确保账户安全重新入输入');
  //   console.log(error);
    
  //   // browser.close()
  //   return null;
  // }
  
 
  // browser.close()
  if(errr) {
    console.log("登录失败");
  } else {
    
    let cookies = await getCookie(page)
    return cookies
    // return getCookie(page)
  }

}

const getCookie = async (page) =>  {
  let cookies = await page.cookies() 
  
  return cookies
}

const mouseSlide = async (page) => {
  let bl = false
  while (!bl) {
    try {
      await page.hover('#nc_1_n1z')
      await page.mouse.down()
      await page.mouse.move(2000, 0, {
        'delay': 1000 + Math.floor(Math.random() * 1000)
      })
      await page.mouse.up()

      slider_again = await page.$eval('.nc-lang-cnt', node => node.textContent)
      console.log('slider_again', slider_again)
      if (slider_again != '验证通过') {
        bl = false;
        await page.waitFor(1000 + Math.floor(Math.random() * 1000));
        break;
      }
      await page.screenshot({
        'path': path.join(__dirname, 'screenshots', 'result.png')
      })
      console.log('验证通过')
      return 1
    } catch (e) {
      console.log('error :slide login False', e)
      bl = false;
      break;
    }
  }
}

// taobaoLogin()

module.exports = {
  login
}