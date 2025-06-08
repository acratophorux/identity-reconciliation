# Identity Reconciliation

A service to resolve user identities across multiple contact points (email, phone) and unify them into a single canonical contact profile.

Live API: [https://identity-reconciliation-5juo.onrender.com/identify](https://identity-reconciliation-5juo.onrender.com/identify)  

<!-- ---

## Features

- Accepts email and/or phone number
- Resolves and merges contacts based on linkage rules
- Maintains primary-secondary relationships
- Prevents duplicate entries
- Follows consistent precedence logic -->

---

## Usage

### Endpoint

POST /identify

#### Request Body (any combination of the fields):
```json
{
  "email": "example@example.com",
  "phoneNumber": "1234567890"
}
```

#### Sample Response:
```json
{
  "contact": {
    "primaryContactId": 1,
    "emails": ["example@example.com", "another@example.com"],
    "phoneNumbers": ["1234567890"],
    "secondaryContactIds": [2, 3]
  }
}
```
---

## Running Locally
# 1. Clone
```bash
git clone https://github.com/acratophorux/identity-reconciliation.git
cd identity-reconciliation
```

# 2. Install dependencies
```bash
npm install
```

# 3. Set up environment variables
```bash
cp .env.example .env
```
 Fill in `DB_URL=postgres://user:password@host:port/identity_recon`

# 5. Start the server
```bash
npm run dev
```

> Server will run at http://localhost:3000

---

## Tech Stack

- Node.js
- Express.js
- PostgreSQL
- TypeORM

---

## Environment Variables
```
PORT=3000
DB_URL=postgres://user:password@host:port/identity_recon
```
---

## Author

Made with care by Dinesh Kumar  
[GitHub Repo](https://github.com/acratophorux/identity-reconciliation)

---