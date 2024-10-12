export const APP_ROUTES = {
    private: {
        home: {
            name: "/"
        },
        settings: {
            name: "/settings"
        },
        historic: {
            name: "/historic",
            children: {
                name: (title: string) => `/historic/${title}`
            }
        },
        purchase_saved: {
            name: (title: string) => `/purchase-saved/${title}`
        }
    },
    public: {
        login :{
            name: "/auth/login"
        },
        register :{
            name: "/auth/register"
        }
    }
}