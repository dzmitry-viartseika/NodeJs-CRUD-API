import Application from './app/app';
import parseJson from './app/parseJSON';
import parseUrl from './app/parseUrl';
import { usersRouter } from './routers/userRouter';

export const startServer = (port: number, startMsg: string) => {
    const app = new Application();

    app.use(parseJson);
    app.use(parseUrl);
    app.addRouter(usersRouter);
    app.listen(port, () => {
        console.log(startMsg);
    });
    return app;
};