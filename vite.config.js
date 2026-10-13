import {defineConfig} from 'vite'
import {svelte} from '@sveltejs/vite-plugin-svelte'
import {VitePWA} from 'vite-plugin-pwa'
export default defineConfig({
  base: process.env.BASE_PATH || './',
  server: {host: true, watch: process.env.CHOKIDAR_USEPOLLING ? {usePolling: true} : undefined},
  plugins:[svelte(),VitePWA({registerType:'autoUpdate',manifest:{name:'Spacemaster Sheets',short_name:'SM Sheets',display:'standalone',start_url:'.',scope:'.',background_color:'#0e1420',theme_color:'#1d6fd6',
    icons:[{src:'icon-192.png',sizes:'192x192',type:'image/png'},{src:'icon-512.png',sizes:'512x512',type:'image/png',purpose:'any maskable'}]}})]})
