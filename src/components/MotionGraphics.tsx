import React, { useState, useRef, useEffect, useCallback } from 'react';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Label } from '../components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../components/ui/card';
import { Slider } from '../components/ui/slider';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Badge } from '../components/ui/badge';
import { 
  Play,
  Pause,
  SkipBack,
  SkipForward,
  RotateCw,
  RotateCcw,
  Move,
  Scale,
  RotateCwSquare,
  Eye,
  EyeOff,
  Lock,
  Unlock,
  Plus,
  Minus,
  Copy,
  Trash2,
  Settings,
  Layers,
  MousePointer,
  Square,
  Circle,
  Triangle,
  Star,
  Type,
  Image,
  Zap,
  Sparkles,
  Wind,
  Sun,
  Moon,
  Heart,
  Diamond,
  Hexagon,
  Bezier,
  TrendingUp,
  TrendingDown,
  BarChart3,
  PieChart,
  Activity,
  Target,
  Navigation,
  Compass
} from 'lucide-react';

interface KeyframeValue {
  time: number;
  value: any;
  easing: 'linear' | 'ease-in' | 'ease-out' | 'ease-in-out' | 'bezier';
  bezierPoints?: [number, number, number, number];
}

interface AnimationProperty {
  name: string;
  type: 'number' | 'vector2' | 'vector3' | 'color' | 'boolean' | 'text' | 'path';
  keyframes: KeyframeValue[];
  defaultValue: any;
  min?: number;
  max?: number;
  unit?: string;
}

interface MotionGraphicsElement {
  id: string;
  name: string;
  type: 'text' | 'shape' | 'image' | 'video' | 'particle' | 'path' | 'group';
  visible: boolean;
  locked: boolean;
  selected: boolean;
  parentId?: string;
  layer: number;
  startTime: number;
  duration: number;
  properties: {
    transform: {
      position: AnimationProperty;
      rotation: AnimationProperty;
      scale: AnimationProperty;
      anchor: AnimationProperty;
      opacity: AnimationProperty;
    };
    style?: {
      fill?: AnimationProperty;
      stroke?: AnimationProperty;
      strokeWidth?: AnimationProperty;
    };
    text?: {
      content: AnimationProperty;
      fontSize: AnimationProperty;
      fontFamily: AnimationProperty;
      fontWeight: AnimationProperty;
      color: AnimationProperty;
      letterSpacing: AnimationProperty;
      lineHeight: AnimationProperty;
    };
    effects?: AnimationProperty[];
  };
}

interface MotionPath {
  id: string;
  name: string;
  points: { x: number; y: number; handleIn?: { x: number; y: number }; handleOut?: { x: number; y: number } }[];
  closed: boolean;
  visible: boolean;
}

interface MotionGraphicsProps {
  elements?: MotionGraphicsElement[];
  currentTime?: number;
  duration?: number;
  fps?: number;
  resolution?: { width: number; height: number };
  onElementChange?: (element: MotionGraphicsElement) => void;
  onTimeChange?: (time: number) => void;
}

export default function MotionGraphics({
  elements = [],
  currentTime = 0,
  duration = 300,
  fps = 30,
  resolution = { width: 1920, height: 1080 },
  onElementChange,
  onTimeChange
}: MotionGraphicsProps) {
  const [selectedElement, setSelectedElement] = useState<string | null>(null);
  const [selectedProperty, setSelectedProperty] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState('timeline');
  const [tool, setTool] = useState<'select' | 'move' | 'rotate' | 'scale' | 'bezier' | 'type' | 'shape'>('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [viewOffset, setViewOffset] = useState({ x: 0, y: 0 });
  const [motionPaths, setMotionPaths] = useState<MotionPath[]>([]);
  const [gridVisible, setGridVisible] = useState(true);
  const [snapToGrid, setSnapToGrid] = useState(true);

  const canvasRef = useRef<HTMLCanvasElement>(null);
  const timelineRef = useRef<HTMLDivElement>(null);

  // Animation presets and templates
  const animationPresets = {
    entrance: [
      {
        name: 'Fade In',
        properties: {
          opacity: [
            { time: 0, value: 0, easing: 'ease-out' },
            { time: 1, value: 1, easing: 'ease-out' }
          ]
        }
      },
      {
        name: 'Scale In',
        properties: {
          scale: [
            { time: 0, value: [0, 0], easing: 'ease-out' },
            { time: 1, value: [1, 1], easing: 'ease-out' }
          ],
          opacity: [
            { time: 0, value: 0, easing: 'ease-out' },
            { time: 0.5, value: 1, easing: 'ease-out' }
          ]
        }
      },
      {
        name: 'Slide In Left',
        properties: {
          position: [
            { time: 0, value: [-200, 0], easing: 'ease-out' },
            { time: 1.5, value: [0, 0], easing: 'ease-out' }
          ]
        }
      },
      {
        name: 'Bounce In',
        properties: {
          scale: [
            { time: 0, value: [0, 0], easing: 'ease-out' },
            { time: 0.5, value: [1.2, 1.2], easing: 'ease-out' },
            { time: 1, value: [1, 1], easing: 'ease-out' }
          ]
        }
      }
    ],
    exit: [
      {
        name: 'Fade Out',
        properties: {
          opacity: [
            { time: 0, value: 1, easing: 'ease-in' },
            { time: 1, value: 0, easing: 'ease-in' }
          ]
        }
      },
      {
        name: 'Scale Out',
        properties: {
          scale: [
            { time: 0, value: [1, 1], easing: 'ease-in' },
            { time: 1, value: [0, 0], easing: 'ease-in' }
          ]
        }
      },
      {
        name: 'Slide Out Right',
        properties: {
          position: [
            { time: 0, value: [0, 0], easing: 'ease-in' },
            { time: 1.5, value: [200, 0], easing: 'ease-in' }
          ]
        }
      }
    ],
    motion: [
      {
        name: 'Rotate 360',
        properties: {
          rotation: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 2, value: 360, easing: 'linear' }
          ]
        }
      },
      {
        name: 'Pulse',
        properties: {
          scale: [
            { time: 0, value: [1, 1], easing: 'ease-in-out' },
            { time: 0.5, value: [1.1, 1.1], easing: 'ease-in-out' },
            { time: 1, value: [1, 1], easing: 'ease-in-out' }
          ]
        }
      },
      {
        name: 'Wiggle',
        properties: {
          rotation: [
            { time: 0, value: 0, easing: 'ease-in-out' },
            { time: 0.25, value: -5, easing: 'ease-in-out' },
            { time: 0.5, value: 5, easing: 'ease-in-out' },
            { time: 0.75, value: -5, easing: 'ease-in-out' },
            { time: 1, value: 0, easing: 'ease-in-out' }
          ]
        }
      }
    ],
    text: [
      {
        name: 'Typewriter',
        properties: {
          opacity: [
            { time: 0, value: 0, easing: 'linear' },
            { time: 2, value: 1, easing: 'linear' }
          ]
        }
      },
      {
        name: 'Letter by Letter',
        properties: {
          opacity: [
            { time: 0, value: 0, easing: 'ease-out' },
            { time: 1, value: 1, easing: 'ease-out' }
          ]
        }
      }
    ]
  };

  // Shape templates
  const shapeTemplates = [
    { type: 'rectangle', name: 'Rectangle', icon: Square },
    { type: 'circle', name: 'Circle', icon: Circle },
    { type: 'triangle', name: 'Triangle', icon: Triangle },
    { type: 'star', name: 'Star', icon: Star },
    { type: 'polygon', name: 'Polygon', icon: Hexagon },
    { type: 'heart', name: 'Heart', icon: Heart },
    { type: 'diamond', name: 'Diamond', icon: Diamond }
  ];

  const createDefaultElement = (type: string): MotionGraphicsElement => ({
    id: `element-${Date.now()}`,
    name: `${type} ${Date.now()}`,
    type: type as any,
    visible: true,
    locked: false,
    selected: false,
    layer: elements.length,
    startTime: currentTime,
    duration: 10,
    properties: {
      transform: {
        position: {
          name: 'Position',
          type: 'vector2',
          keyframes: [{ time: 0, value: [resolution.width / 2, resolution.height / 2], easing: 'linear' }],
          defaultValue: [0, 0]
        },
        rotation: {
          name: 'Rotation',
          type: 'number',
          keyframes: [{ time: 0, value: 0, easing: 'linear' }],
          defaultValue: 0,
          unit: '°'
        },
        scale: {
          name: 'Scale',
          type: 'vector2',
          keyframes: [{ time: 0, value: [1, 1], easing: 'linear' }],
          defaultValue: [1, 1]
        },
        anchor: {
          name: 'Anchor Point',
          type: 'vector2',
          keyframes: [{ time: 0, value: [0.5, 0.5], easing: 'linear' }],
          defaultValue: [0.5, 0.5]
        },
        opacity: {
          name: 'Opacity',
          type: 'number',
          keyframes: [{ time: 0, value: 100, easing: 'linear' }],
          defaultValue: 100,
          min: 0,
          max: 100,
          unit: '%'
        }
      }
    }
  });

  const addKeyframe = (elementId: string, propertyPath: string, time: number, value: any) => {
    // Implementation for adding keyframes
    const element = elements.find(e => e.id === elementId);
    if (!element) return;

    // Navigate to the property and add keyframe
    const pathParts = propertyPath.split('.');
    let property = element.properties as any;
    
    for (const part of pathParts) {
      property = property[part];
    }

    if (property && property.keyframes) {
      const newKeyframe: KeyframeValue = {
        time,
        value,
        easing: 'ease-in-out'
      };

      property.keyframes.push(newKeyframe);
      property.keyframes.sort((a, b) => a.time - b.time);
      
      onElementChange?.(element);
    }
  };

  const removeKeyframe = (elementId: string, propertyPath: string, keyframeIndex: number) => {
    const element = elements.find(e => e.id === elementId);
    if (!element) return;

    const pathParts = propertyPath.split('.');
    let property = element.properties as any;
    
    for (const part of pathParts) {
      property = property[part];
    }

    if (property && property.keyframes) {
      property.keyframes.splice(keyframeIndex, 1);
      onElementChange?.(element);
    }
  };

  const applyPreset = (elementId: string, presetCategory: string, presetName: string) => {
    const preset = animationPresets[presetCategory]?.find(p => p.name === presetName);
    if (!preset) return;

    const element = elements.find(e => e.id === elementId);
    if (!element) return;

    // Apply preset keyframes to element properties
    Object.entries(preset.properties).forEach(([propName, keyframes]) => {
      const property = element.properties.transform[propName];
      if (property) {
        property.keyframes = keyframes.map(kf => ({
          time: element.startTime + kf.time,
          value: kf.value,
          easing: kf.easing
        }));
      }
    });

    onElementChange?.(element);
  };

  const interpolateValue = (property: AnimationProperty, time: number) => {
    if (property.keyframes.length === 0) return property.defaultValue;
    if (property.keyframes.length === 1) return property.keyframes[0].value;

    // Find surrounding keyframes
    let beforeIndex = -1;
    let afterIndex = -1;

    for (let i = 0; i < property.keyframes.length; i++) {
      if (property.keyframes[i].time <= time) {
        beforeIndex = i;
      }
      if (property.keyframes[i].time >= time && afterIndex === -1) {
        afterIndex = i;
      }
    }

    if (beforeIndex === -1) return property.keyframes[0].value;
    if (afterIndex === -1) return property.keyframes[property.keyframes.length - 1].value;
    if (beforeIndex === afterIndex) return property.keyframes[beforeIndex].value;

    const before = property.keyframes[beforeIndex];
    const after = property.keyframes[afterIndex];
    const progress = (time - before.time) / (after.time - before.time);

    // Apply easing
    let easedProgress = progress;
    switch (after.easing) {
      case 'ease-in':
        easedProgress = progress * progress;
        break;
      case 'ease-out':
        easedProgress = 1 - Math.pow(1 - progress, 2);
        break;
      case 'ease-in-out':
        easedProgress = progress < 0.5 
          ? 2 * progress * progress 
          : 1 - Math.pow(-2 * progress + 2, 2) / 2;
        break;
      case 'bezier':
        // Cubic bezier implementation would go here
        break;
    }

    // Interpolate based on type
    if (property.type === 'number') {
      return before.value + (after.value - before.value) * easedProgress;
    } else if (property.type === 'vector2') {
      return [
        before.value[0] + (after.value[0] - before.value[0]) * easedProgress,
        before.value[1] + (after.value[1] - before.value[1]) * easedProgress
      ];
    } else if (property.type === 'color') {
      // Color interpolation would go here
      return before.value;
    }

    return before.value;
  };

  const renderKeyframeEditor = () => {
    if (!selectedElement || !selectedProperty) {
      return (
        <div className="p-4 text-center text-gray-400">
          Select an element and property to edit keyframes
        </div>
      );
    }

    const element = elements.find(e => e.id === selectedElement);
    if (!element) return null;

    const property = element.properties.transform[selectedProperty];
    if (!property) return null;

    return (
      <div className="p-4 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-semibold">{property.name} Keyframes</h3>
          <Button
            size="sm"
            onClick={() => addKeyframe(selectedElement, `transform.${selectedProperty}`, currentTime, property.defaultValue)}
          >
            <Plus className="h-4 w-4 mr-1" />
            Add Keyframe
          </Button>
        </div>

        <div className="space-y-2">
          {property.keyframes.map((keyframe, index) => (
            <Card key={index} className="bg-gray-800 border-gray-700">
              <CardContent className="p-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="text-sm text-gray-400">
                      {keyframe.time.toFixed(2)}s
                    </span>
                    <span className="text-sm">
                      {typeof keyframe.value === 'number' 
                        ? keyframe.value.toFixed(2)
                        : Array.isArray(keyframe.value)
                        ? `[${keyframe.value.map(v => v.toFixed(2)).join(', ')}]`
                        : keyframe.value
                      }
                    </span>
                    <Badge variant="outline" className="text-xs">
                      {keyframe.easing}
                    </Badge>
                  </div>
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() => removeKeyframe(selectedElement, `transform.${selectedProperty}`, index)}
                    className="text-red-400"
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  };

  const renderAnimationPresets = () => (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">Animation Presets</h3>
      
      <Tabs defaultValue="entrance" className="w-full">
        <TabsList className="grid grid-cols-4 bg-gray-800">
          <TabsTrigger value="entrance">Entrance</TabsTrigger>
          <TabsTrigger value="exit">Exit</TabsTrigger>
          <TabsTrigger value="motion">Motion</TabsTrigger>
          <TabsTrigger value="text">Text</TabsTrigger>
        </TabsList>

        {Object.entries(animationPresets).map(([category, presets]) => (
          <TabsContent key={category} value={category} className="space-y-2">
            {presets.map(preset => (
              <Card key={preset.name} className="bg-gray-800 border-gray-700">
                <CardHeader className="p-3">
                  <div className="flex items-center justify-between">
                    <CardTitle className="text-sm">{preset.name}</CardTitle>
                    <Button
                      size="sm"
                      onClick={() => selectedElement && applyPreset(selectedElement, category, preset.name)}
                      disabled={!selectedElement}
                    >
                      Apply
                    </Button>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  );

  const renderShapeTools = () => (
    <div className="p-4 space-y-4">
      <h3 className="font-semibold">Shape Tools</h3>
      
      <div className="grid grid-cols-3 gap-2">
        {shapeTemplates.map(shape => (
          <Button
            key={shape.type}
            variant="outline"
            className="h-auto p-3 flex flex-col items-center gap-2 text-white border-gray-600 hover:bg-gray-700"
            onClick={() => {
              const newElement = createDefaultElement(shape.type);
              // Add shape-specific properties
              onElementChange?.(newElement);
            }}
          >
            <shape.icon className="h-6 w-6" />
            <span className="text-xs">{shape.name}</span>
          </Button>
        ))}
      </div>

      <div className="space-y-3">
        <h4 className="font-medium text-sm">Shape Properties</h4>
        {selectedElement && (
          <div className="space-y-2">
            <div>
              <Label className="text-xs">Fill Color</Label>
              <Input type="color" className="h-8" />
            </div>
            <div>
              <Label className="text-xs">Stroke Color</Label>
              <Input type="color" className="h-8" />
            </div>
            <div>
              <Label className="text-xs">Stroke Width</Label>
              <Slider defaultValue={[2]} min={0} max={20} step={1} />
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="h-full bg-gray-900 text-white flex flex-col">
      {/* Toolbar */}
      <div className="h-12 bg-gray-800 border-b border-gray-700 flex items-center justify-between px-4">
        <div className="flex items-center gap-2">
          <h2 className="text-lg font-semibold mr-4">Motion Graphics</h2>
          
          {/* Tools */}
          <div className="flex items-center gap-1 border-r border-gray-600 pr-4 mr-4">
            {[
              { id: 'select', icon: MousePointer, name: 'Select' },
              { id: 'move', icon: Move, name: 'Move' },
              { id: 'rotate', icon: RotateCw, name: 'Rotate' },
              { id: 'scale', icon: Scale, name: 'Scale' },
              { id: 'bezier', icon: Bezier, name: 'Bezier' },
              { id: 'type', icon: Type, name: 'Text' },
              { id: 'shape', icon: Square, name: 'Shape' }
            ].map(t => (
              <Button
                key={t.id}
                size="sm"
                variant={tool === t.id ? "default" : "ghost"}
                onClick={() => setTool(t.id as any)}
                className="text-white"
                title={t.name}
              >
                <t.icon className="h-4 w-4" />
              </Button>
            ))}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-1">
            <Button size="sm" variant="ghost" className="text-white">
              <SkipBack className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant="ghost"
              onClick={() => setIsPlaying(!isPlaying)}
              className="text-white"
            >
              {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
            </Button>
            <Button size="sm" variant="ghost" className="text-white">
              <SkipForward className="h-4 w-4" />
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-4">
          <span className="text-sm text-gray-400">
            {currentTime.toFixed(2)}s / {duration.toFixed(2)}s
          </span>
          <div className="flex items-center gap-1">
            <Button
              size="sm"
              variant={gridVisible ? "default" : "ghost"}
              onClick={() => setGridVisible(!gridVisible)}
              className="text-white"
            >
              <Square className="h-4 w-4" />
            </Button>
            <Button
              size="sm"
              variant={snapToGrid ? "default" : "ghost"}
              onClick={() => setSnapToGrid(!snapToGrid)}
              className="text-white"
            >
              <Target className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      <div className="flex-1 flex">
        {/* Main Canvas Area */}
        <div className="flex-1 bg-gray-950 relative overflow-hidden">
          <canvas
            ref={canvasRef}
            width={resolution.width}
            height={resolution.height}
            className="absolute inset-0 w-full h-full object-contain"
            style={{
              transform: `scale(${zoomLevel}) translate(${viewOffset.x}px, ${viewOffset.y}px)`
            }}
          />
          
          {/* Canvas Overlay UI */}
          <div className="absolute top-4 left-4 bg-black bg-opacity-50 rounded p-2 text-xs">
            <div>Resolution: {resolution.width}×{resolution.height}</div>
            <div>FPS: {fps}</div>
            <div>Zoom: {Math.round(zoomLevel * 100)}%</div>
          </div>
        </div>

        {/* Side Panel */}
        <div className="w-80 bg-gray-800 border-l border-gray-700 flex flex-col">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
            <TabsList className="grid grid-cols-4 bg-gray-900 m-2">
              <TabsTrigger value="timeline" className="text-white">Timeline</TabsTrigger>
              <TabsTrigger value="keyframes" className="text-white">Keyframes</TabsTrigger>
              <TabsTrigger value="presets" className="text-white">Presets</TabsTrigger>
              <TabsTrigger value="shapes" className="text-white">Shapes</TabsTrigger>
            </TabsList>

            <div className="flex-1 overflow-hidden">
              <TabsContent value="timeline" className="h-full overflow-y-auto">
                {/* Timeline content */}
                <div className="p-4">
                  <h3 className="font-semibold mb-3">Elements</h3>
                  <div className="space-y-2">
                    {elements.map(element => (
                      <Card
                        key={element.id}
                        className={`bg-gray-700 border-gray-600 cursor-pointer ${
                          element.selected ? 'ring-2 ring-blue-400' : ''
                        }`}
                        onClick={() => setSelectedElement(element.id)}
                      >
                        <CardContent className="p-3">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                              <Type className="h-4 w-4" />
                              <span className="text-sm">{element.name}</span>
                            </div>
                            <div className="flex gap-1">
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle visibility
                                }}
                                className={element.visible ? 'text-green-400' : 'text-gray-500'}
                              >
                                {element.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                              </Button>
                              <Button
                                size="sm"
                                variant="ghost"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  // Toggle lock
                                }}
                                className={element.locked ? 'text-red-400' : 'text-gray-500'}
                              >
                                {element.locked ? <Lock className="h-3 w-3" /> : <Unlock className="h-3 w-3" />}
                              </Button>
                            </div>
                          </div>
                          
                          {element.selected && (
                            <div className="mt-3 space-y-2">
                              <h4 className="text-xs font-medium">Transform Properties</h4>
                              {Object.entries(element.properties.transform).map(([propName, property]) => (
                                <Button
                                  key={propName}
                                  size="sm"
                                  variant="ghost"
                                  className={`w-full justify-start text-xs ${
                                    selectedProperty === propName ? 'bg-blue-600' : ''
                                  }`}
                                  onClick={() => setSelectedProperty(propName)}
                                >
                                  {property.name} ({property.keyframes.length})
                                </Button>
                              ))}
                            </div>
                          )}
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="keyframes" className="h-full overflow-y-auto">
                {renderKeyframeEditor()}
              </TabsContent>

              <TabsContent value="presets" className="h-full overflow-y-auto">
                {renderAnimationPresets()}
              </TabsContent>

              <TabsContent value="shapes" className="h-full overflow-y-auto">
                {renderShapeTools()}
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
