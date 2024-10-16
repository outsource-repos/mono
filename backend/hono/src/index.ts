import { Hono } from 'hono'

const app = new Hono()

app.get('/', (c) => {
  const userAgent = c.req.header('User-Agent');
  return c.text(`Your user agent is: ${userAgent}`);
});

export default app