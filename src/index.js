import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios, { Axios } from 'axios';
import './sass/index.scss';
import PixabayApi from './pixabayApi';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
  infoMessage: document.querySelector('.endOfCollection'),
};

const pixabayApi = new PixabayApi();
const simpleLightbox = new SimpleLightbox('.gallery a');

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

hideLoadMoreBtn();
hideInfoMessage();

function onSearch(e) {
  e.preventDefault();
  clearGalleryContainer();
  hideInfoMessage();
  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();
  if (pixabayApi.query === '') {
    hideLoadMoreBtn();
    Notify.info('Please enter valid search query');
    return;
  }
  pixabayApi.resetPage();
  fetchAndAddPictures();
}

function onLoadMoreClick() {
  fetchAndAddPictures();
}

function imageMarkup(picture) {
  const {
    webformatURL,
    largeImageURL,
    tags,
    likes,
    views,
    comments,
    downloads,
  } = picture;
  return `<div class="photo-card">
  <a href="${largeImageURL}">
  <img class="photo-card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />  </a>
  
  <div class="info">
      <p class="info-item">
        <b>Likes</b><br>
        ${likes}
      </p>
      <p class="info-item">
        <b>Views</b><br>
        ${views}
      </p>
      <p class="info-item">
        <b>Comments</b>
        ${comments}
      </p>
      <p class="info-item">
        <b>Downloads</b>
        ${downloads}
      </p>
    </div>
</div>`;
}

function makeGallery(hits) {
  return hits.map(imageMarkup).join('');
}

function appendPictures(pictures) {
  refs.galleryEl.insertAdjacentHTML('beforeend', makeGallery(pictures));
}

function clearGalleryContainer() {
  refs.galleryEl.innerHTML = '';
}

function toggleLoadMoreBtn() {
  refs.loadMoreBtn.classList.toggle('is-hidden');
}

function showLoadMoreBtn() {
  refs.loadMoreBtn.classList.remove('is-hidden');
}
function hideLoadMoreBtn() {
  refs.loadMoreBtn.classList.add('is-hidden');
}
function isLoadMoreBtnActive() {
  return !refs.loadMoreBtn.classList.contains('is-hidden');
}

function hideInfoMessage() {
  refs.infoMessage.classList.add('is-hidden');
}
function showInfoMessage() {
  refs.infoMessage.classList.remove('is-hidden');
}
function fetchAndAddPictures() {
  pixabayApi.fetchPictures().then(pictures => {
    if (pictures.length === 0) {
      hideLoadMoreBtn();
      hideInfoMessage();
      Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
      e.target.reset();
      return;
    }
    console.log(pictures);
    appendPictures(pictures);
    simpleLightbox.refresh();

    if (pixabayApi.isEndOfCollection()) {
      showInfoMessage();
      console.log('End of collection!');
      if (isLoadMoreBtnActive()) {
        hideLoadMoreBtn();
      }
      return;
    }
    showLoadMoreBtn();
  });
}
