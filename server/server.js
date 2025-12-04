import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import connectDB from './configs/db.js';
import { clerkMiddleware } from '@clerk/express';
import { serve } from 'inngest/express';
import { inngest, functions } from './inngest/index.js';

import showRouter from './routes/showRoutes.js';
import bookingRouter from './routes/bookingRoutes.js';
import adminRouter from './routes/adminRouter.js';
import userRouter from './routes/userRoutes.js';
import { stripeWebhooks } from './controllers/stripeWebhooks.js';

const app = express();
const port = 3000;

await connectDB();

// stripe webhook route
app.use('/api/stripe', express.raw({type: 'application/json'}), stripeWebhooks);

// middleware
app.use(express.json());
app.use(cors());

app.get('/', (req, res) => res.send('Server is live!'));

// Inngest
app.use('/api/inngest', serve({ client: inngest, functions }));

// Public routes (NO clerkMiddleware)
app.use('/api/show', showRouter);
app.use('/api/booking', bookingRouter);
app.use('/api/user', userRouter);

// Admin routes (WITH Clerk authentication)
app.use('/api/admin', clerkMiddleware(), adminRouter);

app.listen(port, () =>
  console.log(`Server listening at http://localhost:${port}`)
);
