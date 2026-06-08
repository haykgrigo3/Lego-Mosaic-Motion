const MAX_RENDER_FRAMES = 300;
const DEFAULT_WIDTH = 72;
const DEFAULT_HEIGHT = 72;
const PREVIEW_SCRUB_RATIO = 0.02;
const DEFAULT_PALETTE_KEY = "warm_contrast";

const CUSTOM_PALETTES = {
    warm_contrast: {
        label: "Warm Contrast",
        colors: [
            { name: "Graphite", hex: "#212121" },
            { name: "Steel", hex: "#595d60" },
            { name: "Mist", hex: "#afb5c7" },
            { name: "White", hex: "#ffffff" },
            { name: "Porcelain", hex: "#feccb0" },
            { name: "Peach", hex: "#ffaf7d" },
            { name: "Clay", hex: "#e3a05b" },
            { name: "Sand", hex: "#dec69c" },
            { name: "Rust", hex: "#89351d" },
            { name: "Mahogany", hex: "#532115" },
            { name: "Espresso", hex: "#330000" },
            { name: "Signal Red", hex: "#b30006" },
            { name: "Oxide", hex: "#6a0e15" },
            { name: "Royal Blue", hex: "#0057a6" },
            { name: "Sky Blue", hex: "#42c0fb" },
            { name: "Forest", hex: "#00642e" },
            { name: "Lime", hex: "#10cb31" },
            { name: "Sunlight", hex: "#f7d117" },
            { name: "Tangerine", hex: "#ff7e14" }
        ]
    },
    studio_color: {
        label: "Studio Color",
        colors: [
            { name: "Black", hex: "#171717" },
            { name: "Charcoal", hex: "#41464b" },
            { name: "Fog", hex: "#9ca7b2" },
            { name: "White", hex: "#f8f8f4" },
            { name: "Rose", hex: "#f3c1b2" },
            { name: "Coral", hex: "#e9846d" },
            { name: "Cocoa", hex: "#7e5038" },
            { name: "Gold", hex: "#d6a33d" },
            { name: "Teal", hex: "#0d7c86" },
            { name: "Blue", hex: "#1b5fc6" },
            { name: "Moss", hex: "#56743c" },
            { name: "Scarlet", hex: "#bd2d2d" }
        ]
    },
    earth_tones: {
        label: "Earth Tones",
        colors: [
            { name: "Ink", hex: "#201d1d" },
            { name: "Stone", hex: "#6f6a64" },
            { name: "Bone", hex: "#ddd3c3" },
            { name: "Ivory", hex: "#f7efe5" },
            { name: "Tan", hex: "#cfaf82" },
            { name: "Amber", hex: "#c07a36" },
            { name: "Brick", hex: "#924a2b" },
            { name: "Walnut", hex: "#5a3425" },
            { name: "Olive", hex: "#66703c" },
            { name: "Pine", hex: "#35533c" }
        ]
    },
    signal_pop: {
        label: "Signal Pop",
        colors: [
            { name: "Black", hex: "#1e1e20" },
            { name: "White", hex: "#fbfaf5" },
            { name: "Gray", hex: "#8e949c" },
            { name: "Red", hex: "#cc2a36" },
            { name: "Orange", hex: "#ef7f2d" },
            { name: "Yellow", hex: "#f2c230" },
            { name: "Green", hex: "#3c9643" },
            { name: "Blue", hex: "#2b72cc" },
            { name: "Purple", hex: "#7d59b5" }
        ]
    },
    grayscale_high_contrast: {
        label: "High Contrast Grayscale",
        colors: [
            { name: "White", hex: "#ffffff" },
            { name: "Light Gray", hex: "#e8e8e8" },
            { name: "Mid Gray", hex: "#afb5c7" },
            { name: "Dark Gray", hex: "#595d60" },
            { name: "Black", hex: "#212121" }
        ]
    }
};

const PALETTE_KEYS = ["warm_contrast", "studio_color", "earth_tones", "signal_pop", "grayscale_high_contrast"];
const BRICKLINK_COLORS =
    typeof ALL_BRICKLINK_SOLID_COLORS !== "undefined" && Array.isArray(ALL_BRICKLINK_SOLID_COLORS)
        ? ALL_BRICKLINK_SOLID_COLORS
        : [];
const SET_PALETTES = typeof STUD_MAPS !== "undefined" && STUD_MAPS != null ? STUD_MAPS : {};

const elements = {
    videoInput: document.getElementById("video-input"),
    widthInput: document.getElementById("width-input"),
    heightInput: document.getElementById("height-input"),
    lockAspectInput: document.getElementById("lock-aspect-input"),
    fpsInput: document.getElementById("fps-input"),
    renderScaleInput: document.getElementById("render-scale-input"),
    zoomInput: document.getElementById("zoom-input"),
    panXInput: document.getElementById("pan-x-input"),
    panYInput: document.getElementById("pan-y-input"),
    paletteInput: document.getElementById("palette-input"),
    ditherInput: document.getElementById("dither-input"),
    studShapeInput: document.getElementById("stud-shape-input"),
    saturationInput: document.getElementById("saturation-input"),
    brightnessInput: document.getElementById("brightness-input"),
    contrastInput: document.getElementById("contrast-input"),
    exportFramesInput: document.getElementById("export-frames-input"),
    renderButton: document.getElementById("render-button"),
    refreshPreviewButton: document.getElementById("refresh-preview-button"),
    sourcePreviewCanvas: document.getElementById("source-preview-canvas"),
    mosaicPreviewCanvas: document.getElementById("mosaic-preview-canvas"),
    inputStatus: document.getElementById("input-status"),
    renderStatus: document.getElementById("render-status"),
    renderProgressBar: document.getElementById("render-progress-bar"),
    sourceStat: document.getElementById("source-stat"),
    paletteStat: document.getElementById("palette-stat"),
    frameCountStat: document.getElementById("frame-count-stat"),
    outputStat: document.getElementById("output-stat"),
    downloadVideoLink: document.getElementById("download-video-link"),
    downloadZipLink: document.getElementById("download-zip-link"),
    outputVideo: document.getElementById("output-video"),
};

const interactiveControls = [
    elements.widthInput,
    elements.heightInput,
    elements.lockAspectInput,
    elements.fpsInput,
    elements.renderScaleInput,
    elements.zoomInput,
    elements.panXInput,
    elements.panYInput,
    elements.paletteInput,
    elements.ditherInput,
    elements.studShapeInput,
    elements.saturationInput,
    elements.brightnessInput,
    elements.contrastInput,
    elements.exportFramesInput,
];

const state = {
    videoFile: null,
    videoUrl: null,
    outputVideoUrl: null,
    zipUrl: null,
    videoMeta: null,
    isRendering: false,
    previewRequestId: 0,
    firstFrameCanvas: document.createElement("canvas"),
    sampleCanvas: document.createElement("canvas"),
    renderCanvas: document.createElement("canvas"),
    recordCanvas: document.createElement("canvas"),
};

