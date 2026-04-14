import { useMemo, useState } from 'react'
import './App.css'

const API_BASE = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:3000/api/v1'
const DEFAULT_TOKEN = import.meta.env.VITE_API_TOKEN ?? 'capybara-dev-token'
const ROLE_PRESETS = {
  admin: 'admin-demo-token',
  production_staff: 'production-demo-token',
  customer: 'customer-demo-token',
  furniture_maker: 'maker-demo-token',
}
const ORDER_FLOW = [
  'draft',
  'published',
  'measuring',
  'designing',
  'awaiting_design_approval',
  'in_production',
  'ready_for_delivery',
  'installing',
  'awaiting_acceptance',
  'completed',
]

async function apiRequest(path, { method = 'GET', token, body } = {}) {
  const response = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json().catch(() => ({}))
  if (!response.ok) {
    throw {
      status: response.status,
      code: data?.error?.code ?? 'unknown_error',
      message: data?.error?.message ?? `HTTP ${response.status}`,
      details: data?.error?.details ?? {},
    }
  }

  return data
}

function App() {
  const [role, setRole] = useState('admin')
  const [token, setToken] = useState(DEFAULT_TOKEN)
  const [makerBinIin, setMakerBinIin] = useState('123456789012')
  const [makerId, setMakerId] = useState('1')
  const [orderTitle, setOrderTitle] = useState('Кухня угловая')
  const [orderId, setOrderId] = useState(null)
  const [orderStatus, setOrderStatus] = useState('draft')
  const [scoreCard, setScoreCard] = useState(null)
  const [apiError, setApiError] = useState(null)
  const [loading, setLoading] = useState(false)

  const nextStatus = useMemo(() => {
    const idx = ORDER_FLOW.indexOf(orderStatus)
    if (idx === -1 || idx === ORDER_FLOW.length - 1) return null
    return ORDER_FLOW[idx + 1]
  }, [orderStatus])

  const withUiState = async (callback) => {
    setLoading(true)
    setApiError(null)
    try {
      await callback()
    } catch (error) {
      setApiError({
        status: error.status ?? null,
        code: error.code ?? 'unknown_error',
        message: error.message ?? 'Неизвестная ошибка API',
        details: error.details ?? {},
      })
    } finally {
      setLoading(false)
    }
  }

  const applyRolePreset = (nextRole) => {
    setRole(nextRole)
    setToken(ROLE_PRESETS[nextRole] ?? '')
  }

  const fetchMakerScore = async () => {
    await withUiState(async () => {
      const payload = await apiRequest(`/furniture_makers/${makerBinIin}/score`, { token })
      setScoreCard(payload)
    })
  }

  const createOrder = async () => {
    await withUiState(async () => {
      const payload = await apiRequest('/orders', {
        method: 'POST',
        token,
        body: {
          order: {
            furniture_maker_id: Number(makerId),
            title: orderTitle,
            status: 'draft',
          },
        },
      })
      setOrderId(payload.data.id)
      setOrderStatus(payload.data.status)
    })
  }

  const moveOrderForward = async () => {
    if (!orderId || !nextStatus) return

    await withUiState(async () => {
      const payload = await apiRequest(`/orders/${orderId}/transition`, {
        method: 'PATCH',
        token,
        body: { to_status: nextStatus },
      })
      setOrderStatus(payload.data.status)
    })
  }

  const finalizeAcceptanceAndReview = async () => {
    if (!orderId) return

    await withUiState(async () => {
      await apiRequest(`/orders/${orderId}/acceptance_act`, {
        method: 'POST',
        token,
        body: { acceptance_act: { accepted_at: new Date().toISOString(), notes: 'Принято' } },
      })
      await apiRequest(`/orders/${orderId}/review`, {
        method: 'POST',
        token,
        body: { review: { rating: 5, comment: 'Отличный результат' } },
      })
      setOrderStatus('completed')
    })
  }

  return (
    <main className="container">
      <h1>capybara.kz MVP</h1>

      <section className="card">
        <h2>Авторизация API</h2>
        <div className="row">
          <label htmlFor="role-select">Роль</label>
          <select id="role-select" value={role} onChange={(event) => applyRolePreset(event.target.value)}>
            <option value="admin">admin</option>
            <option value="production_staff">production_staff</option>
            <option value="customer">customer</option>
            <option value="furniture_maker">furniture_maker</option>
          </select>
        </div>
        <input value={token} onChange={(event) => setToken(event.target.value)} placeholder="Bearer token" />
        <p className="hint">
          Demo token: <code>{ROLE_PRESETS[role]}</code>
        </p>
      </section>

      <section className="card">
        <h2>Карточка мебельщика</h2>
        <div className="row">
          <input value={makerBinIin} onChange={(event) => setMakerBinIin(event.target.value)} placeholder="BIN/IIN" />
          <button onClick={fetchMakerScore} disabled={loading}>Получить score</button>
        </div>
        {scoreCard && (
          <div className="result">
            <p><strong>BIN/IIN:</strong> {scoreCard.bin_iin}</p>
            <p><strong>Score:</strong> {scoreCard.score} ({scoreCard.score_band})</p>
            <p><strong>Недостаточно данных:</strong> {String(scoreCard.insufficient_data)}</p>
          </div>
        )}
      </section>

      <section className="card">
        <h2>Карточка заказа и этапы</h2>
        <div className="row">
          <input value={makerId} onChange={(event) => setMakerId(event.target.value)} placeholder="ID мебельщика" />
          <input value={orderTitle} onChange={(event) => setOrderTitle(event.target.value)} placeholder="Название заказа" />
          <button onClick={createOrder} disabled={loading}>Создать заказ</button>
        </div>
        <p><strong>Order ID:</strong> {orderId ?? '—'}</p>
        <p><strong>Текущий статус:</strong> {orderStatus}</p>
        <div className="row">
          <button onClick={moveOrderForward} disabled={!orderId || !nextStatus || loading}>Следующий этап</button>
          <button onClick={finalizeAcceptanceAndReview} disabled={!orderId || loading}>Приемка и отзыв</button>
        </div>
        <p className="flow">{ORDER_FLOW.join(' -> ')}</p>
      </section>

      {apiError && (
        <section className="error">
          <p><strong>Ошибка API:</strong> {apiError.message}</p>
          <p><strong>Код:</strong> {apiError.code}</p>
          {apiError.status && <p><strong>HTTP:</strong> {apiError.status}</p>}
          {Object.keys(apiError.details).length > 0 && (
            <p><strong>Детали:</strong> {JSON.stringify(apiError.details)}</p>
          )}
        </section>
      )}
    </main>
  )
}

export default App
