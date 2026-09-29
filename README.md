# 🎨 Image Editor Studio

A lightweight, browser-based image editor inspired by modern desktop photo-editing applications, built entirely with **HTML5, CSS3, and Vanilla JavaScript**.

The application uses the **HTML5 Canvas API** to load, display, edit, manipulate, and export images directly inside the browser without external frameworks, libraries, packages, or backend services.

> 🖼️ **Edit images directly in your browser — simple, fast, private, and dependency-free.**

---

## ✨ Features

### 🖼️ Image Import

* Upload JPG, JPEG, PNG, GIF, WebP, and other browser-supported image formats.
* Drag and drop images directly into the editor.
* Paste images from the clipboard using `Ctrl + V`.
* Automatically scales very large images for efficient browser editing.
* Displays the image on an HTML5 Canvas.

### 🛠️ Drawing Tools

The editor provides multiple canvas-based drawing tools:

* ✏️ Brush
* 🧽 Eraser
* 📏 Line
* ▭ Rectangle
* ◯ Ellipse
* ✂️ Crop

### 🎨 Brush Controls

* Adjustable brush size.
* Adjustable opacity.
* Custom color selection.
* Rounded brush strokes.
* Real-time drawing interaction.
* Fill option for rectangle and ellipse shapes.

### 🧽 Eraser

The eraser uses the Canvas compositing API to remove image content:

```javascript
globalCompositeOperation = "destination-out";
```

This allows transparent areas to be created directly on the canvas.

### ✂️ Crop

The crop tool allows users to:

1. Select a rectangular region.
2. Preview the selected region.
3. Crop the image to the selected area.
4. Continue editing the cropped image.

### ☀️ Image Adjustments

The editor supports:

* ☀️ Brightness
* ◐ Contrast
* 🌈 Saturation
* 🔴 Red tint
* 🟢 Green tint
* 🔵 Blue tint

RGB adjustments are performed using Canvas pixel manipulation.

### 🎨 Filters

Available filters include:

* ⚫ Grayscale
* 🔄 Invert
* 🟤 Sepia
* 🌫️ Blur
* ✨ Sharpen
* 💥 Contrast Boost / Punch

### 🔄 Transform

Images can be transformed using:

* ↺ Rotate left
* ↻ Rotate right
* ⇋ Flip horizontal
* ⇅ Flip vertical

### 🔍 Zoom

The workspace provides:

* Zoom in
* Zoom out
* Fit image to workspace
* Current zoom percentage

### ↶ Undo / Redo

The editor maintains a history of image states so users can:

* Undo previous operations.
* Redo undone operations.
* Restore previous canvas dimensions.
* Recover earlier editing states.

### ♻️ Reset

Reset restores the image to its original uploaded state and resets the adjustment controls.

### 💾 Export

The editor supports:

* PNG
* JPEG
* WebP

PNG export uses the Canvas API:

```javascript
canvas.toDataURL("image/png");
```

JPEG and WebP use the same `toDataURL()` mechanism with their respective MIME types.

### 🌙 Theme

The interface supports:

* ☀️ Light theme
* 🌙 Dark theme

The selected theme is saved using browser `localStorage`.

### ⌨️ Keyboard Shortcuts

| Shortcut           | Action    |
| ------------------ | --------- |
| `B`                | Brush     |
| `E`                | Eraser    |
| `L`                | Line      |
| `R`                | Rectangle |
| `C`                | Crop      |
| `Ctrl + Z`         | Undo      |
| `Ctrl + Shift + Z` | Redo      |
| `Ctrl + Y`         | Redo      |
| `Ctrl + S`         | Download  |

On macOS, `Command` is supported for the common command shortcuts.

---

# 🧰 Technology Stack

| Technology           | Purpose                                  |
| -------------------- | ---------------------------------------- |
| HTML5                | Application structure                    |
| CSS3                 | UI, layout, responsive design and themes |
| Vanilla JavaScript   | Application logic                        |
| HTML5 Canvas API     | Image rendering and editing              |
| Canvas ImageData API | Pixel-level image manipulation           |
| FileReader API       | Local image loading                      |
| Drag & Drop API      | Image drag-and-drop                      |
| Clipboard API        | Clipboard image support                  |
| LocalStorage API     | Theme persistence                        |

## 🚫 No External Dependencies

This project does not require:

* React
* Vue
* Angular
* jQuery
* Bootstrap
* Tailwind CSS
* Fabric.js
* Konva.js
* Cropper.js
* OpenCV
* npm packages
* External JavaScript libraries
* Backend services

Everything runs directly in the browser.

---

# 🏗️ Project Structure

```text
image-editor/
│
├── index.html
└── README.md
```