const sampleContext = state.sampleCanvas.getContext("2d", { willReadFrequently: true });
const renderContext = state.renderCanvas.getContext("2d");
const recordContext = state.recordCanvas.getContext("2d");
const sourcePreviewContext = elements.sourcePreviewCanvas.getContext("2d");
const mosaicPreviewContext = elements.mosaicPreviewCanvas.getContext("2d");

const fillStyleCache = new Map();
const strokeStyleCache = new Map();

function clamp(value, min, max) {
    return Math.min(Math.max(value, min), max);
}

function clampByte(value) {
    return clamp(Math.round(value), 0, 255);
}

function revokeObjectUrl(url) {
    if (url != null) {
        URL.revokeObjectURL(url);
    }
}

function clearOutputArtifacts() {
    revokeObjectUrl(state.outputVideoUrl);
    revokeObjectUrl(state.zipUrl);
    state.outputVideoUrl = null;
    state.zipUrl = null;
    elements.downloadVideoLink.hidden = true;
    elements.downloadZipLink.hidden = true;
    elements.outputVideo.pause();
    elements.outputVideo.removeAttribute("src");
    elements.outputVideo.load();
}

function setStatus(element, message, isError = false) {
    element.textContent = message;
    element.classList.toggle("error", isError);
}

function setProgress(ratio) {
    elements.renderProgressBar.style.width = `${clamp(ratio, 0, 1) * 100}%`;
}

function formatDuration(totalSeconds) {
    if (!Number.isFinite(totalSeconds)) {
        return "unknown length";
    }
    if (totalSeconds < 60) {
        return `${totalSeconds.toFixed(1)}s`;
    }
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = Math.round(totalSeconds % 60);
    return `${minutes}m ${seconds}s`;
}

function fitRect(sourceWidth, sourceHeight, targetWidth, targetHeight) {
    const scale = Math.min(targetWidth / sourceWidth, targetHeight / sourceHeight);
    const width = sourceWidth * scale;
    const height = sourceHeight * scale;
    return {
        x: (targetWidth - width) / 2,
        y: (targetHeight - height) / 2,
        width,
        height,
    };
}

function drawPlaceholder(ctx, canvas, title, subtitle) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.fillStyle = "#111922";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = "rgba(255, 255, 255, 0.92)";
    ctx.textAlign = "center";
    ctx.font = "700 28px Avenir Next, Trebuchet MS, sans-serif";
    ctx.fillText(title, canvas.width / 2, canvas.height / 2 - 10);
    ctx.font = "400 15px Avenir Next, Trebuchet MS, sans-serif";
    ctx.fillStyle = "rgba(255, 255, 255, 0.68)";
    ctx.fillText(subtitle, canvas.width / 2, canvas.height / 2 + 22);
}

function normalizeHex(hex) {
    return hex.toLowerCase();
}

const BRICKLINK_COLOR_BY_HEX = new Map(
    BRICKLINK_COLORS.filter((color) => color != null && typeof color.hex === "string").map((color) => [
        normalizeHex(color.hex),
        color,
    ])
);
const SET_PALETTE_KEYS = Object.keys(SET_PALETTES);

function hexToRgb(hex) {
    const normalized = normalizeHex(hex).replace("#", "");
    return [
        parseInt(normalized.slice(0, 2), 16),
        parseInt(normalized.slice(2, 4), 16),
        parseInt(normalized.slice(4, 6), 16),
    ];
}

function rgbToCss(r, g, b) {
    const key = (r << 16) | (g << 8) | b;
    if (!fillStyleCache.has(key)) {
        fillStyleCache.set(key, `rgb(${r}, ${g}, ${b})`);
    }
    return fillStyleCache.get(key);
}

function rgbToStrokeCss(r, g, b) {
    const key = (r << 16) | (g << 8) | b;
    if (!strokeStyleCache.has(key)) {
        strokeStyleCache.set(
            key,
            `rgb(${clampByte(r * 0.52)}, ${clampByte(g * 0.52)}, ${clampByte(b * 0.52)})`
        );
    }
    return strokeStyleCache.get(key);
}

function srgbToLinear(channel) {
    const normalized = channel / 255;
    if (normalized <= 0.04045) {
        return normalized / 12.92;
    }
    return ((normalized + 0.055) / 1.055) ** 2.4;
}

function rgbToLab(r, g, b) {
    const rl = srgbToLinear(r);
    const gl = srgbToLinear(g);
    const bl = srgbToLinear(b);

    let x = rl * 0.4124564 + gl * 0.3575761 + bl * 0.1804375;
    let y = rl * 0.2126729 + gl * 0.7151522 + bl * 0.072175;
    let z = rl * 0.0193339 + gl * 0.119192 + bl * 0.9503041;

    x /= 0.95047;
    y /= 1;
    z /= 1.08883;

    const transform = (value) => {
        if (value > 0.008856) {
            return value ** (1 / 3);
        }
        return (7.787 * value) + 16 / 116;
    };

    const fx = transform(x);
    const fy = transform(y);
    const fz = transform(z);

    return {
        l: (116 * fy) - 16,
        a: 500 * (fx - fy),
        b: 200 * (fy - fz),
    };
}

function paletteColorFromDefinition(colorDefinition) {
    const normalized = normalizeHex(colorDefinition.hex);
    const bricklinkColor = BRICKLINK_COLOR_BY_HEX.get(normalized);
    const [r, g, b] = hexToRgb(normalized);
    return {
        hex: normalized,
        name: colorDefinition.name || (bricklinkColor != null ? bricklinkColor.name : normalized.toUpperCase()),
        bricklinkId: bricklinkColor != null ? bricklinkColor.id : null,
        r,
        g,
        b,
        lab: rgbToLab(r, g, b),
    };
}

function appendPaletteOption(parent, key, label) {
    const option = document.createElement("option");
    option.value = key;
    option.textContent = label;
    parent.appendChild(option);
}

function buildPaletteOptions() {
    elements.paletteInput.innerHTML = "";

    const studioGroup = document.createElement("optgroup");
    studioGroup.label = "Studio Presets";
    PALETTE_KEYS.forEach((key) => {
        if (CUSTOM_PALETTES[key] != null) {
            appendPaletteOption(studioGroup, key, CUSTOM_PALETTES[key].label);
        }
    });
    elements.paletteInput.appendChild(studioGroup);

    if (SET_PALETTE_KEYS.length > 0) {
        const setGroup = document.createElement("optgroup");
        setGroup.label = "Set Palettes";
        SET_PALETTE_KEYS.forEach((key) => {
            const setPalette = SET_PALETTES[key];
            const label = setPalette != null ? setPalette.name || setPalette.officialName || key : key;
            appendPaletteOption(setGroup, key, label);
        });
        elements.paletteInput.appendChild(setGroup);
    }

    elements.paletteInput.value = DEFAULT_PALETTE_KEY;
}

