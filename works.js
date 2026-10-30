/* ============================================================
   CONTEÚDO DO SITE — para adicionar fotos novas, basta:
   1) colocar o arquivo em assets/img/
   2) acrescentar uma linha em WORKS (w e h são opcionais)
   Categorias do filtro: Gestantes, Newborn, Infantil, Família, Ensaios
   ============================================================ */
window.WORKS = [
  { src: "assets/img/gestante-em-pe.jpg",    cat: "Gestantes", title: "Gestante, vestido branco", w: 408, h: 510 },
  { src: "assets/img/newborn-balde.jpg",     cat: "Newborn",   title: "Newborn no balde",         w: 680, h: 453 },
  { src: "assets/img/menina-natal.jpg",      cat: "Infantil",  title: "Ensaio de Natal",          w: 340, h: 510 },
  { src: "assets/img/gestante-casal.jpg",    cat: "Gestantes", title: "Casal esperando o bebê",   w: 408, h: 510 },
  { src: "assets/img/familia-natal.jpg",     cat: "Família",   title: "Família de vermelho",      w: 680, h: 453 },
  { src: "assets/img/ensaio-coracao.jpg",    cat: "Ensaios",   title: "Ensaio com corações",      w: 408, h: 510 },
  { src: "assets/img/mae-e-filho.jpg",       cat: "Família",   title: "Mãe e filho",              w: 680, h: 453 },
  { src: "assets/img/gestante-deitada.jpg",  cat: "Gestantes", title: "Gestante, estúdio azul",   w: 408, h: 510 },
  { src: "assets/img/newborn-rosa.jpg",      cat: "Newborn",   title: "Newborn em rosa",          w: 680, h: 453 },
  { src: "assets/img/irmas-natal.jpg",       cat: "Infantil",  title: "Irmãs no Natal",           w: 340, h: 510 },
  { src: "assets/img/bebe-rosa.jpg",         cat: "Infantil",  title: "Sorriso de bebê",          w: 680, h: 453 },
  { src: "assets/img/newborn-banco.jpg",     cat: "Newborn",   title: "Newborn no banquinho",     w: 680, h: 453 },
  { src: "assets/img/ensaio-faisca.jpg",     cat: "Ensaios",   title: "Ensaio com faísca",        w: 408, h: 510 }
];

/* Trabalhos selecionados (rolagem horizontal): h = altura em vh, y = deslocamento vertical em vh */
window.SHOWCASE = [
  { src: "assets/img/gestante-em-pe.jpg",   h: 62, y: -2 },
  { src: "assets/img/newborn-balde.jpg",    h: 40, y: 9 },
  { src: "assets/img/menina-natal.jpg",     h: 56, y: -8 },
  { src: "assets/img/gestante-casal.jpg",   h: 64, y: 3 },
  { src: "assets/img/familia-natal.jpg",    h: 42, y: -6 },
  { src: "assets/img/ensaio-coracao.jpg",   h: 60, y: 6 },
  { src: "assets/img/mae-e-filho.jpg",      h: 40, y: -4 },
  { src: "assets/img/gestante-deitada.jpg", h: 58, y: 8 },
  { src: "assets/img/newborn-rosa.jpg",     h: 42, y: -8 },
  { src: "assets/img/irmas-natal.jpg",      h: 58, y: 2 }
];

/* Serviços (img = foto que aparece ao passar o mouse) */
window.SERVICES = [
  { name: "Ensaio gestante",        img: "assets/img/gestante-em-pe.jpg" },
  { name: "Newborn",                img: "assets/img/newborn-balde.jpg" },
  { name: "Fotografia de parto",    img: "assets/img/gestante-casal.jpg" },
  { name: "Ensaio infantil",        img: "assets/img/menina-natal.jpg" },
  { name: "Família",                img: "assets/img/familia-natal.jpg" },
  { name: "Ensaios femininos",      img: "assets/img/ensaio-faisca.jpg" }
];

/* Depoimentos reais (avaliações 5★ no Google) */
window.REVIEWS = [
  { name: "Amanda F.",  when: "há 5 meses",  text: "Trabalho impecável! Shenia consegue deixar qualquer um à vontade, garantindo que o ensaio flua de forma leve e espontânea. As fotos são perfeitas e capturam a essência de cada momento com uma delicadeza única. Sem dúvida, a melhor escolha para registrar memórias inesquecíveis." },
  { name: "Valéria G.", when: "há 5 meses",  text: "Nossa estou muito encantada com todo o seu trabalho, a forma como nos recebeu, como nos deixou a vontade. Super indico, minha experiência foi sensacional. Está de parabéns..." },
  { name: "Akacia C.",  when: "há 10 meses", text: "Shenia é maravilhosa! Ela fez o acompanhamento completo da minha família. As fotos são lindas, cheias de emoção, e ela é extremamente profissional e carinhosa. Recomendo muito!" },
  { name: "Vanessa S.", when: "há 10 meses", text: "Ambiente limpo e organizado, variadas opções de cenários e roupas, horários flexíveis e atendimento informal, que faz com que os clientes se sintam em casa e isso reflete nas expressões das fotos. Todos sorridentes e tranquilos, sem tensões, sem pressa." },
  { name: "Mirian T.",  when: "há 5 meses",  text: "Maravilhosa nós mínimos detalhes, tão Atenciosa e cuidadosa com tudo, amei conhecê-la e principalmente amei o trabalho incrível." },
  { name: "Helber P.",  when: "há 2 meses",  text: "Ensaio perfeito, ela consegue nos deixar a vontade, e as fotos saíram incríveis" }
];

/* Contato — FALTA o WhatsApp da Shenia: preencher "whatsapp" (DDI+DDD+número, só dígitos, ex.: "5573999999999")
   e "phoneLabel" (ex.: "(73) 99999-9999"). Enquanto estiver vazio, os botões levam ao Instagram. */
window.CONTACT = { whatsapp: "", phoneLabel: "", instagram: "sheniabarbosafotografia" };
