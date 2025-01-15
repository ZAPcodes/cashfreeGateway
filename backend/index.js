import express from 'express';
import cors from 'cors';
import crypto from 'crypto';
import path from "path"; 
import { fileURLToPath } from "url"; 
import {Cashfree} from 'cashfree-pg';
import dotenv from 'dotenv'

dotenv.config();

const app = express();
app.use(cors());


app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));



Cashfree.XClientId = process.env.CLIENT_ID;
Cashfree.XClientSecret = process.env.CLIENT_SECRET;
Cashfree.XEnvironment = Cashfree.Environment.PRODUCTION;


function generateOrderId() {
    const uniqueId = crypto.randomBytes(16).toString('hex');

    const hash = crypto.createHash('sha256');
    hash.update(uniqueId);

    const orderId = hash.digest('hex');

    return orderId.substring(0, 12);
}



app.get('/api/payment', async (req, res) => {

    try {

        let request = {
            "order_amount": 1.00,
            "order_currency": "INR",
            "order_id": await generateOrderId(),
            customer_details: {
                "customer_id": "webcodder01",
                "customer_phone": "8809795723",
                "customer_name": "Abhinav",
                "customer_email": "zap@example.com"
            },
        }

        Cashfree.PGCreateOrder("2023-08-01", request).then(response => {
            console.log(response.data);
            res.json(response.data);

        }).catch(error => {
            console.error(error.response.data.message+"here");
        })


    } catch (error) {
        console.log(error);
    }


})

app.post('/api/verify', async (req, res) => {

    try {

        let {
            orderId
        } = req.body;

        Cashfree.PGFetchOrder("2023-08-01", orderId).then((response) => {

            res.json(response.data);
        }).catch(error => {
            console.error(error.response.data.message);
        })


    } catch (error) {
        console.log(error);
    }
})

app.listen(8000, () => {
    console.log('Server is running on port 8000');
})