function getPaletteByKey(key) {
    if (CUSTOM_PALETTES[key] != null) {
        return {
            key,
            label: CUSTOM_PALETTES[key].label,
            colors: CUSTOM_PALETTES[key].colors.map((colorDefinition) => paletteColorFromDefinition(colorDefinition)),
        };
    }

    if (SET_PALETTES[key] != null && Array.isArray(SET_PALETTES[key].sortedStuds)) {
        return {
            key,
            label: SET_PALETTES[key].name || SET_PALETTES[key].officialName || key,
            colors: SET_PALETTES[key].sortedStuds.map((hex) => paletteColorFromDefinition({ hex })),
        };
    }

    return getPaletteByKey(DEFAULT_PALETTE_KEY);
}

function getPlannedFrameCount() {
    if (state.videoMeta == null) {
        return 0;
    }
    return Math.max(1, Math.ceil(state.videoMeta.duration * Number(elements.fpsInput.value)));
}

function updateAspectLockUi() {
    elements.heightInput.disabled = elements.lockAspectInput.checked;
}

function syncHeightFromWidth() {
    if (state.videoMeta == null || !elements.lockAspectInput.checked) {
        return;
    }
    const width = clamp(Number(elements.widthInput.value) || DEFAULT_WIDTH, 24, 160);
    const calculatedHeight = clamp(Math.round((width * state.videoMeta.height) / state.videoMeta.width), 24, 160);
    elements.heightInput.value = calculatedHeight;
}

function updateStats() {
    if (state.videoMeta == null) {
        elements.sourceStat.textContent = "No clip";
    } else {
        elements.sourceStat.textContent = `${state.videoMeta.width} x ${state.videoMeta.height} • ${formatDuration(
            state.videoMeta.duration
        )}`;
    }

    const palette = getPaletteByKey(elements.paletteInput.value);
    elements.paletteStat.textContent = `${palette.colors.length} colors`;

    const plannedFrames = getPlannedFrameCount();
    if (plannedFrames === 0) {
        elements.frameCountStat.textContent = "0 frames";
    } else if (plannedFrames > MAX_RENDER_FRAMES) {
        elements.frameCountStat.textContent = `${plannedFrames} planned • capped at ${MAX_RENDER_FRAMES}`;
    } else {
        elements.frameCountStat.textContent = `${plannedFrames} frames`;
    }

    const width = clamp(Number(elements.widthInput.value) || DEFAULT_WIDTH, 24, 160);
    const height = clamp(Number(elements.heightInput.value) || DEFAULT_HEIGHT, 24, 160);
    const studCount = width * height;
    elements.outputStat.textContent = `${width} x ${height} • ${studCount.toLocaleString()} studs`;
}

function getCurrentSettings() {
    const width = clamp(Number(elements.widthInput.value) || DEFAULT_WIDTH, 24, 160);
    const height = clamp(Number(elements.heightInput.value) || DEFAULT_HEIGHT, 24, 160);
    const palette = getPaletteByKey(elements.paletteInput.value);

    return {
        width,
        height,
        fps: Number(elements.fpsInput.value),
        renderScale: Number(elements.renderScaleInput.value),
        zoom: Number(elements.zoomInput.value),
        panX: Number(elements.panXInput.value) / 100,
        panY: Number(elements.panYInput.value) / 100,
        saturation: Number(elements.saturationInput.value),
        brightness: Number(elements.brightnessInput.value),
        contrast: Number(elements.contrastInput.value),
        dither: elements.ditherInput.value,
        studShape: elements.studShapeInput.value,
        exportFrames: elements.exportFramesInput.checked && typeof window.JSZip !== "undefined",
        palette,
    };
}

function getCropRect(sourceWidth, sourceHeight, settings) {
    const targetAspect = settings.width / settings.height;
    const sourceAspect = sourceWidth / sourceHeight;

    let baseWidth;
    let baseHeight;
    if (sourceAspect > targetAspect) {
        baseHeight = sourceHeight;
        baseWidth = sourceHeight * targetAspect;
    } else {
        baseWidth = sourceWidth;
        baseHeight = sourceWidth / targetAspect;
    }

    const cropWidth = baseWidth / settings.zoom;
    const cropHeight = baseHeight / settings.zoom;

    const maxCenterXOffset = (sourceWidth - cropWidth) / 2;
    const maxCenterYOffset = (sourceHeight - cropHeight) / 2;
    const centerX = (sourceWidth / 2) + settings.panX * maxCenterXOffset;
    const centerY = (sourceHeight / 2) + settings.panY * maxCenterYOffset;

    return {
        x: clamp(centerX - cropWidth / 2, 0, sourceWidth - cropWidth),
        y: clamp(centerY - cropHeight / 2, 0, sourceHeight - cropHeight),
        width: cropWidth,
        height: cropHeight,
    };
}

function drawSourcePreview() {
    if (state.videoMeta == null) {
        drawPlaceholder(
            sourcePreviewContext,
            elements.sourcePreviewCanvas,
            "Source Frame",
            "Load a video to frame the first shot."
        );
        return;
    }

    const canvas = elements.sourcePreviewCanvas;
    sourcePreviewContext.clearRect(0, 0, canvas.width, canvas.height);
    sourcePreviewContext.fillStyle = "#10171f";
    sourcePreviewContext.fillRect(0, 0, canvas.width, canvas.height);

    const fit = fitRect(state.firstFrameCanvas.width, state.firstFrameCanvas.height, canvas.width, canvas.height);
    sourcePreviewContext.drawImage(state.firstFrameCanvas, fit.x, fit.y, fit.width, fit.height);

    const settings = getCurrentSettings();
    const cropRect = getCropRect(state.firstFrameCanvas.width, state.firstFrameCanvas.height, settings);
    const cropX = fit.x + (cropRect.x / state.firstFrameCanvas.width) * fit.width;
    const cropY = fit.y + (cropRect.y / state.firstFrameCanvas.height) * fit.height;
    const cropWidth = (cropRect.width / state.firstFrameCanvas.width) * fit.width;
    const cropHeight = (cropRect.height / state.firstFrameCanvas.height) * fit.height;

    sourcePreviewContext.fillStyle = "rgba(6, 9, 14, 0.55)";
    sourcePreviewContext.beginPath();
    sourcePreviewContext.rect(fit.x, fit.y, fit.width, fit.height);
    sourcePreviewContext.rect(cropX, cropY, cropWidth, cropHeight);
    sourcePreviewContext.fill("evenodd");

    sourcePreviewContext.strokeStyle = "#f6f0e7";
    sourcePreviewContext.lineWidth = 3;
    sourcePreviewContext.strokeRect(cropX, cropY, cropWidth, cropHeight);

    sourcePreviewContext.strokeStyle = "rgba(255, 255, 255, 0.35)";
    sourcePreviewContext.lineWidth = 1;
    sourcePreviewContext.beginPath();
    sourcePreviewContext.moveTo(cropX + cropWidth / 3, cropY);
    sourcePreviewContext.lineTo(cropX + cropWidth / 3, cropY + cropHeight);
    sourcePreviewContext.moveTo(cropX + (2 * cropWidth) / 3, cropY);
    sourcePreviewContext.lineTo(cropX + (2 * cropWidth) / 3, cropY + cropHeight);
    sourcePreviewContext.moveTo(cropX, cropY + cropHeight / 3);
    sourcePreviewContext.lineTo(cropX + cropWidth, cropY + cropHeight / 3);
    sourcePreviewContext.moveTo(cropX, cropY + (2 * cropHeight) / 3);
    sourcePreviewContext.lineTo(cropX + cropWidth, cropY + (2 * cropHeight) / 3);
    sourcePreviewContext.stroke();
}

