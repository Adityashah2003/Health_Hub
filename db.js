import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres.dckbfjiakrirkszcoqew',
  password: 'QAsivJivd2kTFLWH',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  max: 20, // Maximum number of clients in the pool
  ssl: { rejectUnauthorized: false },
});

export default pool;

