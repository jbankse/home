'use client';

import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const vertexShaderSrc = `
varying vec2 vUv;
void main() {
  vUv = uv;
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const fragmentShaderSrc = `
uniform float uRadius;
uniform float uIntensity;
uniform float uTime;
varying vec2 vUv;

// Simple pseudo-random noise
float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
}

float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
    float dist = distance(vUv, vec2(0.5));
    
    // Add subtle noise movement
    float n = noise(vUv * 20.0 + uTime * 0.5) * 0.02;
    
    // We want the center to be clear (0.0) and edges to be dark (1.0)
    // uRadius defines the point where it starts getting dark.
    // smoothstep(edge0, edge1, x): 0 if x < edge0, 1 if x > edge1
    
    // If we want clear center:
    // dist < uRadius -> 0
    // dist > uRadius -> 1
    
    float vignette = smoothstep(uRadius - 0.2, uRadius + 0.1, dist + n);
    
    gl_FragColor = vec4(vec3(0.0), vignette * uIntensity);
}
`;

// Global ref to access material from outside (as requested by user pattern)
// In a larger app, we might use Context or Zustand, but this follows the user's requested pattern.
export const vignetteMaterialRef = { current: null as THREE.ShaderMaterial | null };

export default function VignetteLayer() {
    const mountRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!mountRef.current) return;

        // Scene Setup
        const scene = new THREE.Scene();
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });

        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Optimization
        mountRef.current.appendChild(renderer.domElement);

        // Geometry & Material
        const geometry = new THREE.PlaneGeometry(2, 2);
        const material = new THREE.ShaderMaterial({
            transparent: true,
            uniforms: {
                uRadius: { value: 0.8 }, // Start wider
                uIntensity: { value: 1.0 },
                uTime: { value: 0 }
            },
            vertexShader: vertexShaderSrc,
            fragmentShader: fragmentShaderSrc
        });

        vignetteMaterialRef.current = material;

        const mesh = new THREE.Mesh(geometry, material);
        scene.add(mesh);

        const clock = new THREE.Clock();
        let animationFrameId: number;

        const renderLoop = () => {
            material.uniforms.uTime.value = clock.getElapsedTime();
            renderer.render(scene, camera);
            animationFrameId = requestAnimationFrame(renderLoop);
        };
        renderLoop();

        // Resize Handling
        const handleResize = () => {
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        };
        window.addEventListener('resize', handleResize);

        // Cleanup
        return () => {
            window.removeEventListener('resize', handleResize);
            cancelAnimationFrame(animationFrameId);
            if (mountRef.current) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            material.dispose();
            renderer.dispose();
            vignetteMaterialRef.current = null;
        };
    }, []);

    return <div ref={mountRef} className="fixed inset-0 pointer-events-none z-50" />;
}
