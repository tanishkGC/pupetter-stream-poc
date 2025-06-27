const { launch, getStream, wss } = require('puppeteer-stream');
const fs = require('fs');

const file = fs.createWriteStream(__dirname + '/test.webm');

async function test() {
  const browser = await launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    // or on linux: "google-chrome-stable"
    // or on mac: "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome"
    defaultViewport: {
      width: 1400,
      height: 800
    }
  });

  const page = await browser.newPage();
  await page.goto(
    'https://events.release.goldcast.io/auth/link/41010ead-9c38-4699-9703-4e83b145df3a/AhrAPjaoSwo?eventID=2374465e-54ec-4e4f-875c-c564b03eccfa&shortId=82114'
  );
  await page.locator('#enter-live-broadcast').click();
  await page.locator('[class*="SpeakerTestCard_main"]').click();
  await page.locator('[class*="SpeakerTestCard_rightButton"]').click();
  await page.locator('[class*="TechCheckResults_actionButton"]').click();
  await page.locator('[class*="PillButton_uppercase_9f1ec"]').click();
  await page.locator('[data-testid="agenda-item-join"]').click();
  const stream = await getStream(page, { audio: true, video: true });
  console.log('recording');

  stream.pipe(file);
  setTimeout(async () => {
    await stream.destroy();
    file.close();
    console.log('finished');

    await browser.close();
    (await wss).close();
  }, 1000 * 120);
}

test(); 