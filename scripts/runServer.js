const webpack = require('webpack');
const config = require('../webpack.config');
const app = require('../server');

webpack(config, (err, stats) => {
  if (err) {
    throw new Error(err);
  }

  console.log(stats.toString({
    chunks: false,
    colors: true,
  }));

  app.run(() => console.log('server started'));
});
