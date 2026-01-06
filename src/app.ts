import express, { type Application, type NextFunction, type Request, type Response } from "express";
import morgan from "morgan";
import helmet from "helmet";
import cors from 'cors'
import { successResponse } from "./utils/response";
import { errorHandler } from "./middleware/error.handler";
import categoryRouter from "./routes/category.route"
import checkInRouter from "./routes/checkIn.route"
import habitRouter from "./routes/habit.route"
import profileRouter from "./routes/profile.route"
import authRouter from "./routes/auth.route"
import dashboardRouter from "./routes/dashboard.route"
import statRouter from "./routes/stat.route"
import swaggerUI from 'swagger-ui-express'
import swaggerSpec from "./utils/swagger";

const app: Application = express()

app.use(helmet())
app.use(cors())
app.use(morgan('dev'))
app.use(express.json())
app.set('query panser', 'extended')
app.use(express.static("public"))


app.use ((req: Request, _res: Response, next: NextFunction) => {
    console.log(`${req.method}: ${req.path}`);
    req.startTime = Date.now()
    next()
})


app.get('/', (_req: Request, res: Response) => {
    successResponse (
      res,
      "selamat datang di API Habit Forge",
    {
        status: 'server Hidup',
    },
  )
})
app.use('/api-docs', swaggerUI.serve, swaggerUI.setup(swaggerSpec))

app.use('/api/auth', authRouter) 
app.use('/api/stat', statRouter)
app.use('/api/dashboard', dashboardRouter)
app.use('/api/category', categoryRouter) 
app.use('/api/checkIn', checkInRouter) 
app.use('/api/habit', habitRouter) 
app.use('/api/profile', profileRouter) 


app.get(/.*/, (req: Request, _res: Response) => {
 throw new Error(`Route ${req.originalUrl} tidak ada di API e-commrece`)
})

app.use(errorHandler)

export default app