function applyLookAdjustments(pixels, settings) {
    const adjusted = new Uint8ClampedArray(pixels.length);
    const brightnessOffset = settings.brightness * 2.55;
    const contrastFactor = 1 + settings.contrast / 100;
    const saturationFactor = 1 + settings.saturation / 100;

    for (let i = 0; i < pixels.length; i += 4) {
        let r = pixels[i];
        let g = pixels[i + 1];
        let b = pixels[i + 2];

        const gray = (0.299 * r) + (0.587 * g) + (0.114 * b);
        r = gray + (r - gray) * saturationFactor;
        g = gray + (g - gray) * saturationFactor;
        b = gray + (b - gray) * saturationFactor;

        r = ((r - 128) * contrastFactor) + 128 + brightnessOffset;
        g = ((g - 128) * contrastFactor) + 128 + brightnessOffset;
        b = ((b - 128) * contrastFactor) + 128 + brightnessOffset;

        adjusted[i] = clampByte(r);
        adjusted[i + 1] = clampByte(g);
        adjusted[i + 2] = clampByte(b);
        adjusted[i + 3] = 255;
    }

    return adjusted;
}

function sampleSourcePixels(source, sourceWidth, sourceHeight, settings) {
    const cropRect = getCropRect(sourceWidth, sourceHeight, settings);
    state.sampleCanvas.width = settings.width;
    state.sampleCanvas.height = settings.height;
    sampleContext.imageSmoothingEnabled = true;
    sampleContext.clearRect(0, 0, settings.width, settings.height);
    sampleContext.drawImage(
        source,
        cropRect.x,
        cropRect.y,
        cropRect.width,
        cropRect.height,
        0,
        0,
        settings.width,
        settings.height
    );
    return sampleContext.getImageData(0, 0, settings.width, settings.height).data;
}

function colorDistanceLab(pixelLab, paletteColor) {
    const dl = pixelLab.l - paletteColor.lab.l;
    const da = pixelLab.a - paletteColor.lab.a;
    const db = pixelLab.b - paletteColor.lab.b;
    return (dl * dl) + (da * da) + (db * db);
}

function getNearestPaletteColor(r, g, b, palette, cache) {
    const key = (clampByte(r) << 16) | (clampByte(g) << 8) | clampByte(b);
    if (cache.has(key)) {
        return cache.get(key);
    }

    const pixelLab = rgbToLab(clampByte(r), clampByte(g), clampByte(b));
    let bestColor = palette[0];
    let bestDistance = colorDistanceLab(pixelLab, bestColor);

    for (let index = 1; index < palette.length; index++) {
        const candidate = palette[index];
        const distance = colorDistanceLab(pixelLab, candidate);
        if (distance < bestDistance) {
            bestDistance = distance;
            bestColor = candidate;
        }
    }

    cache.set(key, bestColor);
    return bestColor;
}

function quantizeWithoutDither(pixels, width, height, palette) {
    const quantized = new Uint8ClampedArray(width * height * 4);
    const cache = new Map();

    for (let index = 0; index < pixels.length; index += 4) {
        const nearest = getNearestPaletteColor(pixels[index], pixels[index + 1], pixels[index + 2], palette, cache);
        quantized[index] = nearest.r;
        quantized[index + 1] = nearest.g;
        quantized[index + 2] = nearest.b;
        quantized[index + 3] = 255;
    }

    return quantized;
}

function quantizeWithFloydSteinberg(pixels, width, height, palette) {
    const work = new Float32Array(pixels.length);
    for (let index = 0; index < pixels.length; index++) {
        work[index] = pixels[index];
    }

    const quantized = new Uint8ClampedArray(width * height * 4);
    const cache = new Map();

    const diffuse = (x, y, errorR, errorG, errorB, factor) => {
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return;
        }
        const pixelIndex = 4 * (y * width + x);
        work[pixelIndex] += errorR * factor;
        work[pixelIndex + 1] += errorG * factor;
        work[pixelIndex + 2] += errorB * factor;
    };

    for (let y = 0; y < height; y++) {
        for (let x = 0; x < width; x++) {
            const pixelIndex = 4 * (y * width + x);
            const r = clampByte(work[pixelIndex]);
            const g = clampByte(work[pixelIndex + 1]);
            const b = clampByte(work[pixelIndex + 2]);

            const nearest = getNearestPaletteColor(r, g, b, palette, cache);
            quantized[pixelIndex] = nearest.r;
            quantized[pixelIndex + 1] = nearest.g;
            quantized[pixelIndex + 2] = nearest.b;
            quantized[pixelIndex + 3] = 255;

            const errorR = r - nearest.r;
            const errorG = g - nearest.g;
            const errorB = b - nearest.b;

            diffuse(x + 1, y, errorR, errorG, errorB, 7 / 16);
            diffuse(x - 1, y + 1, errorR, errorG, errorB, 3 / 16);
            diffuse(x, y + 1, errorR, errorG, errorB, 5 / 16);
            diffuse(x + 1, y + 1, errorR, errorG, errorB, 1 / 16);
        }
    }

    return quantized;
}

function renderQuantizedFrame(source, sourceWidth, sourceHeight, settings) {
    const sampledPixels = sampleSourcePixels(source, sourceWidth, sourceHeight, settings);
    const adjustedPixels = applyLookAdjustments(sampledPixels, settings);

    if (settings.dither === "floyd") {
        return quantizeWithFloydSteinberg(adjustedPixels, settings.width, settings.height, settings.palette.colors);
    }
    return quantizeWithoutDither(adjustedPixels, settings.width, settings.height, settings.palette.colors);
}

function drawStud(ctx, x, y, cellSize, r, g, b, studShape) {
    const fill = rgbToCss(r, g, b);
    const stroke = rgbToStrokeCss(r, g, b);
    const inset = cellSize * 0.08;
    const centerX = x + cellSize / 2;
    const centerY = y + cellSize / 2;
    const radius = cellSize * 0.42;

    ctx.fillStyle = fill;
    ctx.strokeStyle = stroke;
    ctx.lineWidth = Math.max(1, cellSize * 0.06);

    if (studShape === "square-tile") {
        ctx.beginPath();
        ctx.rect(x + inset, y + inset, cellSize - inset * 2, cellSize - inset * 2);
        ctx.fill();
        ctx.stroke();
        return;
    }

    ctx.beginPath();
    ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (studShape === "round-plate") {
        ctx.beginPath();
        ctx.arc(centerX, centerY, radius * 0.56, 0, Math.PI * 2);
        ctx.strokeStyle = "rgba(255, 255, 255, 0.46)";
        ctx.lineWidth = Math.max(1, cellSize * 0.045);
        ctx.stroke();
    }
}

