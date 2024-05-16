const fs = require('fs');
const path = require('path');

module.exports = {
  siteUrl: 'https://dotam.gg',
  generateRobotsTxt: true,
  async additionalPaths(config) {
    const heroDataPath = path.join(__dirname, 'src/json/dota2heroes.json')
    const heroData = JSON.parse(fs.readFileSync(heroDataPath, 'utf8'))

    return heroData.map(hero => ({
      loc: `/hero/${hero.id}`,
      lastmod: new Date().toISOString(),
      changefreq: 'daily',
      priority: 0.7
    }));
  },
};
