"use strict";
// Config central - SUBSTITUIR pelo numero real.
const WHATSAPP_NUMBER = "5511900000000";
const SCROLL_HEADER = 40;
const SCROLL_TOP_SHOW = 600;

// Monta link do WhatsApp com mensagem codificada.
function buildWhatsAppLink(message) {
  return "https://wa.me/" + WHATSAPP_NUMBER + "?text=" + encodeURIComponent(message);
}

// Aplica o link correto a todos os CTAs com data-whatsapp-message.
function initWhatsAppLinks() {
  const links = document.querySelectorAll("[data-whatsapp-message]");
  links.forEach(function (link) {
    const msg = link.getAttribute("data-whatsapp-message");
    if (msg) {
      link.href = buildWhatsAppLink(msg);
    }
  });
}

// Header solido apos rolagem.
function initHeaderScroll() {
  const header = document.querySelector(".header-site");
  if (!header) {
    return;
  }
  function onScroll() {
    if (window.scrollY > SCROLL_HEADER) {
      header.classList.add("scrolled");
    } else {
      header.classList.remove("scrolled");
    }
  }
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
}

// Menu mobile: estado, acessibilidade e fecho automatico.
function initMobileMenu() {
  const toggler = document.querySelector(".navbar-toggler");
  const collapse = document.querySelector("#navHelios");
  const header = document.querySelector(".header-site");
  if (!toggler || !collapse || !header) {
    return;
  }
  collapse.addEventListener("show.bs.collapse", function () {
    header.classList.add("menu-open");
    toggler.setAttribute("aria-expanded", "true");
  });
  collapse.addEventListener("hide.bs.collapse", function () {
    header.classList.remove("menu-open");
    toggler.setAttribute("aria-expanded", "false");
  });
  collapse.querySelectorAll("a").forEach(function (link) {
    link.addEventListener("click", function () {
      if (collapse.classList.contains("show")) {
        const inst = bootstrap.Collapse.getInstance(collapse);
        if (inst) {
          inst.hide();
        }
      }
    });
  });
}

// Revela secoes ao entrar na viewport.
function initRevealOnScroll() {
  const items = document.querySelectorAll(".reveal");
  if (!("IntersectionObserver" in window)) {
    items.forEach(function (el) {
      el.classList.add("is-visible");
    });
    return;
  }
  const observer = new IntersectionObserver(function (entries) {
    entries.forEach(function (entry) {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });
  items.forEach(function (el, index) {
    el.style.transitionDelay = ((index % 3) * 90) + "ms";
    observer.observe(el);
  });
}

// Filtro da galeria por categoria.
function initGalleryFilter() {
  const buttons = document.querySelectorAll(".filter-btn");
  const cards = document.querySelectorAll(".gallery-item");
  if (!buttons.length) {
    return;
  }
  buttons.forEach(function (btn) {
    btn.addEventListener("click", function () {
      buttons.forEach(function (b) {
        b.setAttribute("aria-pressed", "false");
      });
      btn.setAttribute("aria-pressed", "true");
      const filter = btn.getAttribute("data-filter");
      cards.forEach(function (card) {
        const show = filter === "all" || card.getAttribute("data-category") === filter;
        card.style.display = show ? "" : "none";
      });
    });
  });
}

// Modal da galeria com legenda.
function initGalleryModal() {
  const modal = document.getElementById("galleryModal");
  if (!modal) {
    return;
  }
  const big = modal.querySelector("#galleryModalImg");
  const cap = modal.querySelector("#galleryModalCap");
  document.querySelectorAll(".gallery-item button").forEach(function (btn) {
    btn.addEventListener("click", function () {
      const item = btn.closest(".gallery-item");
      const img = item.querySelector("img");
      if (big && img) {
        big.src = img.src;
        big.alt = img.alt;
      }
      if (cap) {
        cap.textContent = item.getAttribute("data-title") || img.alt;
      }
    });
  });
}

// Formulario: validacao e envio para WhatsApp.
function initContactForm() {
  const form = document.getElementById("contactForm");
  if (!form) {
    return;
  }
  const help = document.getElementById("formHelp");
  form.addEventListener("submit", function (event) {
    event.preventDefault();
    const name = document.getElementById("f-nome");
    const phone = document.getElementById("f-tel");
    const city = document.getElementById("f-cidade");
    const type = document.getElementById("f-tipo");
    const bill = document.getElementById("f-conta");
    const msg = document.getElementById("f-msg");
    const priv = document.getElementById("f-priv");
    let valid = true;
    [name, phone, city, type].forEach(function (field) {
      const bad = !field.value.trim();
      field.classList.toggle("is-invalid", bad);
      field.setAttribute("aria-invalid", bad ? "true" : "false");
      if (bad) {
        valid = false;
      }
    });
    if (!priv.checked) {
      priv.classList.add("is-invalid");
      valid = false;
    } else {
      priv.classList.remove("is-invalid");
    }
    if (!valid) {
      if (help) {
        help.textContent = "Verifique os campos destacados e aceite a politica.";
      }
      return;
    }
    const text = "Ola! Meu nome e " + name.value.trim() + ". Cidade: " + city.value.trim() + " | Imovel: " + type.value + " | Conta: " + (bill.value || "nao informada") + " | Tel: " + phone.value.trim() + " | Msg: " + (msg.value.trim() || "-");
    window.open(buildWhatsAppLink(text), "_blank", "noopener");
    if (help) {
      help.textContent = "Abrindo o WhatsApp com sua mensagem...";
    }
  });
}

// Botao voltar ao topo.
function initBackToTop() {
  const btn = document.getElementById("backTop");
  if (!btn) {
    return;
  }
  window.addEventListener("scroll", function () {
    if (window.scrollY > SCROLL_TOP_SHOW) {
      btn.classList.add("show");
    } else {
      btn.classList.remove("show");
    }
  }, { passive: true });
  btn.addEventListener("click", function () {
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

// Ano atual no rodape.
function setCurrentYear() {
  document.querySelectorAll("[data-year]").forEach(function (el) {
    el.textContent = new Date().getFullYear();
  });
}

// Inicializacao central.
function init() {
  document.documentElement.classList.add("js");
  initWhatsAppLinks();
  initHeaderScroll();
  initMobileMenu();
  initRevealOnScroll();
  initGalleryFilter();
  initGalleryModal();
  initContactForm();
  initBackToTop();
  setCurrentYear();
}
document.addEventListener("DOMContentLoaded", init);