The application can be implemented as a single HTML file containing:

* HTML structure
* CSS styling
* JavaScript logic

---

# 🚀 Getting Started

## 1. Download the Project

Download or clone the project files to your computer.

```bash
git clone <repository-url>
```

Then open the project directory.

## 2. Open the Application

No installation or package manager is required.

Simply open:

```text
index.html
```

in a modern web browser.

---

# 🖥️ Application Interface

The editor provides a professional workspace containing:

```text
┌──────────────────────────────────────────────────────────────┐
│ 🖌️ Image Editor                         🌙  Upload Image     │
├────────────────┬─────────────────────────────────────────────┤
│                │                                             │
│ 🛠️ TOOLS       │                                             │
│                │                                             │
│ ✏️ Brush       │                                             │
│ 🧽 Eraser      │             🖼️ IMAGE CANVAS                 │
│ 📏 Line        │                                             │
│ ▭ Rectangle    │                                             │
│ ◯ Ellipse      │                                             │
│ ✂️ Crop        │                                             │
│                │                                             │
├────────────────┴─────────────────────────────────────────────┤
│ Adjustments │ Filters │ Transform │ Export │ Zoom            │
└──────────────────────────────────────────────────────────────┘
```

---

# 📖 How to Use

## 🖼️ 1. Upload an Image

Click **Upload image** and select an image.

You can also:

* Drag and drop an image into the editor.
* Copy an image and press `Ctrl + V`.

---

## ✏️ 2. Draw

Select **Brush** and configure:

* Color
* Brush size
* Opacity

Then draw directly over the image.

---

## 🧽 3. Erase

Select **Eraser** and drag over the image to remove areas.

---

## 🔷 4. Draw Shapes

Available tools:

* Line
* Rectangle
* Ellipse

Enable **Fill shapes** for filled rectangles and ellipses.

---

## ✂️ 5. Crop

Select **Crop**, drag over the required image area, and release the pointer to apply the crop.

---

## 🎨 6. Adjust Colors

Use the adjustment sliders for:

* Brightness
* Contrast
* Saturation
* Red
* Green
* Blue

---

## 🖌️ 7. Apply Filters

Available filters:

```text
Grayscale
Invert
Sepia
Blur
Sharpen
Punch
```

---

## 🔄 8. Transform

Use:

* Rotate left
* Rotate right
* Flip horizontal
* Flip vertical

---

## ↶ 9. Undo / Redo

Use the toolbar buttons or keyboard shortcuts:

```text
Ctrl + Z
Ctrl + Shift + Z
Ctrl + Y
```

---

## ♻️ 10. Reset

Click **Reset** to restore the original uploaded image.

---

## 🔍 11. Zoom

Use:

```text
−    Zoom Out
+    Zoom In
⤢    Fit to Workspace
```

---

## 💾 12. Download

Select:

```text
PNG
JPEG
WEBP
```

and click **Download image**.

The edited image is generated locally using Canvas and downloaded to the device.

---

# ⚙️ Canvas Implementation

The editor uses two Canvas elements:

```html
<canvas id="canvas"></canvas>
<canvas id="overlay"></canvas>
```

### Main Canvas

The main canvas contains the actual edited image.

### Overlay Canvas

The overlay canvas is used for temporary interaction previews such as:

* Shape previews
* Crop selection
* Drawing feedback

This allows temporary previews without immediately modifying the final image.

---

# 🧬 Pixel-Level Image Processing

The application uses:

```javascript
ctx.getImageData(
    0,
    0,
    canvas.width,
    canvas.height
);
```

to retrieve pixel data.

After modification, the data is written back using:

```javascript
ctx.putImageData(imageData, 0, 0);
```

Each pixel contains four channels:

```text
R → Red
G → Green
B → Blue
A → Alpha
```

---

# 🎨 RGB Color Adjustment

The RGB controls modify individual color channels using Canvas pixel manipulation.

```text
Red   → R channel
Green → G channel
Blue  → B channel
```

The modified image data is then placed back onto the canvas using `putImageData()`.

---

# ⚫ Grayscale

The grayscale filter uses weighted RGB luminance:

```text
Gray =
0.299 × Red
+
0.587 × Green
+
0.114 × Blue
```

The resulting value is assigned to the red, green and blue channels.

---

# 🔄 Invert

The invert filter reverses RGB values:

```text
New Red   = 255 - Red
New Green = 255 - Green
New Blue  = 255 - Blue
```

The alpha channel remains unchanged.

---

# ✨ Sharpen

The sharpen operation uses a convolution kernel:

```text
 0  -1   0
-1   5  -1
 0  -1   0
```

