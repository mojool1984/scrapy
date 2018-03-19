#!/usr/bin/env node

const puppeteer = require('puppeteer');
const path		= require('path');

async function scroll_to_until(page, max_y_pixels) {
	var scroll_delay = 1000

	// reference: https://intoli.com/blog/scrape-infinite-scroll/
	var prev_height = await page.evaluate('document.body.scrollHeight');
	await page.evaluate('window.scrollTo(0, document.body.scrollHeight)');
	await page.waitForFunction(`document.body.scrollHeight > ${prev_height}`);
	await page.waitFor(scroll_delay);
}

async function take_screenshot(page, savedir) {
	await page.setViewport({width: 1280, height: 720});
	await page.screenshot({path: 'part_screenshot.png'});

	var page_width = await page.evaluate(() => {
		return Math.max(document.body.scrollWidth,
						document.body.offsetWidth,
						document.documentElement.clientWidth,
						document.documentElement.scrollWidth,
						document.documentElement.offsetWidth);
	});

	var page_height = await page.evaluate(() => {
		return Math.max(document.body.scrollHeight,
						document.body.offsetHeight,
						document.documentElement.clientHeight,
						document.documentElement.scrollHeight,
						document.documentElement.offsetHeight);
	});

	await page.setViewport({width: page_width, height: page_height});
	await page.screenshot({path: 'full_screenshot.png'});
}

async function dump_html() {
}

async function run() {
	const browser = await puppeteer.launch({headless: false, args: []});
	const page = await browser.newPage();

	//await page.goto('https://github.com', {waitUntil: ['networkidle0'], timeout: 3*60*1000});
	await page.goto('https://www.instagram.com/sky/', {waitUntil: ['networkidle0'], timeout: 3*60*1000});

	await scroll_to_until(page, 2000);

	await take_screenshot(page);
	
	await browser.close();
}

run();