function paintMosaicFrame(ctx, pixels, width, height, cellSize, offsetX, offsetY, studShape) {
    ctx.fillStyle = "#0d1319";
    ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);

    for (let row = 0; row < height; row++) {
        for (let col = 0; col < width; col++) {
            const pixelIndex = 4 * (row * width + col);
            drawStud(
                ctx,
                offsetX + col * cellSize,
                offsetY + row * cellSize,
                cellSize,
                pixels[pixelIndex],
                pixels[pixelIndex + 1],
                pixels[pixelIndex + 2],
                studShape
            );
        }
    }
}

function drawMosaicPreview(pixels, settings) {
    const canvas = elements.mosaicPreviewCanvas;
    const ctx = mosaicPreviewContext;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    const cellSize = Math.min(canvas.width / settings.width, canvas.height / settings.height);
    const drawWidth = settings.width * cellSize;
    const drawHeight = settings.height * cellSize;
    const offsetX = (canvas.width - drawWidth) / 2;
    const offsetY = (canvas.height - drawHeight) / 2;

    paintMosaicFrame(ctx, pixels, settings.width, settings.height, cellSize, offsetX, offsetY, settings.studShape);
}

function drawMosaicExportFrame(pixels, settings) {
    state.renderCanvas.width = settings.width * settings.renderScale;
    state.renderCanvas.height = settings.height * settings.renderScale;
    renderContext.clearRect(0, 0, state.renderCanvas.width, state.renderCanvas.height);
    paintMosaicFrame(
        renderContext,
        pixels,
        settings.width,
        settings.height,
        settings.renderScale,
        0,
        0,
        settings.studShape
    );
}

function schedulePreviewRefresh() {
    updateStats();
    if (state.videoMeta == null || state.isRendering) {
        return;
    }

    cancelAnimationFrame(state.previewRequestId);
    state.previewRequestId = requestAnimationFrame(() => {
        drawSourcePreview();
        const settings = getCurrentSettings();
        const pixels = renderQuantizedFrame(
            state.firstFrameCanvas,
            state.firstFrameCanvas.width,
            state.firstFrameCanvas.height,
            settings
        );
        drawMosaicPreview(pixels, settings);
    });
}

function waitForEvent(target, successEvent, errorEvents = ["error"]) {
    return new Promise((resolve, reject) => {
        const cleanup = () => {
            target.removeEventListener(successEvent, onSuccess);
            errorEvents.forEach((eventName) => target.removeEventListener(eventName, onError));
        };

        const onSuccess = () => {
            cleanup();
            resolve();
        };

        const onError = () => {
            cleanup();
            reject(new Error(`Failed while waiting for ${successEvent}`));
        };

        target.addEventListener(successEvent, onSuccess);
        errorEvents.forEach((eventName) => target.addEventListener(eventName, onError));
    });
}

async function loadVideoElement(url) {
    const video = document.createElement("video");
    video.preload = "auto";
    video.muted = true;
    video.playsInline = true;
    video.src = url;
    video.load();

    if (video.readyState < 1) {
        await waitForEvent(video, "loadedmetadata");
    }
    if (video.readyState < 2) {
        await waitForEvent(video, "loadeddata");
    }
    return video;
}

async function seekVideo(video, timeInSeconds) {
    const maxSeek = Math.max(video.duration - 0.001, 0);
    const targetTime = clamp(timeInSeconds, 0, maxSeek);
    if (Math.abs(video.currentTime - targetTime) < 0.001) {
        return;
    }
    const seeked = waitForEvent(video, "seeked");
    video.currentTime = targetTime;
    await seeked;
}

function getPreviewTime(duration) {
    if (!Number.isFinite(duration) || duration <= 0) {
        return 0;
    }
    return clamp(duration * PREVIEW_SCRUB_RATIO, 0.01, Math.max(duration - 0.01, 0.01));
}

async function canvasToBlob(canvas, type = "image/png") {
    return new Promise((resolve, reject) => {
        canvas.toBlob((blob) => {
            if (blob == null) {
                reject(new Error("Canvas export failed"));
            } else {
                resolve(blob);
            }
        }, type, 1.0);
    });
}

async function drawBlobToCanvas(blob, canvas, ctx) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    if ("createImageBitmap" in window) {
        const bitmap = await createImageBitmap(blob);
        ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
        bitmap.close();
        return;
    }

    const objectUrl = URL.createObjectURL(blob);
    try {
        const image = new Image();
        const loaded = waitForEvent(image, "load");
        image.src = objectUrl;
        await loaded;
        ctx.drawImage(image, 0, 0, canvas.width, canvas.height);
    } finally {
        revokeObjectUrl(objectUrl);
    }
}

function getRecorderOptions() {
    if (typeof MediaRecorder === "undefined") {
        return null;
    }

    const candidates = [
        "video/webm;codecs=vp9",
        "video/webm;codecs=vp8",
        "video/webm",
        "video/mp4;codecs=h264",
        "video/mp4",
    ];

    for (const mimeType of candidates) {
        if (typeof MediaRecorder.isTypeSupported === "function" && MediaRecorder.isTypeSupported(mimeType)) {
            return { mimeType };
        }
    }

    return {};
}

function getExtensionForMimeType(mimeType) {
    if (mimeType != null && mimeType.includes("mp4")) {
        return "mp4";
    }
    return "webm";
}

function getBaseOutputName() {
    if (state.videoFile == null) {
        return "lego-mosaic-motion";
    }
    return state.videoFile.name.replace(/\.[^.]+$/, "") + "-lego-mosaic";
}

function wait(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
}

function waitForAnimationFrame() {
    return new Promise((resolve) => requestAnimationFrame(() => resolve()));
}

function getPieceTypeLabel(studShape) {
    if (studShape === "round-plate") {
        return "1x1 round plates";
    }
    if (studShape === "square-tile") {
        return "1x1 square tiles";
    }
    return "1x1 round tiles";
}

function getFrameFileName(baseName, frameNumber) {
    return `${baseName}-frame-${String(frameNumber).padStart(4, "0")}.png`;
}

function getRgbKey(r, g, b) {
    return (r << 16) | (g << 8) | b;
}

function buildPaletteIndexLookup(paletteColors) {
    const lookup = new Map();
    paletteColors.forEach((color, index) => {
        lookup.set(getRgbKey(color.r, color.g, color.b), index);
    });
    return lookup;
}

