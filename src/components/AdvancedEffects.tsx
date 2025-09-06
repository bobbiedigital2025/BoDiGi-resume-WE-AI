import React, { useState, useRef, useEffect } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Palette, 
  Sliders, 
  Eye, 
  Zap, 
  Layers, 
  Sparkles,
  Sun,
  Moon,
  Droplets,
  Wind,
  Star,
  Circle,
  Square,
  Triangle,
  Hexagon,
  Heart,
  Diamond,
  Settings,
  Play,
  Pause,
  RotateCcw,
  Move,
  ZoomIn,
  ZoomOut,
  Contrast,
  Aperture,
  Filter,
  Brush,
  Paintbrush,
  Eraser,
  Pipette
} from 'lucide-react';

interface EffectParameter {
  name: string;
  type: 'number' | 'range' | 'color' | 'boolean' | 'select' | 'vector2' | 'vector3';
  value: any;
  min?: number;
  max?: number;
  step?: number;
  options?: string[];
  description?: string;
}

interface VisualEffect {
  id: string;
  name: string;
  category: string;
  parameters: EffectParameter[];
  enabled: boolean;
  keyframes?: { time: number; values: any }[];
}

interface ColorGradingSettings {
  brightness: number;
  contrast: number;
  saturation: number;
  temperature: number;
  tint: number;
  highlights: number;
  shadows: number;
  whites: number;
  blacks: number;
  clarity: number;
  vibrance: number;
  hue: number;
}

interface AdvancedEffectsProps {
  clipId?: string;
  onEffectChange?: (effects: VisualEffect[]) => void;
  onPreviewFrame?: (frameData: ImageData) => void;
}

