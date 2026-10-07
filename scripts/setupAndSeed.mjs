/**
 * Standalone Supabase Table Verification & Population Script
 * Run with: node scripts/setupAndSeed.mjs
 */

import { createClient } from '@supabase/supabase-js';

const SUPABASE_URL = 'https://dsmxzovrvclvxyxkbpxx.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImRzbXh6b3ZydmNsdnh5eGticHh4Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTEzMjM4MzMsImV4cCI6MjEwNjg5OTgzM30.aSb-LkUcEoC26fdrK-EwEo0x9hUr86vWs-C4Sf4PvjU';

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

const TABLES = [
  'categories',
  'market_locations',
  'commodities',
  'store_prices',
  'price_history',
  'citizen_price_reports'
];

async function main() {
  console.log('====================================================');
  console.log('SUKI Supabase Diagnostic & Table Inspector');
  console.log(`Endpoint: ${SUPABASE_URL}`);
  console.log('====================================================\n');

  console.log('Scanning tables in Supabase...');
  let missing = [];

  for (const table of TABLES) {
    const { data, count, error } = await supabase.from(table).select('*', { count: 'exact' }).limit(1);
    if (error) {
      console.log(`❌ Table [${table}]: NOT FOUND IN SCHEMA (${error.message})`);
      missing.push(table);
    } else {
      console.log(`✅ Table [${table}]: ACTIVE (Row count: ${count ?? (data ? data.length : 0)})`);
    }
  }

  console.log('\n----------------------------------------------------');
  if (missing.length > 0) {
    console.log(`⚠️ Status: ${missing.length} tables are not created yet in Supabase.`);
    console.log('\nHow to create tables:');
    console.log('1. Open Supabase SQL Editor:');
    console.log('   https://supabase.com/dashboard/project/dsmxzovrvclvxyxkbpxx/sql/new');
    console.log('2. Paste the contents of `schema.sql`.');
    console.log('3. Click "Run" (or Ctrl+Enter). All 6 tables, views, and RLS policies will be created.');
    console.log('4. Run `node scripts/setupAndSeed.mjs` again or click "Scan Tables" in the web UI.');
  } else {
    console.log('🎉 Status: All tables are created and ready in Supabase!');
    console.log('You can now click "Populate Sample Data to Supabase" in the web UI or run the seeder.');
  }
  console.log('----------------------------------------------------\n');
}

main().catch(console.error);