function summarizeCountsArray(counts, paletteColors) {
    return counts
        .map((count, colorIndex) => ({
            colorIndex,
            colorName: paletteColors[colorIndex].name,
            colorHex: paletteColors[colorIndex].hex,
            count,
        }))
        .filter((entry) => entry.count > 0)
        .sort((left, right) => right.count - left.count || left.colorName.localeCompare(right.colorName));
}

function buildFrameArtifact(pixels, settings, baseName, frameNumber, timeSeconds) {
    const paletteLookup = buildPaletteIndexLookup(settings.palette.colors);
    const counts = new Array(settings.palette.colors.length).fill(0);
    const paletteRuns = [];
    let currentColorIndex = -1;
    let currentRunLength = 0;

    for (let pixelIndex = 0; pixelIndex < pixels.length; pixelIndex += 4) {
        const colorIndex = paletteLookup.get(getRgbKey(pixels[pixelIndex], pixels[pixelIndex + 1], pixels[pixelIndex + 2])) ?? 0;
        counts[colorIndex] += 1;

        if (colorIndex === currentColorIndex) {
            currentRunLength += 1;
        } else {
            if (currentRunLength > 0) {
                paletteRuns.push([currentColorIndex, currentRunLength]);
            }
            currentColorIndex = colorIndex;
            currentRunLength = 1;
        }
    }

    if (currentRunLength > 0) {
        paletteRuns.push([currentColorIndex, currentRunLength]);
    }

    return {
        frameNumber,
        fileName: getFrameFileName(baseName, frameNumber),
        timeSeconds: Number(timeSeconds.toFixed(3)),
        pixels: new Uint8ClampedArray(pixels),
        counts,
        manifest: {
            frameNumber,
            timeSeconds: Number(timeSeconds.toFixed(3)),
            fileName: getFrameFileName(baseName, frameNumber),
            pieceCounts: summarizeCountsArray(counts, settings.palette.colors),
            paletteRuns,
        },
    };
}

function buildPieceSummary(frameArtifacts, paletteColors) {
    const overallCounts = new Array(paletteColors.length).fill(0);
    const peakCounts = new Array(paletteColors.length).fill(0);

    frameArtifacts.forEach((frameArtifact) => {
        frameArtifact.counts.forEach((count, colorIndex) => {
            overallCounts[colorIndex] += count;
            peakCounts[colorIndex] = Math.max(peakCounts[colorIndex], count);
        });
    });

    return {
        overallPlacements: summarizeCountsArray(overallCounts, paletteColors),
        peakFrameInventory: summarizeCountsArray(peakCounts, paletteColors),
        perFrame: frameArtifacts.map((frameArtifact) => ({
            frameNumber: frameArtifact.frameNumber,
            fileName: frameArtifact.fileName,
            timeSeconds: frameArtifact.timeSeconds,
            pieceCounts: summarizeCountsArray(frameArtifact.counts, paletteColors),
        })),
    };
}

function buildPieceListCsv(pieceSummary) {
    const lines = ["section,frame_number,file_name,time_seconds,color_index,color_name,color_hex,count"];

    const pushRows = (section, rows, frameArtifact = null) => {
        rows.forEach((row) => {
            lines.push(
                [
                    section,
                    frameArtifact ? frameArtifact.frameNumber : "",
                    frameArtifact ? frameArtifact.fileName : "",
                    frameArtifact ? frameArtifact.timeSeconds : "",
                    row.colorIndex,
                    `"${row.colorName.replace(/"/g, '""')}"`,
                    row.colorHex,
                    row.count,
                ].join(",")
            );
        });
    };

    pushRows("peak_frame_inventory", pieceSummary.peakFrameInventory);
    pushRows("overall_placements", pieceSummary.overallPlacements);
    pieceSummary.perFrame.forEach((frameArtifact) => {
        pushRows("frame", frameArtifact.pieceCounts, frameArtifact);
    });

    return lines.join("\n");
}

function buildInstructionsText(settings, frameArtifacts, pieceSummary, baseName, movieFileName, includesFrameImages) {
    const pieceType = getPieceTypeLabel(settings.studShape);
    const lines = [
        "LEGO Mosaic Motion Studio Export",
        "",
        `Project name: ${baseName}`,
        `Source file: ${state.videoFile ? state.videoFile.name : "unknown"}`,
        `Frame count: ${frameArtifacts.length}`,
        `Output grid: ${settings.width} x ${settings.height}`,
        `Render FPS: ${settings.fps}`,
        `Stud style: ${pieceType}`,
        `Palette: ${settings.palette.label}`,
        "",
        "Included files:",
        movieFileName ? `- renders/${movieFileName}: rendered silent motion video` : "- No rendered motion video in this package",
        includesFrameImages ? "- frames/: rendered PNG mosaic frames" : "- PNG frames were skipped for this package",
        "- project.json: full frame-by-frame project data for custom tools and Blender pipelines",
        "- piece-list.json: summary piece counts for the whole sequence and every frame",
        "- piece-list.csv: spreadsheet-friendly version of the piece counts",
        "- README.txt: this guide",
        "",
        "How to use the data:",
        "1. Use the PNG frames if you want ready-made image outputs for editing or compositing.",
        "2. Use peakFrameInventory in piece-list.json as the minimum inventory needed to rebuild the animation frame by frame.",
        "3. Use overallPlacements if you want the total number of stud placements across the whole clip.",
        "4. In project.json, each frame stores paletteRuns in row-major order from top-left to bottom-right.",
        "5. Expand each [colorIndex, runLength] pair into individual studs to rebuild the mosaic in Blender or another renderer.",
        "",
        "Suggested Blender import flow:",
        "1. Create a grid with one stud per cell.",
        "2. Read project.json and expand each frame's paletteRuns into a full color grid.",
        "3. Place or recolor your stud instances using palette.colors[colorIndex].",
        "4. Advance one frame in Blender for each exported mosaic frame.",
        "",
        "Piece highlights:",
        `- Peak frame inventory: ${pieceSummary.peakFrameInventory.length} colors used`,
        `- Most used color in peak inventory: ${pieceSummary.peakFrameInventory[0] ? `${pieceSummary.peakFrameInventory[0].colorName} (${pieceSummary.peakFrameInventory[0].count})` : "n/a"}`,
    ];

    return lines.join("\n");
}

