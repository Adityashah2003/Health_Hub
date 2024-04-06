import pool from '../../../db';
import { NextResponse } from 'next/server';
import { getToken } from '@/app/actions';

export async function GET(req, res){
  try {
    const client = await pool.connect();
    
    const cust_id = await getToken(); 

    const customer_result = await client.query(`SELECT * FROM Customer WHERE Cust_id = ${cust_id}`);
    const customer_info = customer_result.rows[0];

    const all_order_history = await client.query(
        `SELECT P.P_id, P.P_name, P.Description, P.Price, P.image1
        FROM Product P, PlacesOrder PO
        WHERE PO.Cust_id =
        ${cust_id} AND P.P_id = PO.P_id`
    );

    const order_history = all_order_history.rows.map((row) => ({
        productId: row.p_id,
        name: row.p_name,
        quantity: row.quantity,
        image1: row.image1,
        price: row.price
    }))

    const all_user_reviews = await client.query(`
        SELECT R.Review_id, R.Description, R.Rating, H.P_id
        FROM Review R, Gives G, Has H
        WHERE G.Cust_id =  ${cust_id} AND R.Review_id = G.Review_id AND H.Review_id = R.Review_id;`
    );

    const user_reviews = all_user_reviews.rows.map((row) => ({
        productId: row.p_id,
        reviewId: row.review_id,
        description: row.description,
        rating: row.rating
    }))

    client.release();
    return NextResponse.json({customer_info, order_history, user_reviews}, { status: 200 });
  } catch (error) {
    console.error('Error fetching user details:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
