const { envInt, envStr } = require('env-helpers')

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    remotePatterns: [{
      hostname: 'api.dicebear.com'
    }]
  },
  publicRuntimeConfig: {
    registrationCutoffDay: envInt('REGISTRATION_CUTOFF_DAY', 20),
    showWinnersDate: envStr('SHOW_WINNERS_DATE', '2025-01-14'),
  }
}

module.exports = nextConfig
