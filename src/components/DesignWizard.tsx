import React, { useState } from 'react';

const themes = [
  { name: 'Minimalist', colors: ['#fff', '#222'], sparkle: false, animation: false },
  { name: 'Sparkle', colors: ['#f0e', '#ffd700'], sparkle: true, animation: true },
  { name: 'Foil', colors: ['#b8b8b8', '#e5e4e2'], sparkle: true, animation: false },
  { name: 'Shine', colors: ['#00f0ff', '#fff700'], sparkle: true, animation: true },
  { name: 'Advanced Tech', colors: ['#0ff', '#222'], sparkle: true, animation: true, characters: true },
];

export default function DesignWizard({ onComplete }: { onComplete?: (theme: any) => void }) {
  const [step, setStep] = useState(0);
  const [selectedTheme, setSelectedTheme] = useState<any>(null);

  const handleThemeSelect = (theme: any) => {
    setSelectedTheme(theme);
    setStep(step + 1);
  };

  const handleFinish = () => {
    if (onComplete) onComplete(selectedTheme);
    setStep(0);
    setSelectedTheme(null);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-60">
      <div className="bg-white rounded-lg shadow-xl p-8 w-full max-w-md animate-fade-in">
        {step === 0 && (
          <>
            <h2 className="text-2xl font-bold mb-4">Choose Your Design Theme</h2>
            <ul className="space-y-3">
              {themes.map((theme) => (
                <li key={theme.name}>
                  <button
                    className="w-full py-2 px-4 rounded-lg border border-gray-300 hover:bg-gray-100 transition"
                    style={{ background: theme.sparkle ? 'linear-gradient(90deg, #fff, ' + theme.colors[0] + ')' : theme.colors[0], color: theme.colors[1] }}
                    onClick={() => handleThemeSelect(theme)}
                  >
                    {theme.name}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}
        {step === 1 && selectedTheme && (
          <>
            <h2 className="text-xl font-semibold mb-2">Preview: {selectedTheme.name}</h2>
            <div className="mb-4 h-32 flex items-center justify-center rounded-lg" style={{ background: selectedTheme.sparkle ? 'repeating-linear-gradient(45deg, #fff, ' + selectedTheme.colors[0] + ' 10px, #ffd700 20px)' : selectedTheme.colors[0] }}>
              {selectedTheme.animation && <span className="animate-bounce text-3xl">✨</span>}
              {selectedTheme.characters && <span className="ml-2 text-2xl">🤖</span>}
            </div>
            <button
              className="w-full py-2 px-4 rounded-lg bg-blue-600 text-white font-bold hover:bg-blue-700 transition"
              onClick={handleFinish}
            >
              Apply Theme & Finish
            </button>
          </>
        )}
      </div>
    </div>
  );
}
