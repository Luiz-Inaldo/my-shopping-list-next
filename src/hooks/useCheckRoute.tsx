import { APP_ROUTES } from "@/routes/app-routes";

export default function useCheckRoute(pathname: any): boolean {

    const privateRoutes = Object.values(APP_ROUTES.private).map((route) => route.name);

    return privateRoutes.includes(pathname);

}