function buildProjectManifest(settings, frameArtifacts, pieceSummary) {
    return {
        version: 1,
        generatedAt: new Date().toISOString(),
        app: "LEGO Mosaic Motion Studio",
        source: {
            fileName: state.videoFile ? state.videoFile.name : null,
            width: state.videoMeta ? state.videoMeta.width : null,
            height: state.videoMeta ? state.videoMeta.height : null,
            durationSeconds: state.videoMeta ? Number(state.videoMeta.duration.toFixed(3)) : null,
        },
        output: {
            width: settings.width,
            height: settings.height,
            fps: settings.fps,
            renderScale: settings.renderScale,
            studShape: settings.studShape,
            pieceType: getPieceTypeLabel(settings.studShape),
            frameCount: frameArtifacts.length,
        },
        framing: {
            preserveAspectRatio: elements.lockAspectInput.checked,
            zoom: settings.zoom,
            panX: settings.panX,
            panY: settings.panY,
        },
        look: {
            brightness: settings.brightness,
            contrast: settings.contrast,
            saturation: settings.saturation,
            dither: settings.dither,
        },
        frameEncoding: {
            type: "row-major-rle",
            origin: "top-left",
            order: "left-to-right then top-to-bottom",
        },
        palette: {
            key: settings.palette.key,
            label: settings.palette.label,
            colors: settings.palette.colors.map((color, colorIndex) => ({
                colorIndex,
                name: color.name,
                hex: color.hex,
                rgb: [color.r, color.g, color.b],
            })),
        },
        pieces: pieceSummary,
        frames: frameArtifacts.map((frameArtifact) => frameArtifact.manifest),
    };
}

function setRenderingState(isRendering) {
    state.isRendering = isRendering;
    elements.renderButton.disabled = isRendering || state.videoMeta == null;
    elements.refreshPreviewButton.disabled = isRendering || state.videoMeta == null;
    elements.videoInput.disabled = isRendering;
    interactiveControls.forEach((control) => {
        control.disabled = isRendering || (control === elements.heightInput && elements.lockAspectInput.checked);
    });
}

async function handleVideoSelection() {
    const file = elements.videoInput.files[0];
    if (file == null) {
        return;
    }

    clearOutputArtifacts();
    revokeObjectUrl(state.videoUrl);
    state.videoFile = file;
    state.videoUrl = URL.createObjectURL(file);
    state.videoMeta = null;
    setRenderingState(true);

    setStatus(elements.inputStatus, "Loading video and grabbing a preview frame...", false);
    setStatus(elements.renderStatus, "Preparing the first frame preview.", false);
    drawPlaceholder(sourcePreviewContext, elements.sourcePreviewCanvas, "Loading", "Decoding the first frame...");
    drawPlaceholder(mosaicPreviewContext, elements.mosaicPreviewCanvas, "Preview", "The mosaic preview will appear here.");

    try {
        const video = await loadVideoElement(state.videoUrl);
        await seekVideo(video, getPreviewTime(video.duration));

        state.videoMeta = {
            width: video.videoWidth,
            height: video.videoHeight,
            duration: video.duration,
        };

        state.firstFrameCanvas.width = video.videoWidth;
        state.firstFrameCanvas.height = video.videoHeight;
        state.firstFrameCanvas.getContext("2d").drawImage(video, 0, 0, video.videoWidth, video.videoHeight);

        syncHeightFromWidth();
        updateAspectLockUi();
        updateStats();
        setStatus(
            elements.inputStatus,
            `${file.name} • ${video.videoWidth} x ${video.videoHeight} • ${formatDuration(video.duration)}`,
            false
        );
        setStatus(
            elements.renderStatus,
            "First frame loaded. Adjust framing and palette, then render the motion clip.",
            false
        );
        setRenderingState(false);
        schedulePreviewRefresh();
    } catch (_error) {
        state.videoMeta = null;
        setStatus(elements.inputStatus, "This video could not be loaded. Try an MP4 or WebM clip.", true);
        setStatus(elements.renderStatus, "Rendering is unavailable until a valid source clip is loaded.", true);
        setRenderingState(false);
        drawPlaceholder(sourcePreviewContext, elements.sourcePreviewCanvas, "Load Failed", "Try a shorter MP4 or WebM video.");
        drawPlaceholder(mosaicPreviewContext, elements.mosaicPreviewCanvas, "Preview", "Load a valid clip to continue.");
    }
}

async function buildFrameArtifacts(video, settings, baseName) {
    const plannedFrames = getPlannedFrameCount();
    const frameArtifacts = [];

    for (let frameIndex = 0; frameIndex < plannedFrames; frameIndex++) {
        const currentTime = Math.min(frameIndex / settings.fps, Math.max(video.duration - 0.001, 0));
        await seekVideo(video, currentTime);
        const pixels = renderQuantizedFrame(video, state.videoMeta.width, state.videoMeta.height, settings);
        drawMosaicExportFrame(pixels, settings);
        const frameArtifact = buildFrameArtifact(pixels, settings, baseName, frameIndex + 1, currentTime);
        frameArtifact.pngBlob = settings.exportFrames ? await canvasToBlob(state.renderCanvas, "image/png") : null;
        frameArtifacts.push(frameArtifact);
        setProgress((frameIndex + 1) / plannedFrames * 0.7);
        setStatus(
            elements.renderStatus,
            `Processing frame ${frameIndex + 1} of ${plannedFrames}...`,
            false
        );
    }

    return frameArtifacts;
}

async function buildProjectZip(frameArtifacts, settings, baseName, movieBlob, movieFileName) {
    if (typeof window.JSZip === "undefined") {
        return null;
    }

    const zip = new JSZip();
    const pieceSummary = buildPieceSummary(frameArtifacts, settings.palette.colors);
    const projectManifest = buildProjectManifest(settings, frameArtifacts, pieceSummary);
    const instructionsText = buildInstructionsText(
        settings,
        frameArtifacts,
        pieceSummary,
        baseName,
        movieFileName,
        settings.exportFrames
    );

    if (movieBlob != null && movieFileName != null) {
        zip.file(`renders/${movieFileName}`, movieBlob);
    }

    if (settings.exportFrames) {
        frameArtifacts.forEach((frameArtifact) => {
            if (frameArtifact.pngBlob != null) {
                zip.file(`frames/${frameArtifact.fileName}`, frameArtifact.pngBlob);
            }
        });
    }

    zip.file("README.txt", instructionsText);
    zip.file("project.json", JSON.stringify(projectManifest, null, 2));
    zip.file("piece-list.json", JSON.stringify(pieceSummary, null, 2));
    zip.file("piece-list.csv", buildPieceListCsv(pieceSummary));

    return zip.generateAsync({ type: "blob" }, (metadata) => {
        setProgress(0.88 + metadata.percent / 100 * 0.12);
        setStatus(elements.renderStatus, `Packaging project ZIP... ${Math.round(metadata.percent)}%`, false);
    });
}

