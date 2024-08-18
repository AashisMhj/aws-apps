
export default ({ env }) => {
  return [
    'strapi::logger',
    'strapi::errors',
    // 'strapi::security',
    {
      name: 'strapi::security',
      config: {
        contentSecurityPolicy: {
          useDefaults: true,
          directives: {
            'connect-src': ["'self'", 'https:'],
            'img-src': [
              "'self'",
              'data:',
              'blob:',
              'dl.airtable.com',
              `${env('AWS_BUCKET')}.s3.us-east-1.amazonaws.com`,
              'market-assets.strapi.io'
            ],
            'media-src': [
              "'self'",
              'data:',
              'blob:',
              'dl.airtable.com',
              `${env('AWS_BUCKET')}.s3.us-east-1.amazonaws.com`,
            ],
            upgradeInsecureRequests: null,
          },
        },
      },
    },
    'strapi::cors',
    'strapi::poweredBy',
    'strapi::query',
    'strapi::body',
    'strapi::session',
    'strapi::favicon',
    'strapi::public',
  ]
}