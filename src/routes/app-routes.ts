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
                children: (title: string) => `/historic/${title}/details`
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
        auth :{
            name: "/auth"
        },
        inicio: {
            name: "/inicio"
        }
    }
}