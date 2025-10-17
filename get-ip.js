const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Pula interfaces internas e não IPv4
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  
  return 'localhost';
}

const localIP = getLocalIP();
console.log(`\n🌐 Seu IP local é: ${localIP}`);
console.log(`📱 Para acessar de outros dispositivos na rede:`);
console.log(`   http://${localIP}:3001`);
console.log(`\n💡 Dica: Certifique-se de que o firewall permite conexões na porta 3001\n`);

module.exports = { getLocalIP };
