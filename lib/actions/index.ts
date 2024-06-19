"use server"

import { scrapeAmazonProduct } from "../scrapper";
import dbConnect from "../db/connectDb";
export async function scrapeAndStoreProduct(productUrl: string){
    if(!productUrl) return;
    dbConnect();
    try {
        const scrapedProduct = await scrapeAmazonProduct(productUrl);
        if(!scrapedProduct) return;
        
        
    } catch (error: any) {
        throw new Error(`Problem in action: ${error.message}`);
    }
    }
