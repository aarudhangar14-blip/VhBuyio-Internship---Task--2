const canvas = document.getElementById("canvas");
        const overlay = document.getElementById("overlay");
        const ctx = canvas.getContext("2d", { willReadFrequently: true });
        const octx = overlay.getContext("2d");

        const upload = document.getElementById("upload");
        const empty = document.getElementById("empty");
        const stage = document.getElementById("stage");
        const stack = document.getElementById("stack");
        const toast = document.getElementById("toast");

        const toolStatus = document.getElementById("toolStatus");
        const posStatus = document.getElementById("posStatus");
        const sizeStatus = document.getElementById("sizeStatus");

        const brushSize = document.getElementById("brushSize");
        const brushColor = document.getElementById("brushColor");
        const brushOpacity = document.getElementById("brushOpacity");
        const fillShapes = document.getElementById("fillShapes");

        const sizeValue = document.getElementById("sizeValue");
        const opacityValue = document.getElementById("opacityValue");

        const brightness = document.getElementById("brightness");
        const contrast = document.getElementById("contrast");
        const saturation = document.getElementById("saturation");
        const red = document.getElementById("red");
        const green = document.getElementById("green");
        const blue = document.getElementById("blue");

        const brightnessValue = document.getElementById("brightnessValue");
        const contrastValue = document.getElementById("contrastValue");
        const saturationValue = document.getElementById("saturationValue");
        const redValue = document.getElementById("redValue");
        const greenValue = document.getElementById("greenValue");
        const blueValue = document.getElementById("blueValue");

        const applyAdjustmentsButton = document.getElementById("applyAdjustments");
        const resetAdjustmentsButton = document.getElementById("resetAdjustments");
        const undoBtn = document.getElementById("undo");
        const redoBtn = document.getElementById("redo");
        const resetBtn = document.getElementById("reset");

        const rotateLeft = document.getElementById("rotateLeft");
        const rotateRight = document.getElementById("rotateRight");
        const flipH = document.getElementById("flipH");
        const flipV = document.getElementById("flipV");

        const download = document.getElementById("download");
        const format = document.getElementById("format");
        const zoomOut = document.getElementById("zoomOut");
        const zoomIn = document.getElementById("zoomIn");
        const zoomFit = document.getElementById("zoomFit");
        const zoomLabel = document.getElementById("zoomLabel");

        const workspaceUndo = document.getElementById("workspaceUndo");
        const workspaceRedo = document.getElementById("workspaceRedo");
        const workspaceFit = document.getElementById("workspaceFit");
        const workspaceActual = document.getElementById("workspaceActual");

        let imageLoaded = false;
        let originalImage = null;
        let currentTool = "brush";
        let drawing = false;
        let startPoint = null;
        let lastPoint = null;
        let zoom = 1;
        let history = [];
        let historyIndex = -1;
        const MAX_HISTORY = 30;

        function showToast(message) {
            toast.textContent = message;
            toast.classList.add("show");
            clearTimeout(showToast.timer);
            showToast.timer = setTimeout(() => {
                toast.classList.remove("show");
            }, 1800);
        }

        function clamp(value, min, max) {
            return Math.max(min, Math.min(max, value));
        }

        function hasImage() {
            if (!imageLoaded) {
                showToast("Please upload an image first.");
                return false;
            }
            return true;
        }

        function setCanvasSize(width, height) {
            canvas.width = width;
            canvas.height = height;
            overlay.width = width;
            overlay.height = height;
            updateCanvasDisplay();
        }

        function updateCanvasDisplay() {
            stack.style.width = `${canvas.width * zoom}px`;
            stack.style.height = `${canvas.height * zoom}px`;
            canvas.style.width = `${canvas.width * zoom}px`;
            canvas.style.height = `${canvas.height * zoom}px`;
            overlay.style.width = `${canvas.width * zoom}px`;
            overlay.style.height = `${canvas.height * zoom}px`;
            zoomLabel.textContent = `${Math.round(zoom * 100)}%`;
        }

        function clearOverlay() {
            octx.clearRect(0, 0, overlay.width, overlay.height);
        }

        function updateStatus() {
            toolStatus.textContent = `Tool: ${currentTool.charAt(0).toUpperCase()}${currentTool.slice(1)}`;
            if (imageLoaded) {
                sizeStatus.textContent = `${canvas.width} × ${canvas.height}`;
            } else {
                sizeStatus.textContent = "No image loaded";
            }
            undoBtn.disabled = historyIndex <= 0;
            redoBtn.disabled = historyIndex >= history.length - 1;
        }

        function resetAdjustments() {
            const values = [
                [brightness, brightnessValue],
                [contrast, contrastValue],
                [saturation, saturationValue],
                [red, redValue],
                [green, greenValue],
                [blue, blueValue]
            ];

            values.forEach(([input, output]) => {
                input.value = 0;
                output.textContent = "0";
            });
        }

        function loadImageFile(file) {
            if (!file || !file.type.startsWith("image/")) {
                showToast("Please select a valid image file.");
                return;
            }

            const reader = new FileReader();
            reader.onload = event => {
                const img = new Image();
                img.onload = () => {
                    const MAX_SIZE = 2200;
                    let width = img.naturalWidth;
                    let height = img.naturalHeight;
                    if (Math.max(width, height) > MAX_SIZE) {
                        const scale = MAX_SIZE / Math.max(width, height);
                        width = Math.round(width * scale);
                        height = Math.round(height * scale);
                    }

                    setCanvasSize(width, height);
                    ctx.clearRect(0, 0, canvas.width, canvas.height);
                    ctx.globalAlpha = 1;
                    ctx.globalCompositeOperation = "source-over";
                    ctx.drawImage(img, 0, 0, width, height);
                    originalImage = document.createElement("canvas");
                    originalImage.width = width;
                    originalImage.height = height;
                    const originalContext = originalImage.getContext("2d");
                    originalContext.drawImage(canvas, 0, 0);
                    imageLoaded = true;
                    empty.classList.add("hidden");
                    resetAdjustments();
                    history = [];
                    historyIndex = -1;
                    saveHistory();
                    zoomFitToScreen();
                    updateStatus();
                    showToast("Image loaded successfully.");
                };

                img.onerror = () => {
                    showToast("Unable to load this image.");
                };
                img.src = event.target.result;
            };
            reader.readAsDataURL(file);
        }

        upload.addEventListener("change", event => {
            const file = event.target.files[0];
            if (file) {
                loadImageFile(file);
            }
            upload.value = "";
        });

        document.querySelectorAll(".tool").forEach(button => {
            button.addEventListener("click", () => {
                document.querySelectorAll(".tool").forEach(item => {
                    item.classList.remove("active");
                    item.setAttribute("aria-pressed", "false");
                });
                button.classList.add("active");
                button.setAttribute("aria-pressed", "true");
                currentTool = button.dataset.tool;
                updateStatus();
                clearOverlay();
                if (currentTool === "crop") {
                    overlay.style.cursor = "crosshair";
                } else {
                    overlay.style.cursor = "crosshair";
                }
            });
        });

        brushSize.addEventListener("input", () => {
            sizeValue.textContent = `${brushSize.value} px`;
        });

        brushOpacity.addEventListener("input", () => {
            opacityValue.textContent = `${brushOpacity.value}%`;
        });

        function getCanvasPoint(event) {
            const rect = overlay.getBoundingClientRect();
            const scaleX = canvas.width / rect.width;
            const scaleY = canvas.height / rect.height;
            return {
                x: clamp((event.clientX - rect.left) * scaleX, 0, canvas.width),
                y: clamp((event.clientY - rect.top) * scaleY, 0, canvas.height)
            };
        }

        function setupDrawingContext() {
            ctx.lineWidth = Number(brushSize.value);
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalAlpha = Number(brushOpacity.value) / 100;
            ctx.strokeStyle = brushColor.value;
            ctx.fillStyle = brushColor.value;
        }

        function drawBrush(from, to) {
            setupDrawingContext();
            ctx.globalCompositeOperation = "source-over";
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
        }

        function drawEraser(from, to) {
            setupDrawingContext();
            ctx.globalCompositeOperation = "destination-out";
            ctx.beginPath();
            ctx.moveTo(from.x, from.y);
            ctx.lineTo(to.x, to.y);
            ctx.stroke();
            ctx.globalCompositeOperation = "source-over";
        }

        function drawShapePreview(from, to) {
            clearOverlay();
            octx.save();
            octx.lineWidth = Number(brushSize.value);
            octx.globalAlpha = Number(brushOpacity.value) / 100;
            octx.strokeStyle = brushColor.value;
            octx.fillStyle = brushColor.value;
            octx.lineCap = "round";
            octx.lineJoin = "round";
            if (currentTool === "line") {
                octx.beginPath();
                octx.moveTo(from.x, from.y);
                octx.lineTo(to.x, to.y);
                octx.stroke();
            }

            if (currentTool === "rectangle") {
                const x = Math.min(from.x, to.x);
                const y = Math.min(from.y, to.y);
                const width = Math.abs(to.x - from.x);
                const height = Math.abs(to.y - from.y);
                if (fillShapes.checked) {
                    octx.fillRect(x, y, width, height);
                }
                octx.strokeRect(x, y, width, height);
            }

            if (currentTool === "ellipse") {
                const centerX = (from.x + to.x) / 2;
                const centerY = (from.y + to.y) / 2;
                const radiusX = Math.abs(to.x - from.x) / 2;
                const radiusY = Math.abs(to.y - from.y) / 2;
                octx.beginPath();
                octx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                if (fillShapes.checked) {
                    octx.fill();
                }
                octx.stroke();
            }

            if (currentTool === "crop") {
                const x = Math.min(from.x, to.x);
                const y = Math.min(from.y, to.y);
                const width = Math.abs(to.x - from.x);
                const height = Math.abs(to.y - from.y);
                octx.fillStyle = "rgba(37, 99, 235, .12)";
                octx.fillRect(x, y, width, height);
                octx.strokeStyle = "#2563eb";
                octx.lineWidth = 2;
                octx.setLineDash([7, 5]);
                octx.strokeRect(x, y, width, height);
                octx.setLineDash([]);
            }
            octx.restore();
        }

        function drawFinalShape(from, to) {
            ctx.save();
            ctx.lineWidth = Number(brushSize.value);
            ctx.globalAlpha = Number(brushOpacity.value) / 100;
            ctx.strokeStyle = brushColor.value;
            ctx.fillStyle = brushColor.value;
            ctx.lineCap = "round";
            ctx.lineJoin = "round";
            ctx.globalCompositeOperation = "source-over";
            if (currentTool === "line") {
                ctx.beginPath();
                ctx.moveTo(from.x, from.y);
                ctx.lineTo(to.x, to.y);
                ctx.stroke();
            }

            if (currentTool === "rectangle") {
                const x = Math.min(from.x, to.x);
                const y = Math.min(from.y, to.y);
                const width = Math.abs(to.x - from.x);
                const height = Math.abs(to.y - from.y);
                if (fillShapes.checked) {
                    ctx.fillRect(x, y, width, height);
                }
                ctx.strokeRect(x, y, width, height);
            }

            if (currentTool === "ellipse") {
                const centerX = (from.x + to.x) / 2;
                const centerY = (from.y + to.y) / 2;
                const radiusX = Math.abs(to.x - from.x) / 2;
                const radiusY = Math.abs(to.y - from.y) / 2;
                ctx.beginPath();
                ctx.ellipse(centerX, centerY, radiusX, radiusY, 0, 0, Math.PI * 2);
                if (fillShapes.checked) {
                    ctx.fill();
                }
                ctx.stroke();
            }
            ctx.restore();
        }

        overlay.addEventListener("pointerdown", event => {
            if (!hasImage()) {
                return;
            }
            drawing = true;
            overlay.setPointerCapture(event.pointerId);
            startPoint = getCanvasPoint(event);
            lastPoint = startPoint;
            if (currentTool === "brush") {
                drawBrush(startPoint, startPoint);
            }
            if (currentTool === "eraser") {
                drawEraser(startPoint, startPoint);
            }
            if ( currentTool === "line" || currentTool === "rectangle" || currentTool === "ellipse" || currentTool === "crop" ) {
                drawShapePreview(startPoint, startPoint);
            }
        });

        overlay.addEventListener("pointermove", event => {
            if (!imageLoaded) {
                return;
            }
            const point = getCanvasPoint(event);
            posStatus.textContent = `${Math.round(point.x)} × ${Math.round(point.y)}`;
            if (!drawing) {
                return;
            }
            if (currentTool === "brush") {
                drawBrush(lastPoint, point);
                lastPoint = point;
            }
            if (currentTool === "eraser") {
                drawEraser(lastPoint, point);
                lastPoint = point;
            }
            if ( currentTool === "line" || currentTool === "rectangle" || currentTool === "ellipse" || currentTool === "crop" ) {
                drawShapePreview(startPoint, point);
            }
        });

        overlay.addEventListener("pointerup", event => {
            if (!drawing) {
                return;
            }
            drawing = false;
            const endPoint = getCanvasPoint(event);
            if ( currentTool === "line" || currentTool === "rectangle" || currentTool === "ellipse" ) {
                drawFinalShape(startPoint, endPoint);
                saveHistory();
            }
            if (currentTool === "crop") {
                cropImage(startPoint, endPoint);
            }
            if (currentTool === "brush" || currentTool === "eraser") {
                saveHistory();
            }
            clearOverlay();
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
        });

        overlay.addEventListener("pointercancel", () => {
            drawing = false;
            clearOverlay();
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
        });

        overlay.addEventListener("pointerleave", () => {
            posStatus.textContent = "—";
        });

        function cropImage(from, to) {
            let x = Math.round(Math.min(from.x, to.x));
            let y = Math.round(Math.min(from.y, to.y));
            let width = Math.round(Math.abs(to.x - from.x));
            let height = Math.round(Math.abs(to.y - from.y));
            if (width < 2 || height < 2) {
                return;
            }
            x = clamp(x, 0, canvas.width);
            y = clamp(y, 0, canvas.height);
            width = Math.min(width, canvas.width - x);
            height = Math.min(height, canvas.height - y);
            if (width <= 0 || height <= 0) {
                return;
            }
            const temp = document.createElement("canvas");
            temp.width = width;
            temp.height = height;
            const tctx = temp.getContext("2d");
            tctx.drawImage( canvas, x, y, width, height, 0, 0, width, height );
            setCanvasSize(width, height);
            ctx.clearRect(0, 0, width, height);
            ctx.drawImage(temp, 0, 0);
            saveHistory();
            updateStatus();
            showToast("Image cropped successfully.");
        }

        function saveHistory() {
            if (!imageLoaded) {
                return;
            }
            const state = ctx.getImageData( 0, 0, canvas.width, canvas.height );
            if (historyIndex < history.length - 1) {
                history = history.slice(0, historyIndex + 1);
            }
            history.push({
                width: canvas.width,
                height: canvas.height,
                data: state
            });
            if (history.length > MAX_HISTORY) {
                history.shift();
            }
            historyIndex = history.length - 1;
            updateStatus();
        }

        function restoreHistory(index) {
            if (index < 0 || index >= history.length) {
                return;
            }
            const state = history[index];
            setCanvasSize(state.width, state.height);
            ctx.globalAlpha = 1;
            ctx.globalCompositeOperation = "source-over";
            ctx.putImageData(state.data, 0, 0);
            clearOverlay();
            historyIndex = index;
            resetAdjustments();
            updateStatus();
        }

        undoBtn.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            if (historyIndex > 0) {
                historyIndex--;
                restoreHistory(historyIndex);
                showToast("Undo");
            }
        });

        redoBtn.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            if (historyIndex < history.length - 1) {
                historyIndex++;
                restoreHistory(historyIndex);
                showToast("Redo");
            }
        });

        function updateAdjustmentOutputs() {
            brightnessValue.textContent = brightness.value;
            contrastValue.textContent = contrast.value;
            saturationValue.textContent = saturation.value;
            redValue.textContent = red.value;
            greenValue.textContent = green.value;
            blueValue.textContent = blue.value;
        }

        [
            [brightness, brightnessValue],
            [contrast, contrastValue],
            [saturation, saturationValue],
            [red, redValue],
            [green, greenValue],
            [blue, blueValue]
        ].forEach(([input, output]) => {
            input.addEventListener("input", () => {
                output.textContent = input.value;
            });
        });

        function applyAdjustments() {
            if (!hasImage()) {
                return;
            }
            const imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
            const data = imageData.data;
            const brightnessAmount = Number(brightness.value) * 2.55;
            const contrastAmount = Number(contrast.value);
            const saturationAmount = Number(saturation.value) / 100;
            const contrastFactor = (259 * (contrastAmount + 255)) / (255 * (259 - contrastAmount));
            const redAmount = Number(red.value) * 2.55;
            const greenAmount = Number(green.value) * 2.55;
            const blueAmount = Number(blue.value) * 2.55;
            for (let i = 0; i < data.length; i += 4) {
                let r = data[i];
                let g = data[i + 1];
                let b = data[i + 2];
                r += brightnessAmount;
                g += brightnessAmount;
                b += brightnessAmount;
                r = contrastFactor * (r - 128) + 128;
                g = contrastFactor * (g - 128) + 128;
                b = contrastFactor * (b - 128) + 128;
                if (saturationAmount !== 0) {
                    const gray = 0.299 * r + 0.587 * g + 0.114 * b;
                    r = gray + (r - gray) * (1 + saturationAmount);
                    g = gray + (g - gray) * (1 + saturationAmount);
                    b = gray + (b - gray) * (1 + saturationAmount);
                }
                r += redAmount;
                g += greenAmount;
                b += blueAmount;
                data[i] = clamp(r, 0, 255);
                data[i + 1] = clamp(g, 0, 255);
                data[i + 2] = clamp(b, 0, 255);
            }
            ctx.putImageData(imageData, 0, 0);
            resetAdjustments();
            saveHistory();
            showToast("Color adjustments applied.");
        }

        applyAdjustmentsButton.addEventListener("click", applyAdjustments);
        resetAdjustmentsButton.addEventListener("click", () => {
            resetAdjustments();
            showToast("Adjustment controls cleared.");
        });

        document.querySelectorAll("[data-filter]").forEach(button => {
            button.addEventListener("click", () => {
                if (!hasImage()) {
                    return;
                }
                applyFilter(button.dataset.filter);
                saveHistory();
                showToast(`${button.textContent.trim()} applied.`);
            });
        });

        function applyFilter(type) {
            if (type === "blur") {
                applyCanvasFilter("blur(4px)");
                return;
            }
            if (type === "sharpen") {
                sharpenImage();
                return;
            }
            const imageData = ctx.getImageData( 0, 0, canvas.width, canvas.height );
            const data = imageData.data;
            if (type === "grayscale") {
                for (let i = 0; i < data.length; i += 4) {
                    const gray = 0.299 * data[i] + 0.587 * data[i + 1] + 0.114 * data[i + 2];
                    data[i] = gray;
                    data[i + 1] = gray;
                    data[i + 2] = gray;
                }
            }
            if (type === "invert") {
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = 255 - data[i];
                    data[i + 1] = 255 - data[i + 1];
                    data[i + 2] = 255 - data[i + 2];
                }
            }
            if (type === "sepia") {
                for (let i = 0; i < data.length; i += 4) {
                    const r = data[i];
                    const g = data[i + 1];
                    const b = data[i + 2];
                    data[i] = clamp( r * .393 + g * .769 + b * .189, 0, 255 );
                    data[i + 1] = clamp( r * .349 + g * .686 + b * .168, 0, 255 );
                    data[i + 2] = clamp( r * .272 + g * .534 + b * .131, 0, 255 );
                }
            }

            if (type === "contrast-boost") {
                const factor = 1.35;
                for (let i = 0; i < data.length; i += 4) {
                    data[i] = clamp( (data[i] - 128) * factor + 128, 0, 255 );
                    data[i + 1] = clamp( (data[i + 1] - 128) * factor + 128, 0, 255 );
                    data[i + 2] = clamp( (data[i + 2] - 128) * factor + 128, 0, 255 );
                }
            }
            ctx.putImageData(imageData, 0, 0);
        }

        function applyCanvasFilter(filter) {
            const temp = document.createElement("canvas");
            temp.width = canvas.width;
            temp.height = canvas.height;
            const tctx = temp.getContext("2d");
            tctx.filter = filter;
            tctx.drawImage(canvas, 0, 0);
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(temp, 0, 0);
        }

        function sharpenImage() {
            const source = ctx.getImageData( 0, 0, canvas.width, canvas.height );
            const src = source.data;
            const width = canvas.width;
            const height = canvas.height;
            const output = new ImageData(width, height);
            const dst = output.data;
            const kernel = [
                0, -1, 0,
                -1, 5, -1,
                0, -1, 0
              ];

            for (let y = 0; y < height; y++) {
                for (let x = 0; x < width; x++) {
                    const outputIndex = (y * width + x) * 4;
                    if ( x === 0 || y === 0 || x === width - 1 || y === height - 1 ) {
                        dst[outputIndex] = src[outputIndex];
                        dst[outputIndex + 1] = src[outputIndex + 1];
                        dst[outputIndex + 2] = src[outputIndex + 2];
                        dst[outputIndex + 3] = src[outputIndex + 3];
                        continue;
                    }

                    let r = 0;
                    let g = 0;
                    let b = 0;
                    let kernelIndex = 0;
                    for (let ky = -1; ky <= 1; ky++) {
                        for (let kx = -1; kx <= 1; kx++) {
                            const index = ((y + ky) * width + (x + kx)) * 4;
                            const weight = kernel[kernelIndex++];
                            r += src[index] * weight;
                            g += src[index + 1] * weight;
                            b += src[index + 2] * weight;
                        }
                    }

                    dst[outputIndex] = clamp(r, 0, 255);
                    dst[outputIndex + 1] = clamp(g, 0, 255);
                    dst[outputIndex + 2] = clamp(b, 0, 255);
                    dst[outputIndex + 3] = src[outputIndex + 3];
                }
            }
            ctx.putImageData(output, 0, 0);
        }

        rotateLeft.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            rotateImage(-90);
            saveHistory();
            showToast("Rotated left.");
        });

        rotateRight.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            rotateImage(90);
            saveHistory();
            showToast("Rotated right.");
        });

        function rotateImage(degrees) {
            const oldWidth = canvas.width;
            const oldHeight = canvas.height;
            const temp = document.createElement("canvas");
            temp.width = oldHeight;
            temp.height = oldWidth;
            const tctx = temp.getContext("2d");
            tctx.translate( temp.width / 2, temp.height / 2 );
            tctx.rotate( degrees * Math.PI / 180 );
            tctx.drawImage( canvas, -oldWidth / 2, -oldHeight / 2 );
            setCanvasSize( temp.width, temp.height );
            ctx.drawImage(temp, 0, 0);
        }

        flipH.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            flipImage(true);
            saveHistory();
            showToast("Flipped horizontally.");
        });

        flipV.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            flipImage(false);
            saveHistory();
            showToast("Flipped vertically.");
        });

        function flipImage(horizontal) {
            const temp = document.createElement("canvas");
            temp.width = canvas.width;
            temp.height = canvas.height;
            const tctx = temp.getContext("2d");
            if (horizontal) {
                tctx.translate(canvas.width, 0);
                tctx.scale(-1, 1);
            } else {
                tctx.translate(0, canvas.height);
                tctx.scale(1, -1);
            }
            tctx.drawImage(canvas, 0, 0);
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage(temp, 0, 0);
        }

        resetBtn.addEventListener("click", () => {
            if (!hasImage()) {
                return;
            }
            if (!originalImage) {
                return;
            }
            setCanvasSize( originalImage.width, originalImage.height );
            ctx.clearRect( 0, 0, canvas.width, canvas.height );
            ctx.drawImage( originalImage, 0, 0 );
            resetAdjustments();
            history = [];
            historyIndex = -1;
            saveHistory();
            zoomFitToScreen();
            showToast("Image restored to original.");
        });

        download.addEventListener("click", exportImage);
        function exportImage() {
            if (!hasImage()) {
                return;
            }
            const selected = format.value;
            let mime;
            let extension;
            let quality;
            if (selected === "jpeg") {
                mime = "image/jpeg";
                extension = "jpg";
                quality = .92;
            }
            if (selected === "webp") {
                mime = "image/webp";
                extension = "webp";
                quality = .92;
            }
            if (selected === "png") {
                mime = "image/png";
                extension = "png";
                quality = undefined;
            }

            let exportCanvas = canvas;
            if (selected === "jpeg") {
                exportCanvas = document.createElement("canvas");
                exportCanvas.width = canvas.width;
                exportCanvas.height = canvas.height;
                const ectx = exportCanvas.getContext("2d");
                ectx.fillStyle = "#ffffff";
                ectx.fillRect( 0, 0, exportCanvas.width, exportCanvas.height );
                ectx.drawImage(canvas, 0, 0);
            }
            const dataURL = exportCanvas.toDataURL( mime, quality );
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = `edited-image-${Date.now()}.${extension}`;
            document.body.appendChild(link);
            link.click();
            link.remove();
            showToast(`Downloaded as ${extension.toUpperCase()}.`);
        }

        function setZoom(value) {
            zoom = clamp(value, .1, 4);
            updateCanvasDisplay();
        }
        zoomIn.addEventListener("click", () => {
            setZoom(zoom + .1);
        });
        zoomOut.addEventListener("click", () => {
            setZoom(zoom - .1);
        });
        zoomFit.addEventListener("click", zoomFitToScreen);

        function zoomFitToScreen() {
            if (!imageLoaded) {
                return;
            }
            const padding = 75;
            const availableWidth = stage.clientWidth - padding;
            const availableHeight = stage.clientHeight - padding;
            const scaleX = availableWidth / canvas.width;
            const scaleY = availableHeight / canvas.height;
            const fit = Math.min( scaleX, scaleY, 1 );
            setZoom( Math.max(.1, fit) );
        }

        workspaceUndo.addEventListener("click", () => {
            undoBtn.click();
        });
        workspaceRedo.addEventListener("click", () => {
            redoBtn.click();
        });
        workspaceFit.addEventListener("click", () => {
            zoomFitToScreen();
        });
        workspaceActual.addEventListener("click", () => {
            if (imageLoaded) {
                setZoom(1);
            }
        });

        document.addEventListener("dragover", event => {
            event.preventDefault();
        });

        document.addEventListener("drop", event => {
            event.preventDefault();
            const file = event.dataTransfer.files[0];
            if (file) {
                loadImageFile(file);
            }
        });

        document.addEventListener("paste", event => {
            if (!event.clipboardData) {
                return;
            }
            const items = event.clipboardData.items;
            for (const item of items) {
                if (item.type.startsWith("image/")) {
                    const file = item.getAsFile();
                    if (file) {
                        loadImageFile(file);
                    }
                    break;
                }
            }
        });

        document.querySelectorAll(".menu > button").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                const parent = button.parentElement;
                document.querySelectorAll(".menu").forEach(menu => {
                    if (menu !== parent) {
                        menu.classList.remove("open");
                    }
                });
                parent.classList.toggle("open");
            });
        });

        document.addEventListener("click", () => {
            document.querySelectorAll(".menu").forEach(menu => {
                menu.classList.remove("open");
            });
        });

        document.querySelectorAll("[data-action]").forEach(button => {
            button.addEventListener("click", event => {
                event.stopPropagation();
                const action = button.dataset.action;
                if (action === "open") {
                    upload.click();
                }
                if (action === "download") {
                    exportImage();
                }
                if (action === "undo") {
                    undoBtn.click();
                }
                if (action === "redo") {
                    redoBtn.click();
                }
                if (action === "reset") {
                    resetBtn.click();
                }
                if (action === "rotate-left") {
                    rotateLeft.click();
                }
                if (action === "rotate-right") {
                    rotateRight.click();
                }
                if (action === "flip-h") {
                    flipH.click();
                }
                if (action === "flip-v") {
                    flipV.click();
                }
                if ( action === "grayscale" || action === "invert" || action === "sepia" || action === "blur" || action === "sharpen" ) {
                    const filterButton = document.querySelector( `[data-filter="${action}"]` );
                    if (filterButton) {
                        filterButton.click();
                    }
                }
                document.querySelectorAll(".menu").forEach(menu => {
                    menu.classList.remove("open");
                });
            });
        });

        function selectTool(tool) {
            const button = document.querySelector( `.tool[data-tool="${tool}"]` );
            if (button) {
                button.click();
            }
        }

        document.addEventListener("keydown", event => {
            const key = event.key.toLowerCase();
            if ( (event.ctrlKey || event.metaKey) && key === "o" ) {
                event.preventDefault();
                upload.click();
                return;
            }
            if ( (event.ctrlKey || event.metaKey) && key === "z" ) {
                event.preventDefault();
                if (event.shiftKey) {
                    redoBtn.click();
                } else {
                    undoBtn.click();
                }
                return;
            }

            if ( (event.ctrlKey || event.metaKey) && key === "y" ) {
                event.preventDefault();
                redoBtn.click();
                return;
            }
            if ( (event.ctrlKey || event.metaKey) && key === "s" ) {
                event.preventDefault();
                exportImage();
                return;
            }
            if ( event.target.matches("input, textarea, select") ) {
                return;
            }
            if (key === "b") {
                selectTool("brush");
            }
            if (key === "e") {
                selectTool("eraser");
            }
            if (key === "l") {
                selectTool("line");
            }
            if (key === "r") {
                selectTool("rectangle");
            }
            if (key === "c") {
                selectTool("crop");
            }
        });

        window.addEventListener("resize", () => {
            if (!imageLoaded) {
                return;
            }
            if (zoom < .3) {
                zoomFitToScreen();
            }
        });
        canvas.width = 800;
        canvas.height = 500;
        overlay.width = 800;
        overlay.height = 500;
        ctx.clearRect( 0, 0, canvas.width, canvas.height );
        clearOverlay();
        setZoom(1);
        empty.classList.remove("hidden");
        updateAdjustmentOutputs();
        updateStatus();