export const APP_ROUTES = {
    private: {
        home: {
            name: "/"
        },
        shoppingList: {
            name: (title: string) => `/list/${title}`
        },
        settings: {
            name: "/settings"
        },
        historic: {
            name: "/historic",
            details: {
                name: (title: string) => `/historic/${title}`
            },

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