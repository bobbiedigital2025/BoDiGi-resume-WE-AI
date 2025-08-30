
import React from 'react'

export default function OddsCalculator() {
  const [decimalOdds, setDecimalOdds] = React.useState('2.5')
  const [probA, setProbA] = React.useState('0.4')
  const [probB, setProbB] = React.useState('0.3')

  const impliedProb = (() => {
    const d = parseFloat(decimalOdds)
    if (!isFinite(d) || d <= 0) return 0
    return 1 / d
  })()

  const combinedProb = (() => {
    const a = parseFloat(probA)
    const b = parseFloat(probB)
    if (![a,b].every(n => isFinite(n) && n >= 0 && n <= 1)) return 0
    return a * b
  })()

  const toPct = (x: number) => (isFinite(x) ? (x * 100).toFixed(2) + '%' : '—')

  return (
    <div style={{ padding: 24, border: '1px solid #ddd', borderRadius: 12, marginTop: 16 }}>
      <h2>Odds & Probability Calculator</h2>
      <div style={{ display: 'grid', gap: 12, maxWidth: 420 }}>
        <label>
          Decimal Odds
          <input value={decimalOdds} onChange={e => setDecimalOdds(e.target.value)} placeholder="e.g. 2.5"
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}/>
        </label>
        <div><strong>Implied Probability:</strong> {toPct(impliedProb)}</div>
        <hr />
        <label>
          Probability A (0–1)
          <input value={probA} onChange={e => setProbA(e.target.value)} placeholder="e.g. 0.4"
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}/>
        </label>
        <label>
          Probability B (0–1)
          <input value={probB} onChange={e => setProbB(e.target.value)} placeholder="e.g. 0.3"
            style={{ width: '100%', padding: 8, borderRadius: 8, border: '1px solid #ccc' }}/>
        </label>
        <div><strong>Combined Probability (A and B):</strong> {toPct(combinedProb)}</div>
      </div>
    </div>
  )
}
