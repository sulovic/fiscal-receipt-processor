# Fiscal Receipt Processor API

A Node.js Express API for processing fiscal receipts, connecting to a MySQL database using Prisma ORM.

## Features

- Collect fiscal receipt data from Google Sheets via POST /collect-receipts
- Retrieve and forward to external receipt links via GET /receipts

## Setup

1. Install dependencies:
   ```bash
   npm install
   ```

2. Update the `.env` file with your MySQL database URL:
   ```
   DATABASE_URL="mysql://username:password@localhost:3306/your_database_name"
   ```

3. Run Prisma migrations to set up the database schema:
   ```bash
   npm run prisma:migrate
   ```

4. Generate Prisma client:
   ```bash
   npm run prisma:generate
   ```

5. Start the server:
   ```bash
   npm run dev  # for development with nodemon
   # or
   npm start    # for production
   ```

The server will run on port 3000 by default.

## API Endpoints

### POST /collect-receipts
Collects fiscal receipt data.

**Request Body:**
```json
{
  "fiscal_receipt_number": "unique_receipt_id",
  "name": "Customer Name",
  "surname": "Customer Surname",
  "customer_address": "Customer Address",
  "fiscal_receipt_external_link": "https://external-link.com/receipt",
  "date_receipt_sent_to_customer": "2023-10-01T00:00:00Z"
}
```

**Response:**
- 201: Receipt created successfully
- 400: Missing required fields
- 409: Receipt number already exists
- 500: Internal server error

### GET /receipts?receipt_number=<number>
Retrieves and forwards to the external receipt link.

**Query Parameters:**
- `receipt_number`: The unique fiscal receipt number

**Response:**
- Redirects to external link if found
- 400: Missing receipt_number
- 404: Receipt not found
- 500: Internal server error

## Database Schema

The `FiscalReceipt` model includes:
- `id`: Auto-incrementing primary key
- `receiptNumber`: Unique receipt number
- `name`: Customer name
- `surname`: Customer surname
- `address`: Customer address
- `externalLink`: External fiscal receipt link
- `dateSent`: Date the receipt was sent to the customer