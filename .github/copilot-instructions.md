<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# Fiscal Receipt Processor API

This is a Node.js Express API for processing fiscal receipts, built with Prisma ORM connecting to a MySQL database.

## Tech Stack

- Node.js (latest LTS)
- Express.js
- Prisma ORM
- MySQL database
- Development: nodemon

## Project Structure

- `src/app.js`: Main application file with Express server and API routes
- `prisma/schema.prisma`: Database schema definition
- `prisma.config.ts`: Prisma configuration
- `.env`: Environment variables (DATABASE_URL for MySQL)
- `package.json`: Dependencies and scripts

## API Endpoints

### POST /collect-receipts

Collects fiscal receipt data from external sources (e.g., Google Sheets).

**Request Body:**

```json
{
  "fiscal_receipt_number": "string (unique)",
  "name": "string",
  "surname": "string",
  "customer_address": "string",
  "fiscal_receipt_external_link": "string (URL)",
  "date_receipt_sent_to_customer": "string (ISO date)"
}
```

**Responses:**

- 201: Success, receipt stored
- 400: Missing required fields
- 409: Duplicate receipt number
- 500: Server error

### GET /receipts?receipt_number=<string>

Retrieves and redirects to the external fiscal receipt link.

**Query Parameters:**

- `receipt_number`: Unique fiscal receipt identifier

**Responses:**

- 302: Redirect to external link
- 400: Missing receipt_number
- 404: Receipt not found
- 500: Server error

## Setup Instructions

1. **Install dependencies:**

   ```bash
   npm install
   ```

2. **Configure database:**
   - Update `.env` with your MySQL DATABASE_URL
   - Example: `DATABASE_URL="mysql://user:password@host:port/database"`

3. **Run database migrations:**

   ```bash
   npm run prisma:migrate
   ```

4. **Generate Prisma client:**

   ```bash
   npm run prisma:generate
   ```

5. **Start development server:**
   ```bash
   npm run dev
   ```
   Server runs on http://localhost:3000

## Development Guidelines

- Use Prisma Studio for database inspection: `npm run prisma:studio`
- All receipt numbers must be unique
- External links should be valid URLs
- Handle errors gracefully in API responses
- Use environment variables for configuration
- Follow RESTful API conventions

## Database Schema

**FiscalReceipt Model:**

- `id`: Auto-incrementing primary key
- `receiptNumber`: Unique string identifier
- `name`: Customer first name
- `surname`: Customer last name
- `address`: Customer address
- `externalLink`: URL to fiscal receipt
- `dateSent`: DateTime when receipt was sent

## Common Tasks

- **Add new fields:** Update `prisma/schema.prisma`, run migrations
- **Modify endpoints:** Edit `src/app.js`
- **Add validation:** Enhance request body checks
- **Error handling:** Improve try-catch blocks
- **Testing:** Add unit tests for endpoints

## Security Notes

- Validate all input data
- Use parameterized queries (handled by Prisma)
- Store sensitive config in environment variables
- Implement rate limiting if needed
- Sanitize external URLs before redirect

This API serves as a bridge between data collection systems (like Google Sheets) and external fiscal receipt providers, ensuring secure storage and retrieval of receipt information.
