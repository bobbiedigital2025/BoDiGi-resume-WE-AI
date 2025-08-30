
import React from 'react'

type VideoItem = { title: string; embedUrl: string; description?: string }

export default function VideoPortfolio() {
  const [items, setItems] = React.useState<VideoItem[]>([])
  React.useEffect(() => {
    fetch('/portfolio.json').then(r => r.json()).then(setItems).catch(() => setItems([]))
  }, [])
  return (
    <div style={{ padding: 24, fontFamily: 'sans-serif' }}>
      <h1>Video Portfolio</h1>
      <p>Showcase of BoDiGi™ projects, app demos, and case studies.</p>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
        {items.map((v, i) => (
          <div key={i} style={{ border: '1px solid #ddd', borderRadius: 12, overflow: 'hidden' }}>
            <div style={{ position: 'relative', paddingTop: '56.25%' }}>
              <iframe src={v.embedUrl} title={v.title}
                style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 0 }}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen/>
            </div>
            <div style={{ padding: 12 }}>
              <h3 style={{ margin: '8px 0' }}>{v.title}</h3>
              {v.description && <p style={{ color: '#555', margin: 0 }}>{v.description}</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
