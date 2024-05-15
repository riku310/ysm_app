const { defineConfig } = require('@vue/cli-service')
module.exports = defineConfig({
  transpileDependencies: true,
  devServer: {
    client: {
          webSocketURL: 'auto://ysm.cps.akita-pu.ac.jp/ws'
    },
    proxy: {
      '^/devices': {
        target: 'https://api.switch-bot.com/v1.0'
      }
    }
  },
  pluginOptions: {
    vuetify: {
			// https://github.com/vuetifyjs/vuetify-loader/tree/next/packages/vuetify-loader
		}
  }
})
