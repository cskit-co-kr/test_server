import Image from 'next/image'
import styles from './page.module.css'

export default function Home() {
  const express = require('express')
  const app = express()
  const port = 8000
  const ws = require('websocket').w3cwebsocket;
  const server = require('http').createServer(app);
  const io = require('socket.io')(server);
  const cors = require('cors');

  app.use(cors({
    origin: '*'
  }));

  let datasa: any = [];
  const hourWS = new ws('wss://stream.binance.com:9443/ws/btcusdt@kline_1s');
  hourWS.onmessage = (event: any) => {
    const tmpdata = JSON.parse(event.data);
    if (datasa.length > 99) {
      datasa.shift();
    }
    datasa.push({ time: tmpdata.E, price: tmpdata.k.c });
    io.emit('senda', { data: datasa });
  };
  io.on('connection', (socket: any) => console.log("connected"));

  app.get('/', (req: any, res: any) => console.log("INDEX"));

  server.listen(port, () => console.log(`Listening on port ${port}`));
  return (
    <main className={styles.main}>
      SERVER RUNNING...
    </main>
  )
}
