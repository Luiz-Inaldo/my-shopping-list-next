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
            details: {
                name: (title: string) => `/historic/${title}`,
                children: (title: string) => `/historic/${title}/coupon-details/`
            },

        },
        purchase_saved: {
            name: (title: string) => `/purchase-saved/${title}`
        },
        menu: {
            name: "/menu"
        },
        statistics: {
            name: "/statistics"
        }
    },
    public: {
        login :{
            name: "/auth/login"
        },
        register :{
            name: "/auth/register"
        },
        errorDevice: {
            name: "/device-error"
        }
    }
}