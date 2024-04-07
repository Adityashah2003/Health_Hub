import { NextResponse } from 'next/server';
import pool from '../../../db';
import { getToken } from '@/app/actions';

export async function GET(req, res){
  const client = await pool.connect();
  try {
    await client.query('BEGIN');

    // const custIdQuery = 'SELECT Cust_id FROM Login ORDER BY Login_id DESC LIMIT 1';

    if (client) {
    // const custIdResult = await client.query(custIdQuery);
    // const custId = custIdResult.rows[0].cust_id; // Check the case here
    const custId = await getToken(); 

    const maxOrderIdQuery = 'SELECT COALESCE(MAX(order_id), 0) + 1 AS next_order_id FROM OrderTable';
    const maxOrderIdResult = await client.query(maxOrderIdQuery);
    const nextOrderId = maxOrderIdResult.rows[0].next_order_id;

    const totalPriceQuery = 'SELECT SUM(P.price * A.quantity) AS total_price FROM AddsToCart A JOIN Product P ON A.P_id = P.P_id WHERE A.Cust_id = $1';
    const totalPriceResult = await client.query(totalPriceQuery, [custId]);
    const totalPrice = totalPriceResult.rows[0].total_price;
    const insertOrderQuery = 'INSERT INTO OrderTable (Order_id, Price) VALUES ($1, $2)';
    await client.query(insertOrderQuery, [nextOrderId, totalPrice]);

    const insertPlacesOrderQuery = `
      INSERT INTO PlacesOrder (Cust_id, Order_id, P_id, Quantity, Price)
      SELECT $1, $2, A.P_id, A.Quantity, P.Price * A.Quantity
      FROM AddsToCart A
      JOIN Product P ON A.P_id = P.P_id
      WHERE A.Cust_id = $1`;
    await client.query(insertPlacesOrderQuery, [custId, nextOrderId]);
    const maxPayIdQuery = 'SELECT COALESCE(MAX(Pay_id), 0) + 1 AS next_pay_id FROM Payment';
    const maxPayIdResult = await client.query(maxPayIdQuery);
    const nextPayId = maxPayIdResult.rows[0].next_pay_id;

    const insertPaymentQuery = 'INSERT INTO Payment (Pay_id, Order_id) VALUES ($1, $2)';
    await client.query(insertPaymentQuery, [nextPayId, nextOrderId]);

    const maxDelIdQuery = 'SELECT COALESCE(MAX(Del_id), 0) + 1 AS next_del_id FROM DeliveryService';
    const maxDelIdResult = await client.query(maxDelIdQuery);
    const nextDelId = maxDelIdResult.rows[0].next_del_id;

    try {
      const randomDeliveryQuery = 'SELECT Service_name, Contact_del FROM DeliveryService ORDER BY RANDOM() LIMIT 1'; 
      const randomDeliveryResult = await client.query(randomDeliveryQuery);
      const { service_name, contact_del } = randomDeliveryResult.rows[0];

      const insertDeliveryQuery = 'INSERT INTO DeliveryService (Del_id, Order_id, service_name, contact_del) VALUES ($1, $2, $3, $4)';
      await client.query(insertDeliveryQuery, [nextDelId, nextOrderId, service_name, contact_del]);
  } catch (error) {
      console.error('Error executing query:', error);
  }
    const clearCartQuery = 'DELETE FROM AddsToCart WHERE Cust_id = $1';
    await client.query(clearCartQuery, [custId]);
    await client.query('COMMIT');
    client.release()
    return NextResponse.json({ orderId: nextOrderId }, {status:200});
    }
  } catch (error) {
    await client.query('ROLLBACK');
    client.release()
    console.error('Error in placing order:', error); // Log the specific error
    return NextResponse.json({ error: 'Database error' }, {status:500});
  } 
};
