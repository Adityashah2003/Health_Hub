import pool from '../../../../db';
import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';
import { createToken } from '@/app/actions';

export async function POST(req, res) {
  const body = await req.json();
  const { username, password, role } = body;

  try {
    const client = await pool.connect();

    let table;
    let roleType;
    if (role === 'customer') {
      table = 'customer';
      roleType = 'Customer';
    } else if (role === 'seller') {
      table = 'seller';
      roleType = 'Seller';
    }

    if (table) {
      const result = await client.query(
        `SELECT * FROM ${table} WHERE username = $1 AND password = $2`,
        [username, password]
      );

      if (result.rows.length > 0) {
        const result = await client.query(
          `SELECT CUST_ID FROM ${table} WHERE username = $1`,
          [username]
        );
  
        const id =  result.rows[0].cust_id
        const token = jwt.sign({ cust_id: id }, process.env.JWT_SECRET);
        createToken(token)

        // Authentication successful
        const custId = result.rows[0].cust_id;

        // Fetch the last Login_id and increment it for the new login
        const lastLoginIdQuery = await client.query(
          `SELECT MAX(Login_id) AS last_login_id FROM Login`
        );
        const lastLoginId = lastLoginIdQuery.rows[0].last_login_id || 0;
        const newLoginId = lastLoginId + 1;

        // Insert login information into the Login table
        await client.query(
          `INSERT INTO Login (Login_id, Cust_id, Role) VALUES ($1, $2, $3)`,
          [newLoginId, custId, roleType]
        );

        // console.log('Logged in successfully');
        client.release();
        return NextResponse.json({ message: 'Login Successful'}, { status: 200 });
      } else {
        // Authentication failed
        console.log('Login failed');
        client.release();
        return NextResponse.json({ error: 'Login Failed' }, { status: 401 });
      }
    } else {
      // Role not recognized
      client.release();
      return NextResponse.json({ error: 'Role not recognized' }, { status: 401 });
    }
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
