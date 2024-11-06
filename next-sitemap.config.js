const fs = require('fs');
const path = require('path');

module.exports = {
  siteUrl: 'https://dotam.gg',
  generateRobotsTxt: true,
  async additionalPaths(config) {
    const heroDataPath = path.join(__dirname, 'json/dota2heroes.json')
    const heroData = JSON.parse(fs.readFileSync(heroDataPath, 'utf8'))

    const otherPaths = [
        { loc: '/', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 1.0 },
        { loc: '/heroes', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.7 },
        { loc: '/tier-list', lastmod: new Date().toISOString(), changefreq: 'daily', priority: 0.9 },
      ];

    const heroPaths = heroData.map(hero => [
      {
        loc: `/hero/${hero.url}/builds`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.8
      },
      {
        loc: `/hero/${hero.url}/items`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.7
      },
      {
        loc: `/hero/${hero.url}/abilities`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.6
      },
      {
        loc: `/hero/${hero.url}/matchups`,
        lastmod: new Date().toISOString(),
        changefreq: 'daily',
        priority: 0.6
      },
    ]);

    return [...otherPaths, ...heroPaths]
  },
};
