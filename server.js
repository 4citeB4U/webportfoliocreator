import express from 'express';
import compression from 'compression';
import cors from 'cors';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import qrcode from 'qrcode';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(compression());
app.use(cors());
app.use(express.json());
app.use(express.static('src'));

// Routes
app.get('/', (req, res) => {
    res.sendFile(join(__dirname, 'src/landing-page/index.html'));
});

app.get('/agent-lee', (req, res) => {
    res.sendFile(join(__dirname, 'src/agent-lee/index.html'));
});

app.get('/prodriver', (req, res) => {
    res.sendFile(join(__dirname, 'src/prodriver/index.html'));
});

app.get('/leola', (req, res) => {
    res.sendFile(join(__dirname, 'src/leola/index.html'));
});

// QR Code generation endpoint
app.get('/api/qr/:path', async (req, res) => {
    try {
        const baseUrl = `${req.protocol}://${req.get('host')}`;
        const fullUrl = `${baseUrl}/${req.params.path}`;
        const qrSvg = await qrcode.toString(fullUrl, {
            type: 'svg',
            color: {
                dark: '#00ffff',
                light: '#000913'
            }
        });
        res.type('svg');
        res.send(qrSvg);
    } catch (error) {
        console.error('QR Code generation error:', error);
        res.status(500).send('Error generating QR code');
    }
});

// Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Something broke!');
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
    console.log('Available routes:');
    console.log('  - / (Landing Page)');
    console.log('  - /agent-lee (AI Assistant)');
    console.log('  - /prodriver (ProDriver Academy)');
    console.log('  - /leola (Leola\'s Library)');
});
