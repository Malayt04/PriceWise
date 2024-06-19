import request from 'request-promise'
import cheerio from 'cheerio'; 
import { extractPrice, extractCurrency, extractDescription } from '../utils';
import { Console } from 'console';
export async function scrapeAmazonProduct(url:string){
    if(!url) return;

    try {
        const username = process.env.BRIGHT_DATA_USERNAME;
        const password = process.env.BRIGHT_DATA_PASSWORD;
        const port = 22225;
        const session_id = (1000000 * Math.random())|0;
        const super_proxy = 'http://'+username+'-country-in-session-'+session_id+':'+password+'@brd.superproxy.io:'+port;

        const options = {
            url,
            proxy: super_proxy,
            rejectUnauthorized: false
        }

        const data = await request(options);
        const $ = cheerio.load(data);


            const title = $('#productTitle').text();

            const currentPrice = extractPrice(
                $('.priceToPay span.a-price-whole'),
                $('.a.size.base.a-color-price'),
                $('.a-button-selected .a-color-base'),
              );

            const originalPrice = extractPrice(
                $('#priceblock_ourprice'),
                $('.a-price.a-text-price span.a-offscreen'),
                $('#listPrice'),
                $('#priceblock_dealprice'),
                $('.a-size-base.a-color-price'),
              );

              const stock = $('#availability span').text().trim().toLowerCase();
              const image = $('#landingImage').attr('data-a-dynamic-image')||'{}';
              const imageurl = Object.keys(JSON.parse(image));
              const currency = extractCurrency($('.a-price-symbol'));
              const discountPercent =$('.savingsPercentage').text().replace(/[-%]/g, "");
              const description = extractDescription($);

              const parsedData = {
                url,
                currency,
                stock,
                originalPrice:Number(originalPrice),
                currentPrice:Number(currentPrice),
                priceHistory: [],
                discountPercent: Number(discountPercent),
                imageurl:imageurl[0],
                description,
                lowestPrice: Number(currentPrice) || Number(originalPrice),
                highestPrice: Number(originalPrice) || Number(currentPrice),
                averagePrice: Number(currentPrice) || Number(originalPrice),
              }

              return parsedData;
              

    } catch (error:any) {
        throw new Error("error in scrapper", error.message)
    }


}

