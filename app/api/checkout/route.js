import { NextResponse } from 'next/server';
import pool from '../../../db';
import { getToken } from '@/app/actions';

export async function GET(req, res){
    try {
      const client = await pool.connect();

      // Fetch the Cust_id from the last row of the Login table
      // const custIdQuery = 'SELECT Cust_id FROM Login ORDER BY Login_id DESC LIMIT 1';
      // const custIdResult = await client.query(custIdQuery);
      // const custId = custIdResult.rows[0].cust_id;

      const custId = await getToken(); 

      // Use the fetched Cust_id in the query
      const query = `SELECT 
        Product.P_id, 
        Product.P_name, 
        AddsToCart.Quantity, 
        Product.Price, 
        Product.Image1 
        FROM Product 
        JOIN AddsToCart 
        ON Product.P_id = AddsToCart.P_id 
        WHERE AddsToCart.Cust_id = ${custId}`;

      const result = await client.query(query);
      const cartItems = result.rows.map((row) => ({
        productId: row.p_id,
        name: row.p_name,
        quantity: row.quantity,
        image1: row.image1,
        price: row.price
      }));
      client.release();
      return NextResponse.json(cartItems, {status:200});
      
    } catch (error) {
      console.error(error);
      return NextResponse.json({ message: 'Internal server error' }, {status:500});
    }
};
