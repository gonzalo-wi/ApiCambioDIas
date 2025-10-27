const API_BASE = 'http://localhost:3001/api'

export class TokenService {
  /**
   * Llama a GET /api/token a través del proxy y retorna el JSON
   */
  static async getToken() {
    const url = `${API_BASE}/token`
    const resp = await fetch(url, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' }
    })
    if (!resp.ok) {
      const text = await resp.text()
      throw new Error(`HTTP ${resp.status}: ${text}`)
    }
    return resp.json()
  }
}
