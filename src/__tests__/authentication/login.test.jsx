import { render, screen } from "@testing-library/react";
import LogInForm from "@/app/auth/_components/Login";
import userEvent from "@testing-library/user-event";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "@/lib/firebase";
import AuthPage from "@/app/auth/page";

jest.mock("@/functions/sendToastMessage", () => ({
  sendToastMessage: jest.fn(),
}));

jest.mock("firebase/auth", () => ({
  signInWithEmailAndPassword: jest.fn((authInstance, email, password) =>
    Promise.resolve({ status: 200, message: "Login realizado com sucesso." })
  ),
}));

jest.mock("@/lib/firebase", () => ({
  auth: jest.fn(),
}));

jest.mock("firebase/app", () => ({
  FirebaseError: jest.fn(),
}));

jest.mock("@/context/PageOverlayContext", () => ({
  usePageOverlay: jest.fn().mockReturnValue({
    handleChangeRoute: jest.fn(),
  }),
}));

describe("Auth page tests", () => {

  it('Should render the login form at first render', () => {
    render(<AuthPage />);

    // verifica se os botões de mudança de formulário estão presentes
    expect(screen.getByTestId("login-form-changer")).toBeInTheDocument();
    expect(screen.getByTestId("register-form-changer")).toBeInTheDocument();

    // verifica se o texto de Login está presente
    expect(screen.getByText('Faça login com sua conta')).toBeInTheDocument();
  });

  it('Should render the register form when the register form changer is clicked and the login form again when the login form changer is clicked', async () => {
    render(<AuthPage />);

    const registerFormChanger = screen.getByTestId("register-form-changer");
    await userEvent.click(registerFormChanger);
    expect(screen.getByText(/Já possui uma conta/i)).toBeInTheDocument();

    const loginFormChanger = screen.getByTestId("login-form-changer");
    await userEvent.click(loginFormChanger);
    expect(screen.getByText(/Faça login/i)).toBeInTheDocument();

  });

})

describe("Login form component tests", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  afterAll(() => {
    jest.resetAllMocks();
  });

    it("should render the login form with all its elements", () => {
      const setCurrentForm = jest.fn();
      render(<LogInForm setCurrentForm={setCurrentForm} />);

      // verifica se há o campo (label + input) do e-mail
      expect(screen.getByLabelText("E-mail")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Seu e-mail")).toBeInTheDocument();

      // verifica se há o campo (label + input) da senha
      expect(screen.getByLabelText("Senha")).toBeInTheDocument();
      expect(screen.getByPlaceholderText("Sua senha")).toBeInTheDocument();

      // verifica se há o botão de entrar
      expect(screen.getByRole("button", { name: "Entrar" })).toBeInTheDocument();

      // verifica se há o o texto "Ainda não tem uma conta?"
      expect(screen.getByText("Ainda não tem uma conta?")).toBeInTheDocument();

      // verifica se há o link para cadastro e se o link possui o atributo onClick
      expect(screen.getByText("Cadastre-se")).toBeInTheDocument();
    });

    it("should call the setCurrentForm function when the link for registration is clicked", async () => {
      const setCurrentForm = jest.fn();
      render(<LogInForm setCurrentForm={setCurrentForm} />);

      const formValueChanger = screen.getByText("Cadastre-se");
      await userEvent.click(formValueChanger);
      expect(setCurrentForm).toHaveBeenCalledTimes(1);
    });

  it("should call the signInWithEmailAndPassword function and call the sendToastMessage function when the form is submitted", async () => {
    const setCurrentForm = jest.fn();

    const signInFn = signInWithEmailAndPassword;
    const authInstance = auth;

    render(<LogInForm setCurrentForm={setCurrentForm} />);

    const emailInput = screen.getByPlaceholderText("Seu e-mail");
    const passwordInput = screen.getByPlaceholderText("Sua senha");
    await userEvent.type(emailInput, "luiza.teste@gmail.com");
    await userEvent.type(passwordInput, "Llala@87874");

    const submitButton = screen.getByRole("button", { name: "Entrar" });
    await userEvent.click(submitButton);
    expect(signInFn).toHaveBeenCalledWith(authInstance, "luiza.teste@gmail.com", "Llala@87874");
  });
});
