# capybara MVP

Monorepo:
- `backend` - Rails 8 API
- `frontend` - React (Vite)

## Backend run

```bash
cd backend
bundle install
bundle exec rails db:create db:migrate db:seed
bundle exec rails s
```

Auth token options:
- legacy admin token: `capybara-dev-token`
- seeded admin token: `admin-demo-token`
- seeded production token: `production-demo-token`
- seeded customer token: `customer-demo-token`
- seeded furniture maker token: `maker-demo-token`

For actor-scoped tokens:
- `furniture_maker` sees only orders of linked maker.
- `customer` sees only orders with the same `customer_uid`.

## Backend tests

```bash
cd backend
bundle exec rails db:drop db:create db:migrate RAILS_ENV=test
bundle exec rspec
```

## Frontend run

```bash
cd frontend
npm install
npm run dev
```

In UI, select role preset to auto-fill demo token:
- `admin-demo-token`
- `production-demo-token`
- `customer-demo-token`
- `maker-demo-token`

## Frontend tests

```bash
cd frontend
npm test
npm run build
```

## API v1 endpoints

Base path: `/api/v1`

- `GET /furniture_makers/:bin_iin/score`
- `GET /orders?page=1&per_page=20`
- `POST /orders`
- `GET /orders/:id`
- `PATCH /orders/:id/transition`
- `POST /orders/:order_id/change_requests`
- `PATCH /change_requests/:id/approve`
- `POST /orders/:order_id/acceptance_act`
- `POST /orders/:order_id/review`

## Score API example

Request:

```bash
curl -H "Authorization: Bearer capybara-dev-token" \
  http://localhost:3000/api/v1/furniture_makers/123456789012/score
```

Response:

```json
{
  "bin_iin": "123456789012",
  "score": 78,
  "score_band": "high",
  "components": {
    "recency": 80,
    "frequency": 75,
    "volume": 72,
    "quality": 85
  },
  "insufficient_data": false,
  "calculated_at": "2026-04-14T10:00:00Z"
}
```

## Unified error format

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {}
  }
}
```

OpenAPI spec: `backend/docs/openapi.yaml`
