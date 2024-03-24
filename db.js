import { Pool } from 'pg';

const pool = new Pool({
  user: 'postgres.dckbfjiakrirkszcoqew',
  password: 'QAsivJivd2kTFLWH',
  host: 'aws-0-ap-south-1.pooler.supabase.com',
  port: 5432,
  database: 'postgres',
  ssl: { rejectUnauthorized: false },
});

export default pool;


// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   password: 'aditya',
//   host: 'localhost',
//   port: 5432,
//   database: 'hh',
// });

// export default pool;


// import { Pool } from 'pg';

// const pool = new Pool({
//   user: 'postgres',
//   password: 'root',
//   host: 'localhost',
//   port: 5432,
//   database: 'hh', 
// });

// export default pool;
