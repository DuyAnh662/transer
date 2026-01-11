const sharp = require('sharp');
const path = require('path');
const fs = require('fs');
const os = require('os');

/**
 * Add translated text as overlay/caption on image
 * Basic implementation - adds text at bottom of image
 * @param {Buffer} imageBuffer - Original image buffer
 * @param {string} originalText - Original OCR text
 * @param {string} translatedText - Translated text
 * @returns {Promise<Buffer>} - New image buffer
 */
async function addTextOverlay(imageBuffer, originalText, translatedText) {
    try {
        // Get image metadata
        const metadata = await sharp(imageBuffer).metadata();
        const { width, height } = metadata;

        // Create text overlay as SVG
        const fontSize = Math.max(16, Math.min(24, Math.floor(width / 30)));
        const padding = 20;
        const lineHeight = fontSize * 1.4;

        // Word wrap the translated text
        const maxCharsPerLine = Math.floor((width - padding * 2) / (fontSize * 0.6));
        const lines = wordWrap(translatedText, maxCharsPerLine);
        const textHeight = lines.length * lineHeight + padding * 2;

        // Create SVG text overlay
        const svgText = `
      <svg width="${width}" height="${textHeight}">
        <style>
          .text { 
            fill: white; 
            font-size: ${fontSize}px; 
            font-family: Arial, sans-serif;
            text-shadow: 1px 1px 2px black;
          }
        </style>
        <rect width="100%" height="100%" fill="rgba(0,0,0,0.7)"/>
        ${lines.map((line, i) =>
            `<text x="${padding}" y="${padding + (i + 1) * lineHeight}" class="text">${escapeXml(line)}</text>`
        ).join('')}
      </svg>
    `;

        // Extend image and add overlay at bottom
        const result = await sharp(imageBuffer)
            .extend({
                bottom: Math.ceil(textHeight),
                background: { r: 0, g: 0, b: 0, alpha: 1 },
            })
            .composite([
                {
                    input: Buffer.from(svgText),
                    gravity: 'south',
                },
            ])
            .png()
            .toBuffer();

        return result;
    } catch (error) {
        console.error('❌ Image overlay error:', error.message);
        throw new Error('Lỗi xử lý hình ảnh.');
    }
}

/**
 * Word wrap text
 * @param {string} text - Text to wrap
 * @param {number} maxChars - Max characters per line
 * @returns {string[]} - Array of lines
 */
function wordWrap(text, maxChars) {
    const words = text.split(/\s+/);
    const lines = [];
    let currentLine = '';

    for (const word of words) {
        if (currentLine.length + word.length + 1 <= maxChars) {
            currentLine += (currentLine ? ' ' : '') + word;
        } else {
            if (currentLine) lines.push(currentLine);
            currentLine = word;
        }
    }
    if (currentLine) lines.push(currentLine);

    return lines;
}

/**
 * Escape special XML characters
 * @param {string} text - Text to escape
 * @returns {string} - Escaped text
 */
function escapeXml(text) {
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&apos;');
}

module.exports = {
    addTextOverlay,
};