async function buildMotionVideo(frameArtifacts, settings) {
    const recorderOptions = getRecorderOptions();
    if (recorderOptions == null) {
        return null;
    }

    state.recordCanvas.width = settings.width * settings.renderScale;
    state.recordCanvas.height = settings.height * settings.renderScale;

    let stream = null;
    let videoTrack = null;
    let supportsManualFrames = false;
    try {
        stream = state.recordCanvas.captureStream(0);
        [videoTrack] = stream.getVideoTracks();
        supportsManualFrames = videoTrack != null && typeof videoTrack.requestFrame === "function";
        if (!supportsManualFrames) {
            stream.getTracks().forEach((track) => track.stop());
            stream = state.recordCanvas.captureStream(settings.fps);
            [videoTrack] = stream.getVideoTracks();
        }
    } catch (_error) {
        stream = state.recordCanvas.captureStream(settings.fps);
        [videoTrack] = stream.getVideoTracks();
    }
    const recorder = Object.keys(recorderOptions).length > 0 ? new MediaRecorder(stream, recorderOptions) : new MediaRecorder(stream);
    const chunks = [];
    let stopRequested = false;
    const frameDurationMs = 1000 / settings.fps;

    const finished = new Promise((resolve, reject) => {
        recorder.addEventListener("dataavailable", (event) => {
            if (event.data.size > 0) {
                chunks.push(event.data);
            }
        });
        recorder.addEventListener("stop", () => {
            resolve(new Blob(chunks, { type: recorder.mimeType || "video/webm" }));
        });
        recorder.addEventListener("error", () => {
            reject(new Error("Video recording failed"));
        });
    });

    if (frameArtifacts.length > 0) {
        paintMosaicFrame(
            recordContext,
            frameArtifacts[0].pixels,
            settings.width,
            settings.height,
            settings.renderScale,
            0,
            0,
            settings.studShape
        );
    }

    recorder.start(100);
    try {
        await waitForAnimationFrame();

        for (let index = 0; index < frameArtifacts.length; index++) {
            paintMosaicFrame(
                recordContext,
                frameArtifacts[index].pixels,
                settings.width,
                settings.height,
                settings.renderScale,
                0,
                0,
                settings.studShape
            );
            await waitForAnimationFrame();
            if (supportsManualFrames) {
                videoTrack.requestFrame();
            }
            setProgress(0.72 + ((index + 1) / frameArtifacts.length) * 0.16);
            setStatus(elements.renderStatus, `Encoding motion video ${index + 1} of ${frameArtifacts.length}...`, false);
            await wait(frameDurationMs);
        }
        await wait(Math.max(frameDurationMs, 120));
        stopRequested = true;
        recorder.stop();
        const movieBlob = await finished;
        return movieBlob;
    } finally {
        if (!stopRequested && recorder.state !== "inactive") {
            recorder.stop();
        }
        stream.getTracks().forEach((track) => track.stop());
    }
}

async function renderMotionClip() {
    if (state.videoMeta == null || state.videoUrl == null) {
        setStatus(elements.renderStatus, "Load a video before starting a render.", true);
        return;
    }

    const settings = getCurrentSettings();
    const plannedFrames = getPlannedFrameCount();
    const recorderOptions = getRecorderOptions();
    const canBuildProjectZip = typeof window.JSZip !== "undefined";

    if (plannedFrames > MAX_RENDER_FRAMES) {
        setStatus(
            elements.renderStatus,
            `This clip would render ${plannedFrames} frames. For now please keep it at ${MAX_RENDER_FRAMES} frames or less.`,
            true
        );
        return;
    }

    if (recorderOptions == null && !canBuildProjectZip) {
        setStatus(
            elements.renderStatus,
            "This browser cannot export the motion video here, and the project ZIP is unavailable.",
            true
        );
        return;
    }

    clearOutputArtifacts();
    setRenderingState(true);
    setProgress(0);
    setStatus(elements.renderStatus, "Starting the render pipeline...", false);

    try {
        const video = await loadVideoElement(state.videoUrl);
        const baseName = getBaseOutputName();
        const frameArtifacts = await buildFrameArtifacts(video, settings, baseName);
        let movieBlob = null;
        let zipBlob = null;
        let movieFileName = null;

        if (recorderOptions != null) {
            movieBlob = await buildMotionVideo(frameArtifacts, settings);
            const extension = getExtensionForMimeType(movieBlob.type || recorderOptions.mimeType || "");
            movieFileName = `${baseName}.${extension}`;
        }

        if (canBuildProjectZip) {
            zipBlob = await buildProjectZip(frameArtifacts, settings, baseName, movieBlob, movieFileName);
        }

        if (zipBlob != null) {
            state.zipUrl = URL.createObjectURL(zipBlob);
            elements.downloadZipLink.href = state.zipUrl;
            elements.downloadZipLink.download = `${baseName}-project.zip`;
            elements.downloadZipLink.hidden = false;
        }

        if (movieBlob != null) {
            state.outputVideoUrl = URL.createObjectURL(movieBlob);
            elements.downloadVideoLink.href = state.outputVideoUrl;
            elements.downloadVideoLink.download = movieFileName;
            elements.downloadVideoLink.hidden = false;
            elements.outputVideo.src = state.outputVideoUrl;
            elements.outputVideo.load();
        }

        setProgress(1);
        if (movieBlob != null && zipBlob != null) {
            setStatus(elements.renderStatus, "Render complete. The motion video and project ZIP are ready below.", false);
        } else if (movieBlob != null) {
            setStatus(elements.renderStatus, "Render complete. The motion video is ready below.", false);
        } else {
            setStatus(elements.renderStatus, "Export complete. The project ZIP is ready below.", false);
        }
    } catch (_error) {
        setStatus(
            elements.renderStatus,
            "The render failed. Try a shorter clip, a lower FPS, or a smaller mosaic size.",
            true
        );
        setProgress(0);
    } finally {
        setRenderingState(false);
        schedulePreviewRefresh();
    }
}

function handleControlInput(event) {
    if (event.target === elements.lockAspectInput) {
        updateAspectLockUi();
        syncHeightFromWidth();
    } else if (event.target === elements.widthInput && elements.lockAspectInput.checked) {
        syncHeightFromWidth();
    }

    if (!state.isRendering) {
        schedulePreviewRefresh();
    }
}

function init() {
    buildPaletteOptions();
    updateAspectLockUi();
    updateStats();

    if (typeof window.JSZip === "undefined") {
        elements.exportFramesInput.checked = false;
        elements.exportFramesInput.disabled = true;
    }

    drawPlaceholder(
        sourcePreviewContext,
        elements.sourcePreviewCanvas,
        "Source Frame",
        "Load a video to position the crop."
    );
    drawPlaceholder(
        mosaicPreviewContext,
        elements.mosaicPreviewCanvas,
        "Mosaic Preview",
        "The Lego preview will appear here."
    );

    elements.videoInput.addEventListener("change", handleVideoSelection);
    [
        elements.widthInput,
        elements.heightInput,
        elements.lockAspectInput,
        elements.fpsInput,
        elements.renderScaleInput,
        elements.zoomInput,
        elements.panXInput,
        elements.panYInput,
        elements.paletteInput,
        elements.ditherInput,
        elements.studShapeInput,
        elements.saturationInput,
        elements.brightnessInput,
        elements.contrastInput,
        elements.exportFramesInput,
    ].forEach((input) => {
        input.addEventListener("input", handleControlInput);
        input.addEventListener("change", handleControlInput);
    });

    elements.refreshPreviewButton.addEventListener("click", schedulePreviewRefresh);
    elements.renderButton.addEventListener("click", renderMotionClip);
}

init();
