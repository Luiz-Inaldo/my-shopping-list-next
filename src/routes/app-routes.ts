export const APP_ROUTES = {
    private: {
        home: {
            name: "/"
        },
        shoppingList: {
            name: (id: string) => `/list/${id}`
        },
        settings: {
            name: "/ajustes",
            perfil: {
                name: "/ajustes/perfil"
            },
            seguranca: {
                name: "/ajustes/seguranca"
            },
            sobre: {
                name: "/menu/sobre"
            },
            deletarConta: {
                name: "/ajustes/deletar-conta"
            }
        },
        historic: {
            name: "/historic",
            details: {
                name: (id: string) => `/historic/${id}`
            },
            pdf: {
                name: (id: string) => `/historic/${id}/pdf`
            }

        },
        menu: {
            name: "/menu"
        },
        statistics: {
            name: "/statistics"
        }
    },
    public: {
        login: {
            name: "/auth/login"
        },
        registro: {
            name: "/auth/registrar"
        },
        forgotPassword: {
            name: "/auth/recuperar-senha"
        },
        inicio: {
            name: "/inicio"
        },
        handler: {
            name: "/handler"
        }
    }
}