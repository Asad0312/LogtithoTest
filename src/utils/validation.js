export const ACCEPTED_TYPES = ['image/jpeg', 'image/png']
export const ACCEPTED_EXTENSIONS = '.jpg,.jpeg,.png'
export const MAX_FILE_SIZE = 10 * 1024 * 1024

export function validateImageFile(file) {
  if (!file) {
    return { ok: false, error: 'No file selected.' }
  }
  if (!ACCEPTED_TYPES.includes(file.type)) {
    return { ok: false, error: 'Unsupported file type. Please choose a JPG, JPEG, or PNG image.' }
  }
  if (file.size > MAX_FILE_SIZE) {
    const mb = (file.size / (1024 * 1024)).toFixed(1)
    return { ok: false, error: `File is too large (${mb} MB). Maximum allowed size is 10 MB.` }
  }
  return { ok: true, error: null }
}

export function formatFileSize(bytes) {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function readFileAsDataURL(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result)
    reader.onerror = () => reject(new Error('Could not read the selected file.'))
    reader.readAsDataURL(file)
  })
}

export function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => resolve(img)
    img.onerror = () => reject(new Error('Could not decode this image. The file may be damaged.'))
    img.src = src
  })
}

/**
 * Downscale an image to a manageable data URL so localStorage and the
 * canvas stay fast. Purely a size optimisation — no OCR is performed.
 */
export async function compressImage(file, maxDim = 1400, quality = 0.82) {
  const dataUrl = await readFileAsDataURL(file)
  const img = await loadImage(dataUrl)
  const { width, height } = img
  const scale = Math.min(1, maxDim / Math.max(width, height))
  const w = Math.round(width * scale)
  const h = Math.round(height * scale)

  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = '#ffffff'
  ctx.fillRect(0, 0, w, h)
  ctx.drawImage(img, 0, 0, w, h)

  return {
    dataUrl: canvas.toDataURL('image/jpeg', quality),
    originalWidth: width,
    originalHeight: height,
    width: w,
    height: h,
  }
}
