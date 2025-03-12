const firebaseConfig = {
    apiKey: "AIzaSyC0iJ0FprASJbqMaEVezRfsLF21O-zQxI4",
    authDomain: "cloud-engenheiros.firebaseapp.com",
    projectId: "cloud-engenheiros",
    storageBucket: "cloud-engenheiros.firebasestorage.app",
    messagingSenderId: "923596482018",
    appId: "1:923596482018:web:5e388229af8a3d259b05bb",
    measurementId: "G-D45N5WPYZ0"
};

// Inicialização do Firebase com tratamento de erro
let app, auth, db;
try {
    app = firebase.initializeApp(firebaseConfig);
    auth = firebase.auth();
    db = firebase.firestore();
} catch (error) {
    console.error("Erro ao inicializar o Firebase:", error.message);
}

document.addEventListener('DOMContentLoaded', function () {
    // Seleção de elementos DOM com verificação
    const header = document.querySelector('header') || console.error("Header não encontrado");
    const loginSection = document.getElementById('login-section') || console.error("Seção de login não encontrada");
    const emailInput = document.getElementById('email-input') || console.error("Input de email não encontrado");
    const passwordInput = document.getElementById('password-input') || console.error("Input de senha não encontrado");
    const loginButton = document.getElementById('login-button') || console.error("Botão de login não encontrado");
    const addEditCardSection = document.getElementById('add-edit-card') || console.error("Seção de adicionar/editar card não encontrada");
    const logoutButton = document.getElementById('logout-button') || console.error("Botão de logout não encontrado");
    const themeToggle = document.getElementById('theme-toggle') || console.error("Botão de tema não encontrado");
    const translateToggle = document.getElementById('translate-toggle') || console.error("Botão de tradução não encontrado");
    const translateMenu = document.getElementById('translate-menu') || console.error("Menu de tradução não encontrado");
    const settingsToggle = document.getElementById('settings-toggle') || console.error("Botão de configurações não encontrado");
    const settingsMenu = document.getElementById('settings-menu') || console.error("Menu de configurações não encontrado");
    const searchBar = document.getElementById('search-bar') || console.error("Barra de pesquisa não encontrada");
    const searchInput = document.getElementById('search-input') || console.error("Input de pesquisa não encontrado");
    const gridViewButton = document.getElementById('grid-view-button') || console.error("Botão de visão em grade não encontrado");
    const listViewButton = document.getElementById('list-view-button') || console.error("Botão de visão em lista não encontrado");
    const cardsContainer = document.getElementById('cards-container') || console.error("Container de cards não encontrado");
    const cardListSection = document.getElementById('card-list') || console.error("Seção de lista de cards não encontrada");
    const filterLanguage = document.getElementById('filter-language') || console.error("Filtro de linguagem não encontrado");
    const filterTag = document.getElementById('filter-tag') || console.error("Filtro de tag não encontrado");
    const filterSort = document.getElementById('filter-sort') || console.error("Filtro de ordenação não encontrado");
    const scrollTopButton = document.getElementById('scroll-top-button') || console.error("Botão de voltar ao topo não encontrado");
    const footer = document.querySelector('footer') || console.error("Footer não encontrado");

    const cardIdInput = document.getElementById('card-id') || console.error("Input de ID do card não encontrado");
    const cardTitleInput = document.getElementById('card-title') || console.error("Input de título do card não encontrado");
    const cardCodeInput = document.getElementById('card-code') || console.error("Input de código do card não encontrado");
    const saveButton = document.getElementById('save-button') || console.error("Botão de salvar não encontrado");
    const cancelButton = document.getElementById('cancel-button') || console.error("Botão de cancelar não encontrado");
    const previewIframe = document.getElementById('preview-iframe') || console.error("Iframe de pré-visualização não encontrado");
    const languageCheckboxes = document.querySelectorAll('#language-checkboxes input[type="checkbox"]') || console.error("Checkboxes de linguagem não encontrados");

    const primaryColorPicker = document.getElementById('primary-color-picker') || console.error("Picker de cor primária não encontrado");
    const secondaryColorPicker = document.getElementById('secondary-color-picker') || console.error("Picker de cor secundária não encontrado");
    const accentColorPicker = document.getElementById('accent-color-picker') || console.error("Picker de cor de destaque não encontrado");
    const textColorPicker = document.getElementById('text-color-picker') || console.error("Picker de cor de texto não encontrado");
    const bgColorPicker = document.getElementById('bg-color-picker') || console.error("Picker de cor de fundo não encontrado");
    const cardBgColorPicker = document.getElementById('card-bg-color-picker') || console.error("Picker de cor de fundo dos cards não encontrado");
    const filterBgColorPicker = document.getElementById('filter-bg-color-picker') || console.error("Picker de cor de fundo dos filtros não encontrado");
    const borderColorPicker = document.getElementById('border-color-picker') || console.error("Picker de cor da borda não encontrado");
    const lightThemeBgPicker = document.getElementById('light-theme-bg-picker') || console.error("Picker de cor de fundo do tema claro não encontrado");
    const lightThemeTextPicker = document.getElementById('light-theme-text-picker') || console.error("Picker de cor de texto do tema claro não encontrado");
    const lightThemeCardBgPicker = document.getElementById('light-theme-card-bg-picker') || console.error("Picker de cor de fundo dos cards do tema claro não encontrado");
    const lightThemeFilterBgPicker = document.getElementById('light-theme-filter-bg-picker') || console.error("Picker de cor de fundo dos filtros do tema claro não encontrado");
    const lightThemeBorderPicker = document.getElementById('light-theme-border-picker') || console.error("Picker de cor da borda do tema claro não encontrado");
    const resetThemeButton = document.getElementById('reset-theme') || console.error("Botão de resetar tema não encontrado");
    const backupThemeButton = document.getElementById('backup-theme') || console.error("Botão de backup de tema não encontrado");
    const restoreThemeButton = document.getElementById('restore-theme') || console.error("Botão de restaurar tema não encontrado");

    let allCards = [];
    let allTags = new Set();
    const colors = ["#4a00e0", "#ff3e6c", "#00ff88", "#9b59b6", "#2ecc71"];
    let loggedIn = false;

    const defaultTheme = {
        '--primary-color': '#4a00e0',
        '--secondary-color': '#ff3e6c',
        '--accent-color': '#00ff88',
        '--text-color': '#ffffff',
        '--bg-color': '#0f0c29',
        '--card-bg-color': '#24243e',
        '--filter-bg-color': '#1a1a2e',
        '--border-color': 'rgba(255, 255, 255, 0.1)',
        '--light-theme-bg': '#f0f0f0',
        '--light-theme-text': '#333',
        '--light-theme-card-bg': '#ffffff',
        '--light-theme-filter-bg': '#e6f0ff',
        '--light-theme-border': '#333'
    };

    function toggleTheme() {
        try {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            themeToggle.innerHTML = `<i class="fas ${isLight ? 'fa-sun' : 'fa-moon'}"></i>`;
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
        } catch (error) {
            console.error("Erro ao alternar tema:", error.message);
        }
    }

    try {
        const savedTheme = localStorage.getItem('theme');
        if (savedTheme === 'light') {
            document.body.classList.add('light-theme');
            themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
        }
    } catch (error) {
        console.error("Erro ao carregar tema salvo:", error.message);
    }

    translateToggle.addEventListener('click', () => {
        try {
            translateMenu.classList.toggle('active');
        } catch (error) {
            console.error("Erro ao abrir menu de tradução:", error.message);
        }
    });

    document.querySelectorAll('#translate-menu button').forEach(button => {
        button.addEventListener('click', () => {
            try {
                const lang = button.getAttribute('data-lang');
                const translateSelect = document.querySelector('.goog-te-combo');
                if (translateSelect) {
                    translateSelect.value = lang;
                    translateSelect.dispatchEvent(new Event('change'));
                }
                translateMenu.classList.remove('active');
            } catch (error) {
                console.error("Erro ao selecionar idioma:", error.message);
            }
        });
    });

    window.addEventListener('scroll', () => {
        try {
            if (window.scrollY > 300) {
                scrollTopButton.classList.add('visible');
            } else {
                scrollTopButton.classList.remove('visible');
            }
        } catch (error) {
            console.error("Erro no evento de scroll:", error.message);
        }
    });

    scrollTopButton.addEventListener('click', () => {
        try {
            window.scrollTo({ top: 0, behavior: 'smooth' });
        } catch (error) {
            console.error("Erro ao voltar ao topo:", error.message);
        }
    });

    themeToggle.addEventListener('click', toggleTheme);

    settingsToggle.addEventListener('click', () => {
        try {
            settingsMenu.classList.toggle('active');
        } catch (error) {
            console.error("Erro ao abrir menu de configurações:", error.message);
        }
    });

    function updateThemeColors(colors) {
        try {
            for (const [key, value] of Object.entries(colors)) {
                document.documentElement.style.setProperty(key, value);
            }
        } catch (error) {
            console.error("Erro ao atualizar cores do tema:", error.message);
        }
    }

    async function saveThemeToFirestore(colors) {
        try {
            const user = auth.currentUser;
            if (user) {
                await db.collection('users').doc(user.uid).set({ theme: colors }, { merge: true });
            }
        } catch (error) {
            console.error("Erro ao salvar tema no Firestore:", error.message);
        }
    }

    async function loadThemeFromFirestore() {
        try {
            const user = auth.currentUser;
            if (user) {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists && doc.data().theme) {
                    const savedColors = doc.data().theme;
                    updateThemeColors(savedColors);
                    primaryColorPicker.value = savedColors['--primary-color'];
                    secondaryColorPicker.value = savedColors['--secondary-color'];
                    accentColorPicker.value = savedColors['--accent-color'];
                    textColorPicker.value = savedColors['--text-color'];
                    bgColorPicker.value = savedColors['--bg-color'];
                    cardBgColorPicker.value = savedColors['--card-bg-color'];
                    filterBgColorPicker.value = savedColors['--filter-bg-color'];
                    borderColorPicker.value = savedColors['--border-color'].startsWith('rgba') ? '#ffffff19' : savedColors['--border-color'];
                    lightThemeBgPicker.value = savedColors['--light-theme-bg'];
                    lightThemeTextPicker.value = savedColors['--light-theme-text'];
                    lightThemeCardBgPicker.value = savedColors['--light-theme-card-bg'];
                    lightThemeFilterBgPicker.value = savedColors['--light-theme-filter-bg'];
                    lightThemeBorderPicker.value = savedColors['--light-theme-border'];
                }
            }
        } catch (error) {
            console.error("Erro ao carregar tema do Firestore:", error.message);
        }
    }

    async function backupThemeToFirestore() {
        try {
            const user = auth.currentUser;
            if (user) {
                const currentTheme = {
                    '--primary-color': document.documentElement.style.getPropertyValue('--primary-color') || defaultTheme['--primary-color'],
                    '--secondary-color': document.documentElement.style.getPropertyValue('--secondary-color') || defaultTheme['--secondary-color'],
                    '--accent-color': document.documentElement.style.getPropertyValue('--accent-color') || defaultTheme['--accent-color'],
                    '--text-color': document.documentElement.style.getPropertyValue('--text-color') || defaultTheme['--text-color'],
                    '--bg-color': document.documentElement.style.getPropertyValue('--bg-color') || defaultTheme['--bg-color'],
                    '--card-bg-color': document.documentElement.style.getPropertyValue('--card-bg-color') || defaultTheme['--card-bg-color'],
                    '--filter-bg-color': document.documentElement.style.getPropertyValue('--filter-bg-color') || defaultTheme['--filter-bg-color'],
                    '--border-color': document.documentElement.style.getPropertyValue('--border-color') || defaultTheme['--border-color'],
                    '--light-theme-bg': document.documentElement.style.getPropertyValue('--light-theme-bg') || defaultTheme['--light-theme-bg'],
                    '--light-theme-text': document.documentElement.style.getPropertyValue('--light-theme-text') || defaultTheme['--light-theme-text'],
                    '--light-theme-card-bg': document.documentElement.style.getPropertyValue('--light-theme-card-bg') || defaultTheme['--light-theme-card-bg'],
                    '--light-theme-filter-bg': document.documentElement.style.getPropertyValue('--light-theme-filter-bg') || defaultTheme['--light-theme-filter-bg'],
                    '--light-theme-border': document.documentElement.style.getPropertyValue('--light-theme-border') || defaultTheme['--light-theme-border']
                };
                await db.collection('users').doc(user.uid).set({ themeBackup: currentTheme }, { merge: true });
                console.log('Backup do tema realizado com sucesso!');
            }
        } catch (error) {
            console.error("Erro ao fazer backup do tema:", error.message);
        }
    }

    async function restoreThemeFromBackup() {
        try {
            const user = auth.currentUser;
            if (user) {
                const doc = await db.collection('users').doc(user.uid).get();
                if (doc.exists && doc.data().themeBackup) {
                    const backupColors = doc.data().themeBackup;
                    updateThemeColors(backupColors);
                    primaryColorPicker.value = backupColors['--primary-color'];
                    secondaryColorPicker.value = backupColors['--secondary-color'];
                    accentColorPicker.value = backupColors['--accent-color'];
                    textColorPicker.value = backupColors['--text-color'];
                    bgColorPicker.value = backupColors['--bg-color'];
                    cardBgColorPicker.value = backupColors['--card-bg-color'];
                    filterBgColorPicker.value = backupColors['--filter-bg-color'];
                    borderColorPicker.value = backupColors['--border-color'].startsWith('rgba') ? '#ffffff19' : backupColors['--border-color'];
                    lightThemeBgPicker.value = backupColors['--light-theme-bg'];
                    lightThemeTextPicker.value = backupColors['--light-theme-text'];
                    lightThemeCardBgPicker.value = backupColors['--light-theme-card-bg'];
                    lightThemeFilterBgPicker.value = backupColors['--light-theme-filter-bg'];
                    lightThemeBorderPicker.value = backupColors['--light-theme-border'];
                    await saveThemeToFirestore(backupColors);
                    console.log('Tema restaurado do backup com sucesso!');
                } else {
                    console.log('Nenhum backup de tema encontrado.');
                }
            }
        } catch (error) {
            console.error("Erro ao restaurar tema do backup:", error.message);
        }
    }

    function handleColorChange() {
        try {
            const newColors = {
                '--primary-color': primaryColorPicker.value,
                '--secondary-color': secondaryColorPicker.value,
                '--accent-color': accentColorPicker.value,
                '--text-color': textColorPicker.value,
                '--bg-color': bgColorPicker.value,
                '--card-bg-color': cardBgColorPicker.value,
                '--filter-bg-color': filterBgColorPicker.value,
                '--border-color': borderColorPicker.value,
                '--light-theme-bg': lightThemeBgPicker.value,
                '--light-theme-text': lightThemeTextPicker.value,
                '--light-theme-card-bg': lightThemeCardBgPicker.value,
                '--light-theme-filter-bg': lightThemeFilterBgPicker.value,
                '--light-theme-border': lightThemeBorderPicker.value
            };
            updateThemeColors(newColors);
            saveThemeToFirestore(newColors);
        } catch (error) {
            console.error("Erro ao alterar cores do tema:", error.message);
        }
    }

    primaryColorPicker.addEventListener('input', handleColorChange);
    secondaryColorPicker.addEventListener('input', handleColorChange);
    accentColorPicker.addEventListener('input', handleColorChange);
    textColorPicker.addEventListener('input', handleColorChange);
    bgColorPicker.addEventListener('input', handleColorChange);
    cardBgColorPicker.addEventListener('input', handleColorChange);
    filterBgColorPicker.addEventListener('input', handleColorChange);
    borderColorPicker.addEventListener('input', handleColorChange);
    lightThemeBgPicker.addEventListener('input', handleColorChange);
    lightThemeTextPicker.addEventListener('input', handleColorChange);
    lightThemeCardBgPicker.addEventListener('input', handleColorChange);
    lightThemeFilterBgPicker.addEventListener('input', handleColorChange);
    lightThemeBorderPicker.addEventListener('input', handleColorChange);

    resetThemeButton.addEventListener('click', () => {
        try {
            updateThemeColors(defaultTheme);
            primaryColorPicker.value = defaultTheme['--primary-color'];
            secondaryColorPicker.value = defaultTheme['--secondary-color'];
            accentColorPicker.value = defaultTheme['--accent-color'];
            textColorPicker.value = defaultTheme['--text-color'];
            bgColorPicker.value = defaultTheme['--bg-color'];
            cardBgColorPicker.value = defaultTheme['--card-bg-color'];
            filterBgColorPicker.value = defaultTheme['--filter-bg-color'];
            borderColorPicker.value = '#ffffff19';
            lightThemeBgPicker.value = defaultTheme['--light-theme-bg'];
            lightThemeTextPicker.value = defaultTheme['--light-theme-text'];
            lightThemeCardBgPicker.value = defaultTheme['--light-theme-card-bg'];
            lightThemeFilterBgPicker.value = defaultTheme['--light-theme-filter-bg'];
            lightThemeBorderPicker.value = defaultTheme['--light-theme-border'];
            saveThemeToFirestore(defaultTheme);
        } catch (error) {
            console.error("Erro ao resetar tema:", error.message);
        }
    });

    backupThemeButton.addEventListener('click', backupThemeToFirestore);
    restoreThemeButton.addEventListener('click', restoreThemeFromBackup);

    function getRandomColor() {
        try {
            return colors[Math.floor(Math.random() * colors.length)];
        } catch (error) {
            console.error("Erro ao gerar cor aleatória:", error.message);
            return colors[0]; // Retorna a primeira cor como fallback
        }
    }

    function detectLanguage(code) {
        try {
            const lowerCode = code.toLowerCase();
            if (lowerCode.includes('<html') || lowerCode.includes('<!doctype')) return 'html';
            if (lowerCode.includes('{') && lowerCode.includes('}') && lowerCode.includes(':')) return 'css';
            if (lowerCode.includes('function') || lowerCode.includes('let') || lowerCode.includes('console')) return 'javascript';
            if (lowerCode.includes('def ') || lowerCode.includes('print(')) return 'python';
            if (lowerCode.includes('public class') || lowerCode.includes('system.out')) return 'java';
            if (lowerCode.includes('#include') || lowerCode.includes('int main')) return 'c';
            if (lowerCode.includes('cout') || lowerCode.includes('cin')) return 'cpp';
            if (lowerCode.includes('using system') || lowerCode.includes('console.writeline')) return 'csharp';
            if (lowerCode.includes('<?php')) return 'php';
            if (lowerCode.includes('puts') || lowerCode.includes('def ')) return 'ruby';
            if (lowerCode.includes('func main')) return 'go';
            if (lowerCode.includes('@objc') || lowerCode.includes('import uikit')) return 'swift';
            if (lowerCode.includes('fun main')) return 'kotlin';
            if (lowerCode.includes('type ') || lowerCode.includes('interface ')) return 'typescript';
            if (lowerCode.includes('fn main')) return 'rust';
            if (lowerCode.includes('def main')) return 'scala';
            if (lowerCode.includes('print ')) return 'perl';
            if (lowerCode.includes('function ')) return 'lua';
            if (lowerCode.includes('plot(')) return 'r';
            if (lowerCode.includes('matrix(')) return 'matlab';
            if (lowerCode.includes('select ') || lowerCode.includes('from ')) return 'sql';
            if (lowerCode.includes('echo ') || lowerCode.includes('#!/bin/bash')) return 'bash';
            if (lowerCode.includes('main()')) return 'dart';
            if (lowerCode.includes('defmodule')) return 'elixir';
            if (lowerCode.includes('main ::')) return 'haskell';
            if (lowerCode.includes('defclass')) return 'groovy';
            if (lowerCode.includes('@interface')) return 'objective-c';
            if (lowerCode.includes('write-host')) return 'powershell';
            if (lowerCode.includes('sub ')) return 'vb';
            if (lowerCode.includes('mov ')) return 'assembly';
            return 'unknown';
        } catch (error) {
            console.error("Erro ao detectar linguagem:", error.message);
            return 'unknown';
        }
    }

    async function createCardInFirestore(title, code, backgroundColor, languages, tags, timestamp) {
        try {
            const docRef = await db.collection("cards").add({
                title: title,
                code: code,
                backgroundColor: backgroundColor,
                languages: languages || [],
                tags: tags || [],
                timestamp: timestamp || firebase.firestore.FieldValue.serverTimestamp()
            });
            return docRef.id;
        } catch (error) {
            console.error("Erro ao criar card no Firestore:", error.message);
            return null;
        }
    }

    async function updateCardInFirestore(cardId, title, code, languages, tags) {
        try {
            await db.collection("cards").doc(cardId).update({
                title: title,
                code: code,
                languages: languages || [],
                tags: tags || []
            });
        } catch (error) {
            console.error("Erro ao atualizar card no Firestore:", error.message);
        }
    }

    function renderIframe(code) {
        try {
            previewIframe.contentWindow.document.open();
            previewIframe.contentWindow.document.write(code);
            previewIframe.contentWindow.document.close();
        } catch (error) {
            console.error("Erro ao renderizar iframe:", error.message);
        }
    }

    function clearAddEditForm() {
        try {
            cardIdInput.value = '';
            cardTitleInput.value = '';
            cardCodeInput.value = '';
            languageCheckboxes.forEach(checkbox => checkbox.checked = false);
            renderIframe('');
        } catch (error) {
            console.error("Erro ao limpar formulário de edição:", error.message);
        }
    }

    function populateTagsFilter() {
        try {
            filterTag.innerHTML = '<option value="">Filtrar por tag</option>';
            allTags.forEach(tag => {
                const option = document.createElement('option');
                option.value = tag;
                option.textContent = tag;
                filterTag.appendChild(option);
            });
        } catch (error) {
            console.error("Erro ao preencher filtro de tags:", error.message);
        }
    }

    function addCardToContainer(title, code, id, backgroundColor, languages, tags) {
        try {
            const card = document.createElement('div');
            card.classList.add('card');
            card.dataset.id = id;
            card.dataset.languages = JSON.stringify(languages || []);
            card.dataset.tags = JSON.stringify(tags || []);

            const titleElement = document.createElement('h3');
            titleElement.textContent = title;
            card.appendChild(titleElement);

            const codeContainer = document.createElement('div');
            codeContainer.classList.add('code-container');
            const codeElement = document.createElement('pre');
            codeElement.textContent = code;
            codeContainer.appendChild(codeElement);
            card.appendChild(codeContainer);

            card.addEventListener('click', function (e) {
                try {
                    if (!e.target.closest('.card-actions')) {
                        codeContainer.style.display = codeContainer.style.display === 'block' ? 'none' : 'block';
                    }
                } catch (error) {
                    console.error("Erro ao clicar no card:", error.message);
                }
            });

            const cardActions = document.createElement('div');
            cardActions.classList.add('card-actions');

            const copyButton = document.createElement('button');
            copyButton.classList.add('copy-button');
            copyButton.innerHTML = '<i class="fas fa-copy"></i> Copiar';
            copyButton.addEventListener('click', function (event) {
                try {
                    event.stopPropagation();
                    navigator.clipboard.writeText(code).then(() => {
                        console.log('Código copiado para a área de transferência!');
                    });
                } catch (error) {
                    console.error("Erro ao copiar código:", error.message);
                }
            });

            const deleteButton = document.createElement('button');
            deleteButton.classList.add('delete-button');
            deleteButton.innerHTML = '<i class="fas fa-trash"></i> Excluir';
            deleteButton.addEventListener('click', function (event) {
                try {
                    event.stopPropagation();
                    deleteCard(id);
                } catch (error) {
                    console.error("Erro ao excluir card:", error.message);
                }
            });

            const editButton = document.createElement('button');
            editButton.classList.add('edit-button');
            editButton.innerHTML = '<i class="fas fa-edit"></i> Editar';
            editButton.addEventListener('click', function (event) {
                try {
                    event.stopPropagation();
                    openEditCardForm(id);
                } catch (error) {
                    console.error("Erro ao editar card:", error.message);
                }
            });

            cardActions.appendChild(copyButton);
            cardActions.appendChild(editButton);
            cardActions.appendChild(deleteButton);
            card.appendChild(cardActions);

            if (languages && languages.length > 0) {
                const tagsContainer = document.createElement('div');
                tagsContainer.classList.add('tags');
                languages.forEach(language => {
                    const tagElement = document.createElement('span');
                    tagElement.classList.add('tag');
                    tagElement.textContent = language;
                    tagsContainer.appendChild(tagElement);
                });
                if (tags && tags.length > 0) {
                    tags.forEach(tag => {
                        const tagElement = document.createElement('span');
                        tagElement.classList.add('tag');
                        tagElement.textContent = tag;
                        tagsContainer.appendChild(tagElement);
                    });
                }
                card.appendChild(tagsContainer);
            }

            cardsContainer.appendChild(card);
        } catch (error) {
            console.error("Erro ao adicionar card ao container:", error.message);
        }
    }

    async function loadCardsFromFirestore() {
        try {
            const querySnapshot = await db.collection("cards").get();
            allCards = [];
            allTags = new Set();
            querySnapshot.forEach(doc => {
                const cardData = doc.data();
                cardData.id = doc.id;
                allCards.push(cardData);
                if (cardData.tags) {
                    cardData.tags.forEach(tag => allTags.add(tag));
                }
            });
            populateTagsFilter();
            renderCards(allCards);
        } catch (error) {
            console.error("Erro ao carregar cards do Firestore:", error.message);
        }
    }

    function filterCards(searchTerm, languageFilter, tagFilter, sortOption) {
        try {
            let filteredCards = allCards;

            if (searchTerm) {
                const term = searchTerm.toLowerCase();
                filteredCards = filteredCards.filter(card => 
                    card.title.toLowerCase().includes(term) || 
                    card.code.toLowerCase().includes(term) ||
                    (card.languages && card.languages.some(lang => lang.toLowerCase().includes(term))) ||
                    (card.tags && card.tags.some(tag => tag.toLowerCase().includes(term)))
                );
            }

            if (languageFilter) {
                filteredCards = filteredCards.filter(card => 
                    card.languages && card.languages.includes(languageFilter.toLowerCase())
                );
            }

            if (tagFilter) {
                filteredCards = filteredCards.filter(card => 
                    card.tags && card.tags.includes(tagFilter)
                );
            }

            if (sortOption) {
                switch (sortOption) {
                    case 'title-asc':
                        filteredCards.sort((a, b) => a.title.localeCompare(b.title));
                        break;
                    case 'title-desc':
                        filteredCards.sort((a, b) => b.title.localeCompare(a.title));
                        break;
                    case 'date-asc':
                        filteredCards.sort((a, b) => (a.timestamp?.toDate() || 0) - (b.timestamp?.toDate() || 0));
                        break;
                    case 'date-desc':
                        filteredCards.sort((a, b) => (b.timestamp?.toDate() || 0) - (a.timestamp?.toDate() || 0));
                        break;
                }
            }

            return filteredCards;
        } catch (error) {
            console.error("Erro ao filtrar cards:", error.message);
            return allCards; // Retorna todos os cards como fallback
        }
    }

    function renderCards(cards) {
        try {
            cardsContainer.innerHTML = '';
            cards.forEach(cardData => {
                addCardToContainer(
                    cardData.title, 
                    cardData.code, 
                    cardData.id, 
                    cardData.backgroundColor,
                    cardData.languages,
                    cardData.tags
                );
            });
        } catch (error) {
            console.error("Erro ao renderizar cards:", error.message);
        }
    }

    async function deleteCard(cardId) {
        try {
            await db.collection("cards").doc(cardId).delete();
            allCards = allCards.filter(card => card.id !== cardId);
            allTags = new Set();
            allCards.forEach(card => {
                if (card.tags) {
                    card.tags.forEach(tag => allTags.add(tag));
                }
            });
            populateTagsFilter();
            renderCards(allCards);
        } catch (error) {
            console.error("Erro ao deletar card:", error.message);
        }
    }

    function openEditCardForm(cardId) {
        try {
            const card = allCards.find(card => card.id === cardId);
            if (card) {
                cardIdInput.value = card.id;
                cardTitleInput.value = card.title;
                cardCodeInput.value = card.code;
                languageCheckboxes.forEach(checkbox => {
                    checkbox.checked = card.languages && card.languages.includes(checkbox.value);
                });
                renderIframe(card.code);
                addEditCardSection.style.display = 'block';
            }
        } catch (error) {
            console.error("Erro ao abrir formulário de edição:", error.message);
        }
    }

    async function handleSaveCard() {
        try {
            const cardId = cardIdInput.value;
            const title = cardTitleInput.value;
            const code = cardCodeInput.value;
            const selectedLanguages = Array.from(languageCheckboxes)
                .filter(checkbox => checkbox.checked)
                .map(checkbox => checkbox.value);
            const tagsInput = prompt("Digite tags adicionais separadas por vírgula (opcional, ex.: frontend, api):");
            const tags = tagsInput ? tagsInput.split(',').map(tag => tag.trim().toLowerCase()).filter(tag => tag) : [];

            if (!title || !code) {
                console.log('Por favor, preencha o título e o código.');
                return;
            }

            if (selectedLanguages.length === 0) {
                const autoDetected = detectLanguage(code);
                selectedLanguages.push(autoDetected);
            }

            if (cardId) {
                await updateCardInFirestore(cardId, title, code, selectedLanguages, tags);
                const index = allCards.findIndex(card => card.id === cardId);
                allCards[index].title = title;
                allCards[index].code = code;
                allCards[index].languages = selectedLanguages;
                allCards[index].tags = tags;
            } else {
                const backgroundColor = getRandomColor();
                const newCardId = await createCardInFirestore(title, code, backgroundColor, selectedLanguages, tags);
                if (newCardId) {
                    allCards.push({ id: newCardId, title, code, backgroundColor, languages: selectedLanguages, tags });
                }
            }

            allTags = new Set();
            allCards.forEach(card => {
                if (card.tags) {
                    card.tags.forEach(tag => allTags.add(tag));
                }
            });
            populateTagsFilter();
            renderCards(allCards);
            clearAddEditForm();
            addEditCardSection.style.display = 'none';
        } catch (error) {
            console.error("Erro ao salvar card:", error.message);
        }
    }

    function handleCodeInputChange() {
        try {
            const code = cardCodeInput.value;
            renderIframe(code);
        } catch (error) {
            console.error("Erro ao atualizar pré-visualização:", error.message);
        }
    }

    async function logout() {
        try {
            await auth.signOut();
            loginSection.style.display = 'block';
            addEditCardSection.style.display = 'none';
            searchBar.style.display = 'none';
            cardListSection.style.display = 'none';
            cardsContainer.innerHTML = '';
            header.style.display = 'none';
            footer.style.display = 'none';
            document.body.classList.add('login-visible');
            loggedIn = false;
        } catch (error) {
            console.error("Erro ao fazer logout:", error.message);
        }
    }

    async function login(email, password) {
        try {
            await auth.signInWithEmailAndPassword(email, password);
            loginSection.style.display = "none";
            header.style.display = 'flex';
            addEditCardSection.style.display = "block";
            searchBar.style.display = 'flex';
            cardListSection.style.display = 'block';
            cardsContainer.style.visibility = 'visible';
            footer.style.display = 'block';
            document.body.classList.remove('login-visible');
            loggedIn = true;
            await loadCardsFromFirestore();
            await loadThemeFromFirestore();
        } catch (error) {
            console.error("Erro ao fazer login:", error.message);
        }
    }

    function applyFilters() {
        try {
            const searchTerm = searchInput.value;
            const languageFilter = filterLanguage.value;
            const tagFilter = filterTag.value;
            const sortOption = filterSort.value;
            const filteredCards = filterCards(searchTerm, languageFilter, tagFilter, sortOption);
            renderCards(filteredCards);
        } catch (error) {
            console.error("Erro ao aplicar filtros:", error.message);
        }
    }

    searchInput.addEventListener('input', applyFilters);
    filterLanguage.addEventListener('change', applyFilters);
    filterTag.addEventListener('change', applyFilters);
    filterSort.addEventListener('change', applyFilters);

    logoutButton.addEventListener('click', logout);

    saveButton.addEventListener('click', handleSaveCard);

    cancelButton.addEventListener('click', () => {
        try {
            addEditCardSection.style.display = 'none';
            clearAddEditForm();
        } catch (error) {
            console.error("Erro ao cancelar edição:", error.message);
        }
    });

    cardCodeInput.addEventListener('input', handleCodeInputChange);

    gridViewButton.addEventListener('click', () => {
        try {
            cardsContainer.classList.remove('list-view');
        } catch (error) {
            console.error("Erro ao mudar para visão em grade:", error.message);
        }
    });

    listViewButton.addEventListener('click', () => {
        try {
            cardsContainer.classList.add('list-view');
        } catch (error) {
            console.error("Erro ao mudar para visão em lista:", error.message);
        }
    });

    auth.onAuthStateChanged(async (user) => {
        try {
            if (user) {
                loginSection.style.display = 'none';
                header.style.display = 'flex';
                cardsContainer.style.visibility = 'visible';
                searchBar.style.display = 'flex';
                cardListSection.style.display = 'block';
                footer.style.display = 'block';
                document.body.classList.remove('login-visible');
                loggedIn = true;
                addEditCardSection.style.display = 'none';
                await loadCardsFromFirestore();
                await loadThemeFromFirestore();
            } else {
                loginSection.style.display = "block";
                addEditCardSection.style.display = "none";
                searchBar.style.display = 'none';
                cardListSection.style.display = 'none';
                cardsContainer.innerHTML = '';
                header.style.display = 'none';
                footer.style.display = 'none';
                document.body.classList.add('login-visible');
                clearAddEditForm();
                loggedIn = false;
            }
        } catch (error) {
            console.error("Erro no evento de mudança de estado de autenticação:", error.message);
        }
    });

    loginButton.addEventListener('click', async () => {
        try {
            const email = emailInput.value;
            const password = passwordInput.value;
            if (!email || !password) {
                console.log("Por favor, insira email e senha.");
                return;
            }
            await login(email, password);
        } catch (error) {
            console.error("Erro ao processar clique no botão de login:", error.message);
        }
    });

    const initialize = () => {
        try {
            document.body.classList.add('login-visible');
        } catch (error) {
            console.error("Erro ao inicializar tela de login:", error.message);
        }
    };

    window.addEventListener("load", initialize);
});