export default function AdvancedEffects({ clipId, onEffectChange, onPreviewFrame }: AdvancedEffectsProps) {
  const [effects, setEffects] = useState<VisualEffect[]>([]);
  const [selectedEffect, setSelectedEffect] = useState<string | null>(null);
  const [previewEnabled, setPreviewEnabled] = useState(true);
  const [activeTab, setActiveTab] = useState('color');
  
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [colorGrading, setColorGrading] = useState<ColorGradingSettings>({
    brightness: 0,
    contrast: 0,
    saturation: 0,
    temperature: 0,
    tint: 0,
    highlights: 0,
    shadows: 0,
    whites: 0,
    blacks: 0,
    clarity: 0,
    vibrance: 0,
    hue: 0
  });

  // Built-in effect presets
  const effectPresets = {
    color: [
      {
        id: 'brightness-contrast',
        name: 'Brightness/Contrast',
        icon: Sun,
        parameters: [
          { name: 'brightness', type: 'range', value: 0, min: -100, max: 100 },
          { name: 'contrast', type: 'range', value: 0, min: -100, max: 100 }
        ]
      },
      {
        id: 'hue-saturation',
        name: 'Hue/Saturation',
        icon: Palette,
        parameters: [
          { name: 'hue', type: 'range', value: 0, min: -180, max: 180 },
          { name: 'saturation', type: 'range', value: 0, min: -100, max: 100 },
          { name: 'lightness', type: 'range', value: 0, min: -100, max: 100 }
        ]
      },
      {
        id: 'color-balance',
        name: 'Color Balance',
        icon: Sliders,
        parameters: [
          { name: 'cyan-red', type: 'range', value: 0, min: -100, max: 100 },
          { name: 'magenta-green', type: 'range', value: 0, min: -100, max: 100 },
          { name: 'yellow-blue', type: 'range', value: 0, min: -100, max: 100 }
        ]
      },
      {
        id: 'curves',
        name: 'Curves',
        icon: Contrast,
        parameters: [
          { name: 'rgb-curve', type: 'curve', value: [[0, 0], [255, 255]] },
          { name: 'red-curve', type: 'curve', value: [[0, 0], [255, 255]] },
          { name: 'green-curve', type: 'curve', value: [[0, 0], [255, 255]] },
          { name: 'blue-curve', type: 'curve', value: [[0, 0], [255, 255]] }
        ]
      }
    ],
    stylize: [
      {
        id: 'vintage',
        name: 'Vintage Film',
        icon: Star,
        parameters: [
          { name: 'intensity', type: 'range', value: 50, min: 0, max: 100 },
          { name: 'grain', type: 'range', value: 30, min: 0, max: 100 },
          { name: 'vignette', type: 'range', value: 20, min: 0, max: 100 },
          { name: 'color-cast', type: 'color', value: '#ff9966' }
        ]
      },
      {
        id: 'glow',
        name: 'Glow',
        icon: Sparkles,
        parameters: [
          { name: 'intensity', type: 'range', value: 50, min: 0, max: 100 },
          { name: 'radius', type: 'range', value: 10, min: 1, max: 50 },
          { name: 'threshold', type: 'range', value: 75, min: 0, max: 100 },
          { name: 'color', type: 'color', value: '#ffffff' }
        ]
      },
      {
        id: 'film-grain',
        name: 'Film Grain',
        icon: Wind,
        parameters: [
          { name: 'amount', type: 'range', value: 25, min: 0, max: 100 },
          { name: 'size', type: 'range', value: 1, min: 0.1, max: 5, step: 0.1 },
          { name: 'roughness', type: 'range', value: 50, min: 0, max: 100 }
        ]
      },
      {
        id: 'chromatic-aberration',
        name: 'Chromatic Aberration',
        icon: Aperture,
        parameters: [
          { name: 'strength', type: 'range', value: 5, min: 0, max: 20 },
          { name: 'direction', type: 'range', value: 0, min: 0, max: 360 }
        ]
      }
    ],
    blur: [
      {
        id: 'gaussian-blur',
        name: 'Gaussian Blur',
        icon: Droplets,
        parameters: [
          { name: 'radius', type: 'range', value: 5, min: 0, max: 50 },
          { name: 'quality', type: 'select', value: 'medium', options: ['low', 'medium', 'high'] }
        ]
      },
      {
        id: 'motion-blur',
        name: 'Motion Blur',
        icon: Move,
        parameters: [
          { name: 'angle', type: 'range', value: 0, min: 0, max: 360 },
          { name: 'distance', type: 'range', value: 10, min: 0, max: 100 }
        ]
      },
      {
        id: 'radial-blur',
        name: 'Radial Blur',
        icon: Circle,
        parameters: [
          { name: 'strength', type: 'range', value: 10, min: 0, max: 100 },
          { name: 'center-x', type: 'range', value: 50, min: 0, max: 100 },
          { name: 'center-y', type: 'range', value: 50, min: 0, max: 100 }
        ]
      }
    ],
    distort: [
      {
        id: 'lens-distortion',
        name: 'Lens Distortion',
        icon: Eye,
        parameters: [
          { name: 'barrel', type: 'range', value: 0, min: -100, max: 100 },
          { name: 'pincushion', type: 'range', value: 0, min: -100, max: 100 }
        ]
      },
      {
        id: 'perspective',
        name: 'Perspective',
        icon: Square,
        parameters: [
          { name: 'top-left-x', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'top-left-y', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'top-right-x', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'top-right-y', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'bottom-left-x', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'bottom-left-y', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'bottom-right-x', type: 'range', value: 0, min: -50, max: 50 },
          { name: 'bottom-right-y', type: 'range', value: 0, min: -50, max: 50 }
        ]
      },
      {
        id: 'wave-distortion',
        name: 'Wave Distortion',
        icon: Wind,
        parameters: [
          { name: 'amplitude', type: 'range', value: 10, min: 0, max: 100 },
          { name: 'frequency', type: 'range', value: 5, min: 0.1, max: 20, step: 0.1 },
          { name: 'direction', type: 'select', value: 'horizontal', options: ['horizontal', 'vertical', 'both'] }
        ]
      }
    ]
  };

  // Color grading presets
  const colorGradingPresets = {
    'Cinematic': {
      brightness: 5,
      contrast: 15,
      saturation: -10,
      temperature: -200,
      tint: 50,
      highlights: -25,
      shadows: 25,
      clarity: 20,
      vibrance: 15
    },
    'Warm Sunset': {
      brightness: 10,
      contrast: 20,
      saturation: 25,
      temperature: 500,
      tint: 100,
      highlights: -10,
      shadows: 15,
      vibrance: 30
    },
    'Cool Blue': {
      brightness: -5,
      contrast: 25,
      saturation: 10,
      temperature: -400,
      tint: -50,
      highlights: -15,
      shadows: 10,
      clarity: 15
    },
    'High Contrast': {
      brightness: 0,
      contrast: 40,
      saturation: 20,
      highlights: -40,
      shadows: 40,
      whites: 20,
      blacks: -20,
      clarity: 30
    },
    'Vintage': {
      brightness: 10,
      contrast: -10,
      saturation: -20,
      temperature: 200,
      tint: 150,
      highlights: -20,
      shadows: 20,
      clarity: -15
    }
  };

  const addEffect = (effectId: string, category: string) => {
    const effectTemplate = effectPresets[category]?.find(e => e.id === effectId);
    if (!effectTemplate) return;

    const newEffect: VisualEffect = {
      id: `${effectId}-${Date.now()}`,
      name: effectTemplate.name,
      category,
      parameters: effectTemplate.parameters.map(p => ({ ...p })),
      enabled: true
    };

    setEffects(prev => [...prev, newEffect]);
    setSelectedEffect(newEffect.id);
    onEffectChange?.([...effects, newEffect]);
  };

  const removeEffect = (effectId: string) => {
    const updatedEffects = effects.filter(e => e.id !== effectId);
    setEffects(updatedEffects);
    setSelectedEffect(null);
    onEffectChange?.(updatedEffects);
  };

  const updateEffectParameter = (effectId: string, paramName: string, value: any) => {
    const updatedEffects = effects.map(effect => {
      if (effect.id === effectId) {
        return {
          ...effect,
          parameters: effect.parameters.map(param =>
            param.name === paramName ? { ...param, value } : param
          )
        };
      }
      return effect;
    });
    
    setEffects(updatedEffects);
    onEffectChange?.(updatedEffects);
  };

  const toggleEffect = (effectId: string) => {
    const updatedEffects = effects.map(effect =>
      effect.id === effectId ? { ...effect, enabled: !effect.enabled } : effect
    );
    
    setEffects(updatedEffects);
    onEffectChange?.(updatedEffects);
  };

  const applyColorGradingPreset = (presetName: string) => {
    const preset = colorGradingPresets[presetName];
    if (preset) {
      setColorGrading(prev => ({ ...prev, ...preset }));
    }
  };

  const updateColorGrading = (property: keyof ColorGradingSettings, value: number) => {
    setColorGrading(prev => ({ ...prev, [property]: value }));
  };

  const renderParameterControl = (effect: VisualEffect, parameter: EffectParameter) => {
    switch (parameter.type) {
      case 'range':
        return (
          <div key={parameter.name} className="space-y-2">
            <div className="flex justify-between">
              <Label className="text-sm">{parameter.name}</Label>
              <span className="text-xs text-gray-400">{parameter.value}</span>
            </div>
            <Slider
              value={[parameter.value]}
              min={parameter.min}
              max={parameter.max}
              step={parameter.step || 1}
              onValueChange={([value]) => updateEffectParameter(effect.id, parameter.name, value)}
              className="my-2"
            />
          </div>
        );

      case 'color':
        return (
          <div key={parameter.name} className="space-y-2">
            <Label className="text-sm">{parameter.name}</Label>
            <div className="flex gap-2">
              <Input
                type="color"
                value={parameter.value}
                onChange={(e) => updateEffectParameter(effect.id, parameter.name, e.target.value)}
                className="w-12 h-8 p-1"
              />
              <Input
                type="text"
                value={parameter.value}
                onChange={(e) => updateEffectParameter(effect.id, parameter.name, e.target.value)}
                className="flex-1"
              />
            </div>
          </div>
        );

      case 'boolean':
        return (
          <div key={parameter.name} className="flex items-center justify-between">
            <Label className="text-sm">{parameter.name}</Label>
            <input
              type="checkbox"
              checked={parameter.value}
              onChange={(e) => updateEffectParameter(effect.id, parameter.name, e.target.checked)}
              className="w-4 h-4"
            />
          </div>
        );

      case 'select':
        return (
          <div key={parameter.name} className="space-y-2">
            <Label className="text-sm">{parameter.name}</Label>
            <select
              value={parameter.value}
              onChange={(e) => updateEffectParameter(effect.id, parameter.name, e.target.value)}
              className="w-full p-2 border rounded bg-gray-700 border-gray-600 text-white"
            >
              {parameter.options?.map(option => (
                <option key={option} value={option}>{option}</option>
              ))}
            </select>
          </div>
        );

      default:
        return (
          <div key={parameter.name} className="space-y-2">
            <Label className="text-sm">{parameter.name}</Label>
            <Input
              type="number"
              value={parameter.value}
              onChange={(e) => updateEffectParameter(effect.id, parameter.name, parseFloat(e.target.value) || 0)}
              className="bg-gray-700 border-gray-600 text-white"
            />
          </div>
        );
    }
  };

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      <div className="p-4 border-b border-gray-700">
        <h2 className="text-lg font-semibold mb-2">Advanced Effects</h2>
        <div className="flex items-center gap-2">
          <Button size="sm" variant="ghost" className="text-white">
            <Eye className="h-4 w-4 mr-1" />
            Preview
          </Button>
          <Button size="sm" variant="ghost" className="text-white">
            <Settings className="h-4 w-4 mr-1" />
            Settings
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <TabsList className="grid grid-cols-5 bg-gray-800 mx-4 mt-2">
          <TabsTrigger value="color" className="text-white">Color</TabsTrigger>
          <TabsTrigger value="stylize" className="text-white">Stylize</TabsTrigger>
          <TabsTrigger value="blur" className="text-white">Blur</TabsTrigger>
          <TabsTrigger value="distort" className="text-white">Distort</TabsTrigger>
          <TabsTrigger value="grading" className="text-white">Grading</TabsTrigger>
        </TabsList>

        <div className="flex-1 overflow-hidden">
          {/* Color Effects */}
          <TabsContent value="color" className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {effectPresets.color.map(effect => (
                <Button
                  key={effect.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => addEffect(effect.id, 'color')}
                >
                  <effect.icon className="h-6 w-6" />
                  <span className="text-xs">{effect.name}</span>
                </Button>
              ))}
            </div>

            {/* Applied Effects */}
            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Applied Effects</h3>
              {effects.filter(e => e.category === 'color').map(effect => (
                <Card key={effect.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{effect.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEffect(effect.id)}
                          className={effect.enabled ? 'text-green-400' : 'text-gray-500'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEffect(effect.id)}
                          className="text-red-400"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-3">
                    {effect.parameters.map(param => renderParameterControl(effect, param))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Stylize Effects */}
          <TabsContent value="stylize" className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {effectPresets.stylize.map(effect => (
                <Button
                  key={effect.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => addEffect(effect.id, 'stylize')}
                >
                  <effect.icon className="h-6 w-6" />
                  <span className="text-xs">{effect.name}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Applied Effects</h3>
              {effects.filter(e => e.category === 'stylize').map(effect => (
                <Card key={effect.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{effect.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEffect(effect.id)}
                          className={effect.enabled ? 'text-green-400' : 'text-gray-500'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEffect(effect.id)}
                          className="text-red-400"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-3">
                    {effect.parameters.map(param => renderParameterControl(effect, param))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Blur Effects */}
          <TabsContent value="blur" className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {effectPresets.blur.map(effect => (
                <Button
                  key={effect.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => addEffect(effect.id, 'blur')}
                >
                  <effect.icon className="h-6 w-6" />
                  <span className="text-xs">{effect.name}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Applied Effects</h3>
              {effects.filter(e => e.category === 'blur').map(effect => (
                <Card key={effect.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{effect.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEffect(effect.id)}
                          className={effect.enabled ? 'text-green-400' : 'text-gray-500'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEffect(effect.id)}
                          className="text-red-400"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-3">
                    {effect.parameters.map(param => renderParameterControl(effect, param))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Distort Effects */}
          <TabsContent value="distort" className="h-full overflow-y-auto p-4">
            <div className="grid grid-cols-2 gap-3 mb-6">
              {effectPresets.distort.map(effect => (
                <Button
                  key={effect.id}
                  variant="outline"
                  className="h-auto p-3 flex flex-col items-center gap-2 text-white border-gray-600 hover:bg-gray-700"
                  onClick={() => addEffect(effect.id, 'distort')}
                >
                  <effect.icon className="h-6 w-6" />
                  <span className="text-xs">{effect.name}</span>
                </Button>
              ))}
            </div>

            <div className="space-y-4">
              <h3 className="text-sm font-semibold">Applied Effects</h3>
              {effects.filter(e => e.category === 'distort').map(effect => (
                <Card key={effect.id} className="bg-gray-800 border-gray-700">
                  <CardHeader className="p-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-sm">{effect.name}</CardTitle>
                      <div className="flex gap-1">
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => toggleEffect(effect.id)}
                          className={effect.enabled ? 'text-green-400' : 'text-gray-500'}
                        >
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeEffect(effect.id)}
                          className="text-red-400"
                        >
                          ×
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="p-3 pt-0 space-y-3">
                    {effect.parameters.map(param => renderParameterControl(effect, param))}
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          {/* Color Grading */}
          <TabsContent value="grading" className="h-full overflow-y-auto p-4">
            <div className="space-y-6">
              {/* Presets */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Presets</h3>
                <div className="grid grid-cols-2 gap-2">
                  {Object.keys(colorGradingPresets).map(presetName => (
                    <Button
                      key={presetName}
                      size="sm"
                      variant="outline"
                      className="text-white border-gray-600 hover:bg-gray-700"
                      onClick={() => applyColorGradingPreset(presetName)}
                    >
                      {presetName}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Basic Adjustments */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Basic</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Brightness</Label>
                      <span className="text-xs text-gray-400">{colorGrading.brightness}</span>
                    </div>
                    <Slider
                      value={[colorGrading.brightness]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('brightness', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Contrast</Label>
                      <span className="text-xs text-gray-400">{colorGrading.contrast}</span>
                    </div>
                    <Slider
                      value={[colorGrading.contrast]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('contrast', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Saturation</Label>
                      <span className="text-xs text-gray-400">{colorGrading.saturation}</span>
                    </div>
                    <Slider
                      value={[colorGrading.saturation]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('saturation', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Vibrance</Label>
                      <span className="text-xs text-gray-400">{colorGrading.vibrance}</span>
                    </div>
                    <Slider
                      value={[colorGrading.vibrance]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('vibrance', value)}
                    />
                  </div>
                </div>
              </div>

              {/* Color Temperature */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Temperature & Tint</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Temperature</Label>
                      <span className="text-xs text-gray-400">{colorGrading.temperature}</span>
                    </div>
                    <Slider
                      value={[colorGrading.temperature]}
                      min={-1000}
                      max={1000}
                      step={10}
                      onValueChange={([value]) => updateColorGrading('temperature', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Tint</Label>
                      <span className="text-xs text-gray-400">{colorGrading.tint}</span>
                    </div>
                    <Slider
                      value={[colorGrading.tint]}
                      min={-200}
                      max={200}
                      step={5}
                      onValueChange={([value]) => updateColorGrading('tint', value)}
                    />
                  </div>
                </div>
              </div>

              {/* Tone Curve */}
              <div>
                <h3 className="text-sm font-semibold mb-3">Tone</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Highlights</Label>
                      <span className="text-xs text-gray-400">{colorGrading.highlights}</span>
                    </div>
                    <Slider
                      value={[colorGrading.highlights]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('highlights', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Shadows</Label>
                      <span className="text-xs text-gray-400">{colorGrading.shadows}</span>
                    </div>
                    <Slider
                      value={[colorGrading.shadows]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('shadows', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Whites</Label>
                      <span className="text-xs text-gray-400">{colorGrading.whites}</span>
                    </div>
                    <Slider
                      value={[colorGrading.whites]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('whites', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Blacks</Label>
                      <span className="text-xs text-gray-400">{colorGrading.blacks}</span>
                    </div>
                    <Slider
                      value={[colorGrading.blacks]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('blacks', value)}
                    />
                  </div>

                  <div>
                    <div className="flex justify-between mb-1">
                      <Label className="text-sm">Clarity</Label>
                      <span className="text-xs text-gray-400">{colorGrading.clarity}</span>
                    </div>
                    <Slider
                      value={[colorGrading.clarity]}
                      min={-100}
                      max={100}
                      step={1}
                      onValueChange={([value]) => updateColorGrading('clarity', value)}
                    />
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </div>
      </Tabs>

      {/* Preview Canvas (Hidden) */}
      <canvas
        ref={canvasRef}
        className="hidden"
        width="1920"
        height="1080"
      />
    </div>
  );
}
