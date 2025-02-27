<script setup lang="ts">
import { computed, type Ref, ref } from 'vue'
import { qrcodegen } from './qrcodegen.ts'
import { Analytics } from '@/Analytics'

Analytics.trackPageView()

const defaultPadding = 4
const defaultOutputSize = 200

const generator = qrcodegen.QrCode
const data = ref('')
const padding = ref(defaultPadding.toString())
const backgroundColour = ref('#ffffff')
const transparentBackground = ref(false)
const foregroundColour = ref('#000000')
const outputSize = ref(defaultOutputSize.toString())
const dataMaxChars = 1000
const showCopiedSvg = ref(false)
const showCopiedPng = ref(false)

const dataError: Ref<string | null> = ref(null)

const paddingInt = computed(() => {
  return padding.value.trim().length > 0 ? parseInt(padding.value) : defaultPadding
})

const outputSizeInt = computed(() => {
  return outputSize.value.trim().length > 0 ? parseInt(outputSize.value) : defaultOutputSize
})

const qrData = computed(() => {
  return data.value.length > dataMaxChars
    ? null
    : generator.encodeText(data.value.trim(), generator.Ecc.MEDIUM)
})

const svgString = computed(() => {
  if (!qrData.value) {
    return ''
  }

  const parts = []

  for (let y = 0; y < qrData.value.size; y++) {
    for (let x = 0; x < qrData.value.size; x++) {
      if (qrData.value.modules[y][x]) {
        parts.push(`M${x + paddingInt.value},${y + paddingInt.value}h1v1h-1z`)
      }
    }
  }
  const size = qrData.value.size + paddingInt.value * 2
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${outputSizeInt.value}" height="${outputSizeInt.value}" fill="${foregroundColour.value}"><g>
  <rect width="100%" height="100%" fill="${transparentBackground.value ? '#ffffff' : backgroundColour.value}"${transparentBackground.value ? ' opacity="0"' : ''}/>
  	<path d="${parts.join(' ')}"/>
</g></svg>`
})

function svgToB64() {
  return `data:image/svg+xml;base64,${btoa(svgString.value)}`
}

async function copySvg() {
  await navigator.clipboard.writeText(svgString.value)
  showCopiedSvg.value = true

  setTimeout(() => (showCopiedSvg.value = false), 2000)

  Analytics.trackEvent('Copy', 'SVG')
}

function downloadSvg() {
  const link = document.createElement('a')
  link.href = svgToB64()
  link.download = `qr-${data.value}.svg`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)

  Analytics.trackEvent('Download', 'SVG')
}

async function createPng(callback: Function) {
  const canvas = document.createElement('canvas')
  canvas.width = outputSizeInt.value
  canvas.height = outputSizeInt.value

  const img = document.createElement('img')
  img.src = svgToB64()
  img.addEventListener('load', () => {
    canvas.getContext('2d').drawImage(img, 0, 0)
    canvas.toBlob(async (blob) => {
      callback(blob)
    })
  })
}

async function copyPng() {
  createPng(async (blob: Blob) => {
    await navigator.clipboard.write([new ClipboardItem({ 'image/png': blob })])
    showCopiedPng.value = true

    setTimeout(() => (showCopiedPng.value = false), 2000)
    Analytics.trackEvent('Copy', 'PNG')
  })
}

function downloadPng() {
  createPng(async (blob: Blob) => {
    const link = document.createElement('a')
    link.href = URL.createObjectURL(blob)
    link.download = `qr-${data.value}.png`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)

    Analytics.trackEvent('Download', 'PNG')
  })
}
</script>

<template>
  <div class="govuk-width-container">
    <main class="govuk-main-wrapper">
      <h1 class="govuk-heading-l">QR code generator</h1>
      <p class="govuk-body-lead">A simple, free QR code generator. No tracking or ads.</p>
      <div class="govuk-grid-row">
        <div class="govuk-grid-column-two-thirds">
          <gv-character-count
            v-model="data"
            label="URL/text"
            class="qrg-data"
            :threshold="95"
            :max-chars="1000"
            :rows="2"
            placeholder="https://example.com"
          />
          <gv-details summary="Advanced options">
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-one-half-from-desktop">
                <gv-input
                  v-model="padding"
                  label="Padding"
                  type="number"
                  min="0"
                  max="10"
                  suffix="squares"
                  class="govuk-input--width-2"
                />
              </div>
              <div class="govuk-grid-column-one-half-from-desktop">
                <gv-input
                  v-model="outputSize"
                  label="Image size"
                  type="number"
                  min="0"
                  max="2000"
                  suffix="pixels"
                  class="govuk-input--width-4"
                />
              </div>
            </div>
            <div class="govuk-grid-row">
              <div class="govuk-grid-column-one-half-from-desktop">
                <gv-input v-model="foregroundColour" type="color" label="Colour" />
              </div>
              <div class="govuk-grid-column-one-half-from-desktop">
                <gv-input v-model="backgroundColour" type="color" label="Background" form-group-class="govuk-!-margin-bottom-1" :disabled="transparentBackground" />
                <div class="govuk-checkboxes govuk-checkboxes--small">
                  <gv-checkbox label="Transparent background" v-model="transparentBackground"/>
                </div>
              </div>
            </div>
          </gv-details>
          <div class="govuk-button-group">
            <gv-button @click="copyPng" aria-live="polite">
              <template v-if="showCopiedPng"> Copied </template>
              <template v-else> Copy PNG </template>
            </gv-button>
            <gv-button @click="downloadPng">Download PNG</gv-button>
            <gv-button @click="copySvg" aria-live="polite">
              <template v-if="showCopiedSvg"> Copied </template>
              <template v-else> Copy SVG </template>
            </gv-button>
            <gv-button @click="downloadSvg">Download SVG</gv-button>
          </div>
        </div>
        <div class="govuk-grid-column-one-third">
          <div v-html="svgString" class="qrg-qr"></div>
        </div>
      </div>
      <footer>
        <p class="govuk-body govuk-!-font-size-14">
          Built by <a href="https://matteason.co.uk" class="govuk-link">Matt Eason</a>.
          <a href="https://ko-fi.com/matteason" class="govuk-link">Buy me a coffee</a>. Uses
          <a href="https://github.com/nayuki/QR-Code-generator" class="govuk-link"
            >QR Code generator library</a
          >
          by Project Nayuki.
        </p>
      </footer>
    </main>
  </div>
</template>

<style lang="scss">
.qrg-data {
  field-sizing: content;
}

.qrg-qr {
  svg {
    background: repeating-conic-gradient(#f3f2f1 0% 25%, transparent 0% 50%) 50% / 20px 20px;
    border: 4px solid #f3f2f1;
    width: 100%;
    height: auto;
  }
}

.govuk-character-count__message--disabled {
  height: 0px;
}
</style>
