import { authenticateToken } from '@/app/actions';
import pool from '../../../db';
import { NextResponse } from 'next/server';

export async function GET(req, res){
  try {
    const client = await pool.connect();
    try{
      console.log("connected to the database")
      const result = await client.query('SELECT p_id, p_name, description, price, image1 FROM product');
      const products = result.rows;
      client.release();
  
      console.log("Products: ",products);
      return NextResponse.json(products, { status: 200 });
    }
    catch (error) {
      console.error('Error fetching products:', error);
      return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
    }
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
};
