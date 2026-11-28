const {defineConfig,devices}=require('@playwright/test');
module.exports=defineConfig({
  testDir:__dirname,
  testMatch:'browser.spec.cjs',
  use:{baseURL:'http://127.0.0.1:4173',reducedMotion:'reduce'},
  webServer:{command:'node server.cjs',cwd:__dirname,url:'http://127.0.0.1:4173',reuseExistingServer:false},
  projects:[
    {name:'desktop',use:{...devices['Desktop Chrome']}},
    {name:'android',use:{...devices['Pixel 7']}},
    {name:'ios',use:{...devices['iPhone 13']}}
  ]
});
