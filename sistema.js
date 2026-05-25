import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged,
    signOut,
    sendPasswordResetEmail 
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getDatabase, ref, set, get } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-database.js";

// Configuração do seu Firebase
const firebaseConfig = {
    apiKey: "AIzaSyBkl9RPBBO05UHQpFqsFpUXJTUIwqiNfmY",
    authDomain: "loja-tenis-82f09.firebaseapp.com",
    databaseURL: "https://loja-tenis-82f09-default-rtdb.firebaseio.com",
    projectId: "loja-tenis-82f09",
    storageBucket: "loja-tenis-82f09.firebasestorage.app",
    messagingSenderId: "143913185704",
    appId: "1:143913185704:web:8354f72844178aa84d6d9d"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getDatabase(app);

// --- 1. MONITORAMENTO DE LOGIN (O que controla o Menu e o Perfil) ---
onAuthStateChanged(auth, (user) => {
    const linkLogin = document.querySelector("#link-login");
    const linkUsuario = document.querySelector("#link-usuario");
    const exibirNome = document.querySelector("#exibir-nome");
    const exibirEmail = document.querySelector("#exibir-email");

    if (user) {
        // Se houver usuário, mostramos o link "Minha Conta" e escondemos o "Login"
        if (linkLogin) linkLogin.style.display = "none";
        if (linkUsuario) linkUsuario.style.display = "inline-block";

        // BUSCA OS DADOS NO BANCO: Pega o que foi digitado no cadastro
        const userRef = ref(db, 'usuarios/' + user.uid);
        get(userRef).then((snapshot) => {
            if (snapshot.exists()) {
                const dados = snapshot.val();
                
                // Coloca o nome no menu (onde era Login)
                if (linkUsuario) linkUsuario.innerText = dados.nome;
                
                // Coloca nome e email na página de perfil
                if (exibirNome) exibirNome.innerText = dados.nome;
                if (exibirEmail) exibirEmail.innerText = dados.email;
            }
        });
    } else {
        // Se deslogado, volta ao normal
        if (linkLogin) linkLogin.style.display = "inline-block";
        if (linkUsuario) linkUsuario.style.display = "none";

        // Proteção: Se estiver na página de perfil sem logar, expulsa para o login
        if (window.location.pathname.includes("perfil.html")) {
            window.location.href = "login.html";
        }
    }
});

// --- 2. CADASTRO E LOGIN (O que salva os dados) ---
const btnAcao = document.querySelector("#btn-auth");
if (btnAcao) {
    btnAcao.addEventListener("click", (e) => {
        e.preventDefault();
        const email = document.querySelector("#email").value;
        const senha = document.querySelector("#senha").value;
        const campoNome = document.querySelector("#nome"); // Campo do formulário de cadastro

        if (campoNome) { 
            // LÓGICA DE CADASTRO
            createUserWithEmailAndPassword(auth, email, senha)
                .then((cred) => {
                    // SALVANDO: Aqui guardamos o nome que a pessoa escreveu
                    set(ref(db, 'usuarios/' + cred.user.uid), {
                        nome: campoNome.value,
                        email: email
                    }).then(() => {
                        alert("Cadastro realizado com sucesso!");
                        window.location.href = "index.html";
                    });
                })
                .catch(err => alert("Erro ao cadastrar: " + err.message));
        } else { 
            // LÓGICA DE LOGIN
            signInWithEmailAndPassword(auth, email, senha)
                .then(() => {
                    window.location.href = "index.html";
                })
                .catch(() => alert("E-mail ou senha incorretos."));
        }
    });
}

// --- 3. BOTÃO SAIR ---
document.querySelector("#btn-sair")?.addEventListener("click", () => {
    signOut(auth).then(() => {
        window.location.href = "index.html";
    });
});

// --- 4. TRAVA DE COMPRA ---
document.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-comprar")) {
        if (!auth.currentUser) {
            e.preventDefault();
            alert("⚠️ Você precisa estar logado para comprar!");
            window.location.href = "login.html";
        } else {
            alert("✅ Produto adicionado ao carrinho!");
        }
    }
});

// --- 5. RECUPERAÇÃO DE SENHA (VERSÃO COM PERGUNTA) ---
const linkRecuperar = document.querySelector("#recuperar-senha");

if (linkRecuperar) {
    linkRecuperar.addEventListener("click", (e) => {
        e.preventDefault();

        // Isso abre uma caixinha de digitação na tela do usuário
        const emailParaReset = prompt("Digite seu e-mail para receber o link de redefinição:");

        if (emailParaReset) {
            sendPasswordResetEmail(auth, emailParaReset)
                .then(() => {
                    alert("E-mail enviado para: " + emailParaReset + ". Verifique sua caixa de entrada!");
                })
                .catch((error) => {
                    alert("Erro: " + error.message);
                });
        }
    });
}