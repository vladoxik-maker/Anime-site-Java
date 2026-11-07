'use strict';

document.addEventListener('DOMContentLoaded', () => {
  // 1. Інтерактивна навігація: відкриття/закриття мобільного меню.
  const menuButton = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuButton && navLinks) {
    const closeMenu = () => {
      menuButton.setAttribute('aria-expanded', 'false');
      navLinks.classList.remove('is-open');
    };

    menuButton.addEventListener('click', () => {
      const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
      menuButton.setAttribute('aria-expanded', String(!isOpen));
      navLinks.classList.toggle('is-open', !isOpen);
    });

    navLinks.querySelectorAll('a').forEach(link => link.addEventListener('click', closeMenu));
    document.addEventListener('keydown', event => {
      if (event.key === 'Escape') closeMenu();
    });
  }

  // 2. Динамічний каталог: пошук, фільтри, сортування та лічильник.
  const filterForm = document.querySelector('#filters');
  const resultsGrid = document.querySelector('#anime-results');

  if (filterForm && resultsGrid) {
    const search = document.querySelector('#anime-search');
    const genre = document.querySelector('#genre-filter');
    const year = document.querySelector('#year-filter');
    const status = document.querySelector('#status-filter');
    const sort = document.querySelector('#sort-select');
    const count = document.querySelector('#result-count');
    const emptyState = document.querySelector('#empty-state');
    const cards = Array.from(resultsGrid.querySelectorAll('.anime-card'));

    const applyFilters = () => {
      const query = search.value.trim().toLocaleLowerCase('uk');
      const visibleCards = cards.filter(card =>
        card.dataset.title.toLocaleLowerCase('uk').includes(query) &&
        (!genre.value || card.dataset.genre.split(' ').includes(genre.value)) &&
        (!year.value || card.dataset.year === year.value) &&
        (!status.value || card.dataset.status === status.value)
      );

      visibleCards.sort((a, b) => {
        if (sort.value === 'rating') return Number(b.dataset.rating) - Number(a.dataset.rating);
        if (sort.value === 'newest') return Number(b.dataset.year) - Number(a.dataset.year);
        if (sort.value === 'title') return a.dataset.title.localeCompare(b.dataset.title, 'uk');
        return cards.indexOf(a) - cards.indexOf(b);
      });

      cards.forEach(card => { card.hidden = !visibleCards.includes(card); });
      visibleCards.forEach(card => resultsGrid.insertBefore(card, emptyState));
      count.textContent = String(visibleCards.length);
      emptyState.hidden = visibleCards.length > 0;
    };

    filterForm.addEventListener('submit', event => {
      event.preventDefault();
      applyFilters();
    });
    filterForm.addEventListener('reset', () => window.setTimeout(applyFilters, 0));
    [search, genre, year, status].forEach(control => control.addEventListener('input', applyFilters));
    sort.addEventListener('change', applyFilters);

    const initialQuery = new URLSearchParams(window.location.search).get('q');
    if (initialQuery) search.value = initialQuery;
    applyFilters();
  }

  // 3. Інтерактивна кнопка додавання аніме до списку (демонстраційний режим).
  const saveButton = document.querySelector('#save-anime');
  const saveMessage = document.querySelector('#save-message');

  if (saveButton && saveMessage) {
    saveButton.addEventListener('click', () => {
      const isSaved = saveButton.dataset.saved === 'true';
      saveButton.dataset.saved = String(!isSaved);
      saveButton.textContent = isSaved ? '＋ До списку' : '✓ У списку';
      saveMessage.textContent = isSaved
        ? 'Аніме прибрано зі списку (демо-режим).'
        : 'Аніме додано до списку (демо-режим).';
    });
  }

  // 4. Перевірка вебформи коментарів і динамічне додавання нового коментаря.
  const commentForm = document.querySelector('#comment-form');

  if (commentForm) {
    const commentInput = document.querySelector('#comment-text');
    const commentList = document.querySelector('#comment-list');
    const message = document.querySelector('#comment-message');
    const minLength = 3;
    const maxLength = 500;

    commentForm.addEventListener('submit', event => {
      event.preventDefault();
      const value = commentInput.value.trim();
      commentInput.removeAttribute('aria-invalid');

      if (value.length < minLength) {
        commentInput.setAttribute('aria-invalid', 'true');
        message.textContent = `Коментар має містити щонайменше ${minLength} символи.`;
        commentInput.focus();
        return;
      }

      if (value.length > maxLength) {
        commentInput.setAttribute('aria-invalid', 'true');
        message.textContent = `Коментар не повинен перевищувати ${maxLength} символів.`;
        commentInput.focus();
        return;
      }

      const article = document.createElement('article');
      article.className = 'comment';
      const avatar = document.createElement('span');
      avatar.className = 'avatar';
      avatar.textContent = 'Г';
      const body = document.createElement('div');
      const author = document.createElement('b');
      author.textContent = 'Гість';
      const paragraph = document.createElement('p');
      paragraph.textContent = value;
      body.append(author, paragraph);
      article.append(avatar, body);
      commentList.prepend(article);

      commentInput.value = '';
      message.textContent = 'Коментар успішно додано (локальний демо-режим).';
    });

    commentInput.addEventListener('input', () => {
      commentInput.removeAttribute('aria-invalid');
      message.textContent = '';
    });
  }
});
