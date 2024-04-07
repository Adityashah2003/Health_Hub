import { NextResponse } from 'next/server';
import pool from '../../../db';
import { getToken } from '@/app/actions';

export async function DELETE(req, res){
    const body = await req.json();
    const { product_id } = body;

    try {
        const client = await pool.connect();

        // const fetchCustIdQuery = 'SELECT Cust_id FROM Login ORDER BY Login_id DESC LIMIT 1';
        // const custIdResult = await client.query(fetchCustIdQuery);
        // const cust_id = custIdResult.rows[0].cust_id;
        const cust_id = await getToken(); 

        const selectQuery = 'SELECT * FROM AddsToCart WHERE P_id = $1 AND Cust_id = $2';
        const result = await client.query(selectQuery, [product_id, cust_id]);

        if (result.rows.length > 0) {
            if (result.rows[0].quantity > 1) {
                const updateQuery = 'UPDATE AddsToCart SET Quantity = Quantity - 1 WHERE P_id = $1 AND Cust_id = $2';
                await client.query(updateQuery, [product_id, cust_id]);

                const updateProductQuery = 'UPDATE Product SET Quantity = Quantity + 1 WHERE P_id = $1';
                await client.query(updateProductQuery, [product_id]);
                client.release();
                return NextResponse.json({ message: 'Product quantity decremented in cart.' }, {status: 200});
            } else {
                const deleteQuery = 'DELETE FROM AddsToCart WHERE P_id = $1 AND Cust_id = $2';
                await client.query(deleteQuery, [product_id, cust_id]);

                const updateProductQuery = 'UPDATE Product SET Quantity = Quantity + 1 WHERE P_id = $1';
                await client.query(updateProductQuery, [product_id]);
                client.release();
                return NextResponse.json({ message: 'Product removed from cart.' }, {status: 200});
            }
        } else {
            client.release();
            return NextResponse.json({ message: 'Product not found in the cart.' }, {status: 404});
        }

    } catch (error) {
        console.error(error);
        return NextResponse.json({ message: 'Internal server error' }, {status: 500});
    }
};