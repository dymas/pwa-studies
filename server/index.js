import webpush from 'web-push';
import express from 'express';
import cors from 'cors';
import 'dotenv/config';

webpush.setVapidDetails(
  'mailto:email@email.com',
  process.env.VAPID_PUBLIC_KEY,
  process.env.VAPID_PRIVATE_KEY
);

const app = express();
const port = '3130';

app.use(cors());
app.use(express.json());

app.get('/', (_, res) => {
  res.send(process.env.VAPID_PUBLIC_KEY);
});

app.post('/register', (req, res) => {
  const subscription = req.body.subscription;

  res.send(subscription);
});

app.post('/sendNotification', (req, res) => {
  const subscription = req.body.subscription;
  const payload = req.body.payload;

  webpush.sendNotification(subscription, payload, { TTL: 60 });
});

app.listen(port, () => {
  console.log(`App listening on port ${port}`);
});
