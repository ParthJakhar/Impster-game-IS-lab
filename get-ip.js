// Quick script to help find your local IP address
// Run with: node get-ip.js

const os = require('os');

function getLocalIP() {
  const interfaces = os.networkInterfaces();
  const addresses = [];
  
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      // Skip internal (loopback) and non-IPv4 addresses
      if (iface.family === 'IPv4' && !iface.internal) {
        addresses.push({
          interface: name,
          address: iface.address
        });
      }
    }
  }
  
  return addresses;
}

const ips = getLocalIP();

if (ips.length === 0) {
  console.log('❌ No local IP address found. Make sure you are connected to a network.');
} else {
  console.log('✅ Found local IP address(es):\n');
  ips.forEach(({ interface: name, address }) => {
    console.log(`  ${name}: ${address}`);
    console.log(`  Server URL: http://${address}:5050\n`);
  });
  console.log('💡 Use one of these URLs in the client to connect!');
}

