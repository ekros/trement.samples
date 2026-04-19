"use client";

import React from "react";

const vertexShaderSource = `
attribute vec2 a_position;

void main() {
  gl_Position = vec4(a_position, 0.0, 1.0);
}
`;

const fragmentShaderSource = `
precision mediump float;

uniform vec2 u_resolution;
uniform float u_time;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
}

float squareMask(vec2 p, float size) {
  vec2 halfSize = vec2(size * 0.5);
  vec2 d = abs(p) - halfSize;
  return 1.0 - step(0.0, max(d.x, d.y));
}

float squareBorder(vec2 p, float size, float thickness) {
    float outer = squareMask(p, size);
    float innerSize = max(size - thickness * 2.0, 0.0);
    float inner = squareMask(p, innerSize);
    return max(outer - inner, 0.0);
}

float squareGlow(vec2 p, float size, float softness) {
    float edgeDist = abs(max(abs(p.x), abs(p.y)) - size * 0.5);
    return exp(-edgeDist / softness);
}

vec3 composite(vec3 baseColor, vec3 topColor, float topAlpha) {
  return topColor * topAlpha + baseColor * (1.0 - topAlpha);
}

void main() {
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  vec2 centered = uv - 0.5;
  centered.x *= u_resolution.x / u_resolution.y;

    vec2 direction = normalize(vec2(0.9, 0.45));

    float speed = 0.03;
  vec2 motion = direction * u_time * speed;

    float spacingBase = 0.16;
    float spacingScale = 0.75 + 0.25 * sin(u_time * (6.28318530718 / 15.0));
    float spacing = spacingBase * spacingScale;
    float squareSize = 0.044;
    float px = 1.0 / u_resolution.y;
    float borderPx = 5.0;
    float borderSize = borderPx * px;
    vec2 offset = vec2(4.0, 3.0) * px;

  vec2 gridA = mod(centered + motion + spacing * 0.5, spacing) - spacing * 0.5;
  vec2 gridB = mod(centered + motion + offset + spacing * 0.5, spacing) - spacing * 0.5;

    float sqA = squareBorder(gridA, squareSize, borderSize);
    float sqB = squareBorder(gridB, squareSize, borderSize);
    float glowA = squareGlow(gridA, squareSize, 0.006);
    float glowB = squareGlow(gridB, squareSize, 0.006);

  vec3 colorA = vec3(0.0, 0.749, 1.0);    // deepskyblue
  vec3 colorB = vec3(1.0, 0.388, 0.278);  // tomato

  float alpha = 0.70;
    float glowAlpha = 0.22;
  vec3 color = vec3(0.0);
    color = composite(color, colorA, glowA * glowAlpha);
    color = composite(color, colorB, glowB * glowAlpha);
  color = composite(color, colorA, sqA * alpha);
  color = composite(color, colorB, sqB * alpha);

    // Static CRT-like texture: fixed grain + scanlines, no time animation.
    vec2 grainCells = floor(gl_FragCoord.xy / 2.0);
    float grain = hash(grainCells);
    float grainStepped = floor(grain * 5.0) / 4.0 - 0.5;

    float scan = step(0.5, fract(gl_FragCoord.y * 0.5));
    float scanlines = mix(0.86, 1.0, scan);

    color *= scanlines;
    color += grainStepped * 0.14;
    color = clamp(color, 0.0, 1.0);

    float finalAlpha = max(max(sqA, sqB) * alpha, max(glowA, glowB) * glowAlpha);
    gl_FragColor = vec4(color, finalAlpha);
}
`;

function compileShader(
    gl: WebGLRenderingContext,
    type: number,
    source: string
): WebGLShader | null {
    const shader = gl.createShader(type);
    if (!shader) {
        return null;
    }

    gl.shaderSource(shader, source);
    gl.compileShader(shader);

    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
        console.error("Shader compilation error:", gl.getShaderInfoLog(shader));
        gl.deleteShader(shader);
        return null;
    }

    return shader;
}

