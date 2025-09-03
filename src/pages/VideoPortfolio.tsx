
import React from 'react';

type VideoItem = { title: string; embedUrl: string; description?: string };

export default function VideoPortfolio() {
  const [items, setItems] = React.useState<VideoItem[]>([]);
  React.useEffect(() => {
    fetch('/portfolio.json').then(r => r.json()).then(setItems).catch(() => setItems([]));
  }, []);
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-pink-100 py-12 px-4 font-sans">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-4xl font-extrabold text-center text-blue-700 mb-2 drop-shadow-lg sparkle">Video Portfolio</h1>
        <p className="text-center text-lg text-gray-600 mb-8">Showcase of BoDiGi™ projects, app demos, and case studies.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {items.map((v, i) => (
            <div key={i} className="bg-white rounded-2xl shadow-lg border border-blue-100 overflow-hidden transition-transform hover:scale-105 hover:shadow-2xl sparkle">
              <div className="relative pt-[56.25%] bg-gradient-to-tr from-blue-100 to-pink-100">
                <iframe
                  src={v.embedUrl}
                  title={v.title}
                  className="absolute top-0 left-0 w-full h-full rounded-t-2xl"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
              <div className="p-4">
                <h3 className="text-xl font-bold text-blue-600 mb-1">{v.title}</h3>
                {v.description && <p className="text-gray-500 text-sm">{v.description}</p>}
              </div>
            </div>
          ))}
        </div>
      </div>
      <style>{`
        .sparkle {
          box-shadow: 0 0 12px 2px #e0e7ff, 0 0 24px 4px #fbc2eb;
        }
      `}</style>
    </div>
  );
}
