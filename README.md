# Fiscal Receipt Processor API

A Node.js Express API for processing fiscal receipts, connecting to a MySQL database using Prisma ORM.

## Features

- Collect fiscal receipt data from Google Sheets via POST /collect-receipts
- Forward customer requests to external receipt links via GET /racun
- Admin access with GET/POST/PUT/DELETE on endpoint /admin/receipts-processor
