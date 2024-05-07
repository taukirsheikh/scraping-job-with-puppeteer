const puppeteer = require('puppeteer');
const xlsx = require('xlsx');


async function run() {
    const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('https://merojob.com/search/?q=developer');

    const jobs = await page.evaluate(() => {
        const jobCards = Array.from(document.querySelectorAll('.job-card'));
        return jobCards.map(card => ({
            'job_position': card.querySelector('a').title,
            'company': card.querySelector('h3').title,
            'link': card.querySelector('a').href,
        }));
    });
    const workbook = xlsx.utils.book_new();
    const worksheet = xlsx.utils.json_to_sheet(jobs);
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Jobs');
    xlsx.writeFile(workbook, 'JobData.xlsx');



    console.log(jobs)

    await browser.close();
}

run();
