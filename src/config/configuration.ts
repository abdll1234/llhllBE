export default () => ({
    supabase: {
        url: process.env.SUPABASE_URL,
        key: process.env.SUPABASE_KEY,
    },
    frontend: {
        url: process.env.FRONTEND_URL || 'http://localhost:4200',
    },
    upload: {
        maxSize: 50 * 1024 * 1024, // 50MB
        allowedMimeTypes: [
            'image/jpeg',
            'image/png',
            'image/gif',
            'application/pdf',
        ],
    },
});