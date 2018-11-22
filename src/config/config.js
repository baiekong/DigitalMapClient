export default {
  development:{
    IDLE_TIMEOUT: 2 * 60 * 60 * 1000, // 2Hr
    BACKEND_HOST: 'http://localhost:5000'
    //BACKEND_HOST: 'http://map.leafte.ch:1880'
  },
  production:{
    IDLE_TIMEOUT: 2 * 60 * 60 * 1000, // 2Hr
    BACKEND_HOST: 'http://52.221.234.138:5000'
  }
};