function createProgram(
    gl: WebGLRenderingContext,
    vertexSource: string,
    fragmentSource: string
): WebGLProgram | null {
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);

    if (!vertexShader || !fragmentShader) {
        if (vertexShader) gl.deleteShader(vertexShader);
        if (fragmentShader) gl.deleteShader(fragmentShader);
        return null;
    }

    const program = gl.createProgram();
    if (!program) {
        gl.deleteShader(vertexShader);
        gl.deleteShader(fragmentShader);
        return null;
    }

    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);

    gl.deleteShader(vertexShader);
    gl.deleteShader(fragmentShader);

    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
        console.error("Program link error:", gl.getProgramInfoLog(program));
        gl.deleteProgram(program);
        return null;
    }

    return program;
}

export function SquaresShaderBackground() {
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null);

    React.useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) {
            return;
        }

        const gl = canvas.getContext("webgl", {
            alpha: true,
            antialias: false,
            depth: false,
            stencil: false,
            preserveDrawingBuffer: false,
            powerPreference: "high-performance",
        });

        if (!gl) {
            return;
        }

        const program = createProgram(gl, vertexShaderSource, fragmentShaderSource);
        if (!program) {
            return;
        }

        const buffer = gl.createBuffer();
        if (!buffer) {
            gl.deleteProgram(program);
            return;
        }

        gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
        gl.bufferData(
            gl.ARRAY_BUFFER,
            new Float32Array([
                -1, -1,
                1, -1,
                -1, 1,
                -1, 1,
                1, -1,
                1, 1,
            ]),
            gl.STATIC_DRAW
        );

        const positionLoc = gl.getAttribLocation(program, "a_position");
        const resolutionLoc = gl.getUniformLocation(program, "u_resolution");
        const timeLoc = gl.getUniformLocation(program, "u_time");

        let rafId = 0;
        let startTime = performance.now();
        const motionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
        let running = !motionQuery.matches;

        const resize = () => {
            const dpr = Math.min(window.devicePixelRatio || 1, 1.5);
            const width = Math.floor(window.innerWidth * dpr);
            const height = Math.floor(window.innerHeight * dpr);

            if (canvas.width !== width || canvas.height !== height) {
                canvas.width = width;
                canvas.height = height;
                canvas.style.width = "100%";
                canvas.style.height = "100%";
            }

            gl.viewport(0, 0, width, height);
        };

        const drawFrame = (elapsed: number) => {
            resize();

            gl.useProgram(program);
            gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
            gl.enableVertexAttribArray(positionLoc);
            gl.vertexAttribPointer(positionLoc, 2, gl.FLOAT, false, 0, 0);

            gl.uniform2f(resolutionLoc, canvas.width, canvas.height);
            gl.uniform1f(timeLoc, elapsed);

            gl.clearColor(0, 0, 0, 0);
            gl.clear(gl.COLOR_BUFFER_BIT);
            gl.drawArrays(gl.TRIANGLES, 0, 6);
        };

        const render = () => {
            if (!running) {
                return;
            }

            const elapsed = (performance.now() - startTime) / 1000;
            drawFrame(elapsed);

            rafId = window.requestAnimationFrame(render);
        };

        const onVisibilityChange = () => {
            running = document.visibilityState === "visible";
            if (running) {
                startTime = performance.now();
                rafId = window.requestAnimationFrame(render);
            } else {
                window.cancelAnimationFrame(rafId);
            }
        };

        const onMotionChange = (event: MediaQueryListEvent) => {
            if (event.matches) {
                running = false;
                window.cancelAnimationFrame(rafId);
                drawFrame(0);
                return;
            }

            running = document.visibilityState === "visible";
            if (running) {
                startTime = performance.now();
                rafId = window.requestAnimationFrame(render);
            }
        };

        window.addEventListener("resize", resize);
        document.addEventListener("visibilitychange", onVisibilityChange);
        motionQuery.addEventListener("change", onMotionChange);

        if (running) {
            rafId = window.requestAnimationFrame(render);
        } else {
            drawFrame(0);
        }

        return () => {
            running = false;
            window.cancelAnimationFrame(rafId);
            window.removeEventListener("resize", resize);
            document.removeEventListener("visibilitychange", onVisibilityChange);
            motionQuery.removeEventListener("change", onMotionChange);

            gl.deleteBuffer(buffer);
            gl.deleteProgram(program);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            aria-hidden
            className="pointer-events-none fixed inset-0 z-0"
        />
    );
}