The kernel analyzes neighboring pixels to enhance edges and local detail.

---

# 🌫️ Blur

The blur filter uses the Canvas 2D filtering API:

```javascript
ctx.filter = "blur(4px)";
```

A temporary canvas is used to process the image before the result is copied back.

---

# ☀️ Brightness, Contrast & Saturation

The application uses Canvas filtering for the main visual adjustments:

```text
brightness()
contrast()
saturate()
```

The values are controlled through interactive sliders.

---

# 🧠 Undo / Redo System

The editor stores Canvas states using:

```javascript
ctx.getImageData(...)
```

Each state contains:

```text
Canvas Width
Canvas Height
ImageData
```

Previous states are restored with:

```javascript
ctx.putImageData(...)
```

The history system supports multiple undo and redo operations while limiting stored states to reduce excessive memory usage.

---

# 🔒 Privacy

The editor processes images locally in the browser.

It does not require:

* ❌ Image upload servers
* ❌ Backend APIs
* ❌ Databases
* ❌ Cloud processing
* ❌ External image-processing services

Images remain on the user's device during normal editing.

---

# 📱 Responsive Design

The interface adapts to different screen sizes using CSS media queries.

### 🖥️ Desktop

```text
Tools Panel + Large Canvas Workspace
```

### 💻 Tablet

The tools panel becomes narrower while maintaining the editing workspace.

### 📱 Mobile

The interface changes to a vertical layout:

```text
Header
   ↓
Tools / Controls
   ↓
Canvas Workspace
   ↓
Status Bar
```

---

# 🎨 UI Design

The interface focuses on a clean, professional editing experience with:

* 🖌️ Application branding
* 🛠️ Tool controls
* 🎨 Color picker
* 🎚️ Sliders
* 🔘 Action buttons
* 🖼️ Canvas workspace
* 🔍 Zoom controls
* 📊 Status bar
* 🔔 Toast notifications
* 🌙 Theme switching
* 📱 Responsive layout

The checkerboard workspace also provides a visual representation of transparent canvas areas.

---

# 📂 Core JavaScript Functions

## Image Management

```text
loadImageFile()
setCanvasSize()
hasImage()
```

## Drawing

```text
drawBrush()
drawEraser()
drawFinalShape()
drawShapePreview()
```

## Crop

```text
cropImage()
```

## History

```text
saveHistory()
restoreHistory()
```

## Adjustments

```text
applyAdjustmentsPreview()
resetAdjustments()
```

## Filters

```text
applyFilter()
applyCanvasFilter()
sharpenImage()
```

## Transformations

```text
rotateImage()
flipImage()
```

## Zoom

```text
setZoom()
zoomFitToScreen()
```

## Export

```text
canvas.toDataURL()
```

---

# 📋 Requirement Checklist

| Requirement               | Status |
| ------------------------- | :----: |
| HTML5                     |    ✅   |
| CSS3                      |    ✅   |
| Vanilla JavaScript        |    ✅   |
| HTML5 Canvas API          |    ✅   |
| Image Upload              |    ✅   |
| JPG Support               |    ✅   |
| PNG Support               |    ✅   |
| Browser-supported formats |    ✅   |
| Brush                     |    ✅   |
| Adjustable Brush Size     |    ✅   |
| Adjustable Brush Color    |    ✅   |
| Brush Opacity             |    ✅   |
| Eraser                    |    ✅   |
| Rectangle                 |    ✅   |
| Circle / Ellipse          |    ✅   |
| Crop Tool                 |    ✅   |
| Brightness                |    ✅   |
| Contrast                  |    ✅   |
| Grayscale                 |    ✅   |
| Invert                    |    ✅   |
| Blur                      |    ✅   |
| Sharpen                   |    ✅   |
| RGB Color Adjustment      |    ✅   |
| `getImageData()`          |    ✅   |
| `putImageData()`          |    ✅   |
| Undo                      |    ✅   |
| Redo                      |    ✅   |
| Reset                     |    ✅   |
| PNG Export                |    ✅   |
| `canvas.toDataURL()`      |    ✅   |
| Responsive UI             |    ✅   |
| Light Theme               |    ✅   |
| Dark Theme                |    ✅   |
| Drag & Drop               |    ✅   |
| Clipboard Paste           |    ✅   |
| Keyboard Shortcuts        |    ✅   |
| Rotate                    |    ✅   |
| Flip                      |    ✅   |
| Zoom                      |    ✅   |
| JPEG Export               |    ✅   |
| WebP Export               |    ✅   |
| External Frameworks       |    ❌   |
| External Libraries        |    ❌   |
| Backend Required          |    ❌   |

---

# 🎯 MVP Workflow

