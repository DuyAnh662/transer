const Tesseract = require('tesseract.js');
const config = require('../config');

// Cache the worker for better performance
let worker = null;

/**
 * Initialize OCR worker
 */
async function initWorker() {
    if (!worker) {
        console.log('🔧 Initializing OCR worker...');
        worker = await Tesseract.createWorker(config.OCR_LANGUAGES, 1, {
            logger: (m) => {
                if (m.status === 'recognizing text') {
                    // Only log progress at 25%, 50%, 75%, 100%
                    const progress = Math.round(m.progress * 100);
                    if (progress % 25 === 0 && progress > 0) {
                        console.log(`📖 OCR progress: ${progress}%`);
                    }
                }
            },
        });
        console.log('✅ OCR worker ready');
    }
    return worker;
}

/**
 * Extract text from image using OCR
 * @param {Buffer|string} image - Image buffer or URL
 * @returns {Promise<{text: string, confidence: number}>}
 */
async function extractText(image) {
    try {
        const w = await initWorker();

        const result = await w.recognize(image);

        // Clean up the extracted text
        const text = result.data.text
            .trim()
            .replace(/\n{3,}/g, '\n\n') // Remove excessive newlines
            .replace(/[ \t]{2,}/g, ' '); // Remove excessive spaces

        return {
            text,
            confidence: result.data.confidence,
        };
    } catch (error) {
        console.error('❌ OCR error:', error.message);
        throw new Error('Lỗi nhận diện chữ trong ảnh.');
    }
}

/**
 * Terminate OCR worker (for cleanup)
 */
async function terminateWorker() {
    if (worker) {
        await worker.terminate();
        worker = null;
    }
}

// Cleanup on process exit
process.on('exit', terminateWorker);
process.on('SIGINT', async () => {
    await terminateWorker();
    process.exit();
});

module.exports = {
    extractText,
    terminateWorker,
};
