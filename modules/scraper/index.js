const json = require("./links.json");
const puppeteer = require("puppeteer");
const fs = require("fs");
const { Console } = require("console");
const { user, password, website, header } = require("./CONSTS");

// Initialise final table
let selectedValues = [];

console.log("Starting the scraper module...");

(async () => {
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  console.log("Launching the page...");
  await page.goto(website);
  const title = await page.title();
  console.info(`The title is ${title}`);

  // LOGIN AND SCRAPE URLS

  await page.waitForSelector("#user_login");
  await page.waitForSelector("#user_pass");

  await page.focus("#user_login");
  await page.keyboard.type(user);
  await page.waitForTimeout(1000);
  await page.focus("#user_pass");
  await page.keyboard.type(password);

  // Check 'Remember Me'

  isChecked = await page.$eval(
    'input[id="rememberme"]',
    (check) => (check.checked = true)
  );
  console.log(isChecked);

  if (isChecked == true) {
    console.log("Remeber me checked:");
    await page.waitForTimeout(1000);
    await page.click("#rememberme");
    await page.waitForTimeout(1000);
  }

  await page.click("#wp-submit");
  await page.waitForTimeout(1000);

  // Find 'Recently Added' section and navigate there

  const recentlyAdded = await page.$x(
    '//a[contains(text(), "RECENTLY ADDED")]'
  );

  await recentlyAdded[0].click();
  await page.waitForTimeout(1000);

  // Find all the recent records links

  const recordsLinks = await page.evaluate(() => {
    const srcs = Array.from(document.querySelectorAll(".imgSrc")).map((image) =>
      image.getAttribute("href")
    );
    return srcs;
  });
  console.log("Page has been evaluated!");
  console.log("Saving the links...");

  // Persist data into data.json file
  fs.writeFileSync("./links.json", JSON.stringify(recordsLinks));
  console.log("Links file is created!");
  await page.waitForTimeout(1000);

  // Create final table's header
  selectedValues.push(header);

  console.log("Starting evaluating the records...");

  // Loop through all the gatheredlinks and scrape required data

  for (let i = 0; i < recordsLinks.length; i++) {
    console.log(`Looping through page number: ${i + 1}`);
    const url = recordsLinks[i];
    await page.goto(url);
    await page.waitForTimeout(1000);
    const title = await page.title();
    console.log(`The title is ${title}`);
    await page.waitForTimeout(2000);

    // Create a final values array
    let cleanValues = [
      "Release Date",
      "Artist",
      "Title",
      "Format",
      "Label",
      "Catalogue Number",
      "Barcode",
      "Price_Dealer",
      "Dance Style",
    ];

    let labels = await page.evaluate(() =>
      Array.from(
        document.querySelectorAll(".releaseInfo > dl dt, .releaseInfo > dl dd"),
        (element) => element.textContent
      )
    );

    // Data is in format "LABEL \N VALUE" so y+2 to access labels and y+1 to access corresponding values
    for (let y = 0; y < labels.length; y += 2) {
      // Find labels and assign their values to appropriate index in the clean values array
      switch (labels[y]) {
        case "RELEASE DATE":
          cleanValues[0] = labels[y + 1];
          break;
        case "ARTIST":
          cleanValues[1] = labels[y + 1];
          break;
        case "TITLE":
          cleanValues[2] = labels[y + 1];
          break;
        case "FORMAT":
          cleanValues[3] = labels[y + 1];
          break;
        case "LABEL":
          cleanValues[4] = labels[y + 1];
          break;
        case "CAT NO.":
          cleanValues[5] = labels[y + 1];
          break;

        case "DEALER PRICE":
          cleanValues[7] = labels[y + 1];
          break;

        case "GENRE":
          cleanValues[8] = labels[y + 1];
          break;

        case "BARCODE":
          cleanValues[6] = labels[y + 1];
          break;
      }
    }
    // Check if Barcode empty // price shifted in that place
    if (cleanValues[6][0] === "£") {
      cleanValues.splice(6, 0, "0");
    }
    // Push the clean row to final values array
    selectedValues.push(cleanValues);

    console.log("Record's values found:");
    console.log(cleanValues);

    fs.writeFileSync("./values.json", JSON.stringify(selectedValues));
    console.log("Values file updated!");
  }

  console.log("ALL DONE, QUITTING THE SCRAPER MODULE...");
  await browser.close();
})();