The main workflow of the application is:

```text
🖼️ Upload Image
       ↓
🎨 Display on Canvas
       ↓
🛠️ Choose Editing Tool
       ↓
✏️ Draw / Erase / Shape
       ↓
✂️ Crop
       ↓
🎚️ Adjust Colors
       ↓
🎨 Apply Filters
       ↓
↶ Undo / Redo
       ↓
🔄 Transform
       ↓
🔍 Zoom
       ↓
💾 Export
       ↓
📥 Download
```

---

# ⚡ Performance

The project is designed to remain lightweight by:

* Using native browser APIs.
* Avoiding external dependencies.
* Limiting very large images during initial loading.
* Maintaining a limited editing history.
* Using Canvas `ImageData` for pixel operations.
* Using temporary canvases for intermediate processing.
* Performing all processing locally.

---

# 🌐 Browser Compatibility

The application requires a modern browser supporting:

* HTML5 Canvas
* Canvas 2D Context
* Canvas ImageData
* FileReader API
* Pointer Events
* Drag & Drop API
* Clipboard image data
* LocalStorage
* `canvas.toDataURL()`

Recommended browsers:

* Google Chrome
* Microsoft Edge
* Mozilla Firefox
* Safari

---

# 🧪 Testing Checklist

Before final submission, verify:

```text
☐ Open index.html
☐ Upload PNG
☐ Upload JPG
☐ Upload another supported image format
☐ Drag and drop image
☐ Paste image using Ctrl + V
☐ Draw with Brush
☐ Change brush size
☐ Change brush color
☐ Change opacity
☐ Use Eraser
☐ Draw Line
☐ Draw Rectangle
☐ Draw Ellipse
☐ Fill a shape
☐ Crop image
☐ Adjust Brightness
☐ Adjust Contrast
☐ Adjust Saturation
☐ Adjust Red
☐ Adjust Green
☐ Adjust Blue
☐ Apply Grayscale
☐ Apply Invert
☐ Apply Sepia
☐ Apply Blur
☐ Apply Sharpen
☐ Apply Punch
☐ Rotate left
☐ Rotate right
☐ Flip horizontal
☐ Flip vertical
☐ Undo
☐ Redo
☐ Reset
☐ Zoom in
☐ Zoom out
☐ Fit image
☐ Switch light/dark theme
☐ Export PNG
☐ Export JPEG
☐ Export WebP
☐ Test responsive layout
```

---

# 🚀 Future Enhancements

Possible future versions could include:

* 🗂️ Layer management
* 🔤 Text tool
* 🎨 Gradient tool
* 🖌️ Advanced brush presets
* 📐 Advanced selection tools
* 🧹 Magic eraser
* 🎭 Layer masks
* 🧩 Layer opacity
* 📏 Canvas resizing
* 🖼️ Image resizing
* 📊 Histogram
* 🎚️ Curves
* 🌈 Hue adjustment
* 💾 Project file support
* 🕘 Advanced non-destructive history

These features are outside the current MVP scope.

---

# 🎯 Project Objectives

The main objectives of **Image Editor Studio** are:

* Build a functional browser-based image editor.
* Demonstrate practical HTML5 Canvas usage.
* Implement pixel-level image manipulation.
* Provide common image-editing operations.
* Implement undo and redo functionality.
* Provide image cropping and drawing tools.
* Provide image filters and color adjustments.
* Export edited images directly from the browser.
* Maintain a lightweight architecture.
* Avoid external libraries and frameworks.
* Provide a professional responsive interface.

---

# 🏆 Task Fulfillment

The project fulfills the requested core image-editor workflow using:

```text
HTML5
CSS3
Vanilla JavaScript
HTML5 Canvas API
```

The implemented workflow is:

```text
Upload
  ↓
Display
  ↓
Edit
  ↓
Adjust
  ↓
Filter
  ↓
Crop
  ↓
Undo / Redo
  ↓
Transform
  ↓
Export
```

The project is intentionally designed as a lightweight Photoshop-inspired editor rather than a complete replacement for professional applications.

---

# 👩‍💻 Author

## Aradhya Dhangar

**Project:** Image Editor Studio
**Technology:** HTML5 • CSS3 • Vanilla JavaScript • Canvas API

> 💡 Built with native web technologies to demonstrate practical browser-based image editing.

---

# 📄 License

This project is provided for educational and project-development purposes.

You are free to modify, improve, and extend the implementation according to your project requirements.

---

## ⭐ Final Note

**Image Editor Studio** demonstrates how a practical image-editing application can be created using standard browser technologies without relying on external frameworks or libraries.

> 🎨 **Create. Edit. Enhance. Export — directly in your browser.**

---
