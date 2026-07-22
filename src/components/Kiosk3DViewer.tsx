import React, { useEffect, useRef, useState } from 'react';
import { Box, Expand, LoaderCircle, RotateCcw, ZoomIn } from 'lucide-react';
import { Engine } from '@babylonjs/core/Engines/engine';
import { Scene } from '@babylonjs/core/scene';
import { ImageProcessingConfiguration } from '@babylonjs/core/Materials/imageProcessingConfiguration';
import { GlowLayer } from '@babylonjs/core/Layers/glowLayer';
import { ArcRotateCamera } from '@babylonjs/core/Cameras/arcRotateCamera';
import { HemisphericLight } from '@babylonjs/core/Lights/hemisphericLight';
import { DirectionalLight } from '@babylonjs/core/Lights/directionalLight';
import { PointLight } from '@babylonjs/core/Lights/pointLight';
import { Color3, Color4 } from '@babylonjs/core/Maths/math.color';
import { Vector3 } from '@babylonjs/core/Maths/math.vector';
import { SceneLoader } from '@babylonjs/core/Loading/sceneLoader';
import '@babylonjs/loaders/glTF';

type ViewerControls = {
  reset: () => void;
  resize: () => void;
};

const MODEL_FILE = 'Astikan_Health_Kiosk_V4.glb';

// The source GLB also contains exploded views, LOD samples, compact concepts,
// and a showroom set. They are separate design studies, not parts of the kiosk.
const NON_PRODUCT_MESH = /^(?:LOD[12]|EXPLODED|Compact|Flagship|Dimension|Environment|Info_|Waiting_|Modular|Pediatric|Outdoor|Premium|Collection|Ruler|Sample|Reference|Stage|FloorMarker)(?:_|$)/i;

