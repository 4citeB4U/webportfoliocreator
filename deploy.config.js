module.exports = {
    // Main application settings
    app: {
        name: 'BusinessCoachAI',
        version: '1.0.0'
    },

    // Deployment environments
    environments: {
        development: {
            url: 'http://localhost:3000',
            apiUrl: 'http://localhost:3001/api'
        },
        staging: {
            url: 'https://staging.businesscoach-ai.com',
            apiUrl: 'https://staging-api.businesscoach-ai.com'
        },
        production: {
            url: 'https://businesscoach-ai.com',
            apiUrl: 'https://api.businesscoach-ai.com'
        }
    },

    // Project components
    components: {
        landingPage: {
            path: '/src/landing-page',
            build: 'build/landing-page',
            deploy: true
        },
        dashboard: {
            path: '/src/dashboard',
            build: 'build/dashboard',
            deploy: true
        },
        agentLee: {
            path: '/src/agent-lee',
            build: 'build/agent-lee',
            deploy: true
        }
    },

    // Build settings
    build: {
        outputDir: 'build',
        optimization: true,
        minify: true,
        sourceMaps: true
    },

    // Deployment settings
    deploy: {
        // CDN configuration
        cdn: {
            provider: 'cloudflare',
            zone: 'your-cloudflare-zone',
            purgeCache: true
        },

        // SSL configuration
        ssl: {
            enabled: true,
            provider: 'letsencrypt',
            auto: true
        },

        // Database configuration (if needed)
        database: {
            type: 'mongodb',
            url: process.env.MONGODB_URI || 'mongodb://localhost:27017/businesscoach'
        },

        // Backup configuration
        backup: {
            enabled: true,
            frequency: 'daily',
            retention: '30d'
        }
    },

    // QR Code configuration
    qrCodes: {
        toolkit: {
            size: 220,
            errorCorrectionLevel: 'H',
            margin: 2
        },
        rwd: {
            size: 220,
            errorCorrectionLevel: 'H',
            margin: 2
        },
        agentLee: {
            size: 220,
            errorCorrectionLevel: 'H',
            margin: 2
        }
    },

    // Monitoring and analytics
    monitoring: {
        enabled: true,
        provider: 'datadog',
        errorTracking: true,
        performance: true,
        uptime: true
    },

    // Security settings
    security: {
        headers: {
            'X-Frame-Options': 'DENY',
            'X-XSS-Protection': '1; mode=block',
            'Content-Security-Policy': "default-src 'self'"
        },
        rateLimit: {
            windowMs: 15 * 60 * 1000, // 15 minutes
            max: 100 // limit each IP to 100 requests per windowMs
        }
    }
};