export default function Kiosk3DViewer() {
  const containerRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const controlsRef = useRef<ViewerControls | null>(null);
  const [shouldLoad, setShouldLoad] = useState(false);
  const [status, setStatus] = useState('Preparing interactive viewer…');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (!entries.some((entry) => entry.isIntersecting)) return;
        setShouldLoad(true);
        observer.disconnect();
      },
      { rootMargin: '500px 0px', threshold: 0.01 },
    );
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (!shouldLoad) return undefined;
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    let disposed = false;
    let cleanup = () => {};

    const initialiseViewer = async () => {
      setError('');
      setProgress(2);
      setStatus('Loading full-detail kiosk…');

      try {
        if (disposed) return;

        const engine = new Engine(canvas, true, {
          preserveDrawingBuffer: false,
          stencil: true,
          antialias: true,
          adaptToDeviceRatio: true,
        });
        engine.setHardwareScalingLevel(Math.max(1, window.devicePixelRatio > 1.5 ? 1.35 : 1));

        const scene = new Scene(engine);
        scene.clearColor = new Color4(0.006, 0.012, 0.028, 1);
        scene.environmentIntensity = 0.72;
        scene.imageProcessingConfiguration.toneMappingEnabled = true;
        scene.imageProcessingConfiguration.toneMappingType = ImageProcessingConfiguration.TONEMAPPING_ACES;
        scene.imageProcessingConfiguration.exposure = 1.05;
        scene.imageProcessingConfiguration.contrast = 1.12;

        const camera = new ArcRotateCamera(
          'kiosk-camera',
          Math.PI / 2.2,
          1.19,
          14,
          new Vector3(0, 2.8, 0),
          scene,
        );
        camera.attachControl(canvas, true);
        camera.lowerBetaLimit = 0.22;
        camera.upperBetaLimit = Math.PI / 2.03;
        camera.wheelPrecision = 38;
        camera.pinchPrecision = 90;
        camera.panningSensibility = 58;
        camera.pinchToPanMaxDistance = 18;
        camera.inertia = 0.9;
        const pointerInput = camera.inputs.attached.pointers as typeof camera.inputs.attached.pointers & {
          multiTouchPanAndZoom: boolean;
        };
        pointerInput.multiTouchPanAndZoom = true;

        const hemisphericLight = new HemisphericLight(
          'studio-fill',
          new Vector3(0.25, 1, 0.18),
          scene,
        );
        hemisphericLight.intensity = 0.72;
        hemisphericLight.groundColor = new Color3(0.025, 0.045, 0.09);

        const keyLight = new DirectionalLight(
          'studio-key',
          new Vector3(-0.45, -1, 0.35),
          scene,
        );
        keyLight.position = new Vector3(8, 14, -9);
        keyLight.intensity = 1.18;

        const rimLight = new PointLight(
          'studio-rim',
          new Vector3(-7, 7, 7),
          scene,
        );
        rimLight.diffuse = new Color3(0.28, 0.58, 1);
        rimLight.intensity = 0.55;

        const glow = new GlowLayer('kiosk-led-glow', scene, { blurKernelSize: 24 });
        glow.intensity = 0.32;

        const result = await SceneLoader.ImportMeshAsync(
          '',
          '/kiosk-3d/',
          MODEL_FILE,
          scene,
          (event) => {
            if (disposed) return;
            if (event.lengthComputable && event.total) {
              setProgress(Math.min(96, Math.round((event.loaded / event.total) * 100)));
            } else {
              setProgress((value) => Math.min(92, value + 3));
            }
          },
        );
        if (disposed) {
          scene.dispose();
          engine.dispose();
          return;
        }

        result.meshes.forEach((mesh) => {
          if (NON_PRODUCT_MESH.test(mesh.name)) mesh.setEnabled(false);
        });

        const renderableMeshes = result.meshes.filter(
          (mesh) => mesh.isEnabled() && mesh.getTotalVertices() > 0,
        );
        if (!renderableMeshes.length) throw new Error('The kiosk model did not contain renderable meshes.');

        let minimum = renderableMeshes[0].getBoundingInfo().boundingBox.minimumWorld.clone();
        let maximum = renderableMeshes[0].getBoundingInfo().boundingBox.maximumWorld.clone();
        renderableMeshes.forEach((mesh) => {
          mesh.computeWorldMatrix(true);
          const bounds = mesh.getBoundingInfo().boundingBox;
          minimum = Vector3.Minimize(minimum, bounds.minimumWorld);
          maximum = Vector3.Maximize(maximum, bounds.maximumWorld);
        });

        const center = minimum.add(maximum).scale(0.5);
        const dimensions = maximum.subtract(minimum);
        const modelSize = Math.max(dimensions.x, dimensions.y, dimensions.z);
        const aspect = Math.max(1, engine.getRenderWidth() / engine.getRenderHeight());
        const widthRadius = dimensions.x / (2 * Math.tan(camera.fov / 2) * aspect);
        const heightRadius = dimensions.y / (2 * Math.tan(camera.fov / 2));
        const defaultRadius = Math.max(widthRadius, heightRadius) * 1.32;
        const defaultView = {
          alpha: Math.PI / 2.2,
          beta: 1.19,
          radius: defaultRadius,
          target: center.clone(),
        };
        camera.setTarget(defaultView.target);
        camera.radius = defaultView.radius;
        camera.lowerRadiusLimit = Math.max(modelSize * 0.32, 2.5);
        camera.upperRadiusLimit = Math.max(modelSize * 3.2, 28);

        controlsRef.current = {
          reset: () => {
            camera.alpha = defaultView.alpha;
            camera.beta = defaultView.beta;
            camera.radius = defaultView.radius;
            camera.setTarget(defaultView.target);
          },
          resize: () => engine.resize(),
        };

        const resizeEngine = () => engine.resize();
        window.addEventListener('resize', resizeEngine);

        result.animationGroups.forEach((animation) => {
          animation.stop();
          animation.reset();
        });
        const renderScene = () => scene.render();
        engine.runRenderLoop(renderScene);
        const visibilityObserver = new IntersectionObserver(
          (entries) => {
            if (entries.some((entry) => entry.isIntersecting)) engine.runRenderLoop(renderScene);
            else engine.stopRenderLoop(renderScene);
          },
          { rootMargin: '200px 0px', threshold: 0.01 },
        );
        if (containerRef.current) visibilityObserver.observe(containerRef.current);
        setProgress(100);
        setStatus('Full-detail manual viewer ready');

        cleanup = () => {
          visibilityObserver.disconnect();
          window.removeEventListener('resize', resizeEngine);
          controlsRef.current = null;
          scene.dispose();
          engine.dispose();
        };
      } catch (viewerError) {
        console.error('Kiosk 3D viewer failed:', viewerError);
        if (!disposed) {
          setError('The interactive model could not load on this device.');
          setStatus('3D viewer unavailable');
        }
      }
    };

    initialiseViewer();
    return () => {
      disposed = true;
      cleanup();
    };
  }, [shouldLoad]);

  const toggleFullscreen = async () => {
    const container = containerRef.current;
    if (!container) return;
    if (document.fullscreenElement) await document.exitFullscreen();
    else await container.requestFullscreen();
    window.setTimeout(() => controlsRef.current?.resize(), 120);
  };

  return (
    <section id="kiosk-3d" className="bg-[#020d22] px-4 py-16 text-white sm:px-6 lg:px-8 lg:py-24">
      <div className="mx-auto max-w-[1380px]">
        <div className="grid items-end gap-8 lg:grid-cols-[1fr_.8fr]">
          <div data-aos="fade-up">
            <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-cyan-300">INTERACTIVE 3D EXPERIENCE</p>
            <h2 className="mt-4 max-w-4xl text-4xl font-extrabold tracking-[-0.04em] sm:text-5xl lg:text-6xl">
              Explore the kiosk from every angle.
            </h2>
          </div>
          <p className="max-w-xl text-sm leading-7 text-blue-100/65 lg:justify-self-end" data-aos="fade-up" data-aos-delay="80">
            Drag to rotate, pinch or scroll to zoom, and pan around the production model to inspect its displays, diagnostic tools, chair, storage, and accessibility details.
          </p>
        </div>

        <div
          ref={containerRef}
          data-lenis-prevent
          className="relative mt-10 min-h-[520px] overflow-hidden rounded-[1.8rem] border border-white/10 bg-[#04132d] shadow-[0_35px_100px_rgba(0,0,0,.4)] sm:min-h-[620px] lg:min-h-[760px]"
          data-animate-widget="true"
        >
          {!shouldLoad && (
            <img
              src="/kiosk-3d/kiosk-poster.png"
              alt="Astikan Health Kiosk 3D preview"
              className="absolute inset-0 h-full w-full object-cover opacity-60"
            />
          )}
          <canvas
            ref={canvasRef}
            className="absolute inset-0 h-full w-full touch-none outline-none"
            aria-label="Interactive 3D model of the Astikan Health Kiosk"
            tabIndex={0}
          />

          <div className="pointer-events-none absolute inset-x-0 top-0 flex flex-col gap-3 bg-gradient-to-b from-[#020817]/90 via-[#020817]/55 to-transparent p-4 sm:flex-row sm:items-start sm:justify-between sm:p-5">
            <div className="pointer-events-auto max-w-sm rounded-2xl border border-white/10 bg-[#061832]/80 p-4 backdrop-blur-xl">
              <div className="flex items-center gap-3">
                <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-500/20 text-cyan-300"><Box size={20} /></span>
                <div><div className="text-sm font-extrabold">Astikan Health Kiosk V4</div><div className="mt-1 text-[10px] text-blue-100/55">{status}</div></div>
              </div>
              {progress < 100 && !error && (
                <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-blue-500 to-cyan-300 transition-[width] duration-300" style={{ width: `${progress}%` }} />
                </div>
              )}
            </div>

            <div className="pointer-events-auto flex flex-wrap gap-2">
              <button type="button" onClick={() => controlsRef.current?.reset()} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-[#061832]/85 px-3 text-[11px] font-extrabold backdrop-blur-xl transition hover:bg-white/10"><RotateCcw size={15} /> Reset</button>
              <button type="button" onClick={toggleFullscreen} className="inline-flex h-10 items-center gap-2 rounded-xl border border-white/15 bg-[#061832]/85 px-3 text-[11px] font-extrabold backdrop-blur-xl transition hover:bg-white/10"><Expand size={15} /> Fullscreen</button>
            </div>
          </div>

          {error && (
            <div className="absolute inset-0 flex flex-col items-center justify-center bg-[#03112a]/95 p-8 text-center">
              <Box size={38} className="text-blue-300" />
              <p className="mt-4 text-sm font-extrabold">{error}</p>
              <img src="/kiosk-3d/kiosk-poster.png" alt="" className="mt-6 max-h-72 rounded-2xl object-contain opacity-80" />
            </div>
          )}

          {!error && progress < 100 && shouldLoad && (
            <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
              <LoaderCircle className="h-9 w-9 animate-spin text-cyan-300" />
            </div>
          )}

          <div className="pointer-events-none absolute inset-x-0 bottom-0 flex justify-center bg-gradient-to-t from-[#020817]/90 to-transparent px-4 pb-4 pt-16">
            <div className="flex items-center gap-3 rounded-full border border-white/10 bg-[#061832]/80 px-4 py-2 text-[10px] font-bold text-blue-100/70 backdrop-blur-xl">
              <ZoomIn size={14} className="text-cyan-300" />
              <span className="hidden sm:inline">Drag to rotate · Scroll/pinch to zoom · Right-drag to pan</span>
              <span className="sm:hidden">Drag to rotate · Pinch to zoom · Two-finger pan</span>
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap items-center justify-between gap-3 text-[10px] text-blue-100/45">
          <span>Babylon.js full-detail production model</span>
          <span className="rounded-full bg-white/10 px-3 py-1.5 font-extrabold uppercase tracking-[.08em] text-white">Full detail</span>
        </div>
      </div>
    </section>
  );
}
