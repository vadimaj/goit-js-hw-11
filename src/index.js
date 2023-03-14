import { Notify } from 'notiflix/build/notiflix-notify-aio';
import axios, { Axios } from 'axios';
import './sass/index.scss';
import PixabayApi from './pixabayApi';

const refs = {
  searchForm: document.querySelector('#search-form'),
  loadMoreBtn: document.querySelector('.load-more'),
  galleryEl: document.querySelector('.gallery'),
};

const pixabayApi = new PixabayApi();

refs.searchForm.addEventListener('submit', onSearch);
refs.loadMoreBtn.addEventListener('click', onLoadMoreClick);

hideLoadMoreBtn();

function onSearch(e) {
  e.preventDefault();
  clearGalleryContainer();
  pixabayApi.query = e.currentTarget.elements.searchQuery.value.trim();
  if (pixabayApi.query === '') {
    hideLoadMoreBtn();
    Notify.info('Please enter valid search query');
    return;
  }
  pixabayApi.resetPage();
  try {
    pixabayApi.fetchPictures().then(pictures => {
      console.log(pictures.length);
      if (pictures.length === 0) {
        hideLoadMoreBtn();
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        );
        e.target.reset();
        return;
      }
      appendPictures(pictures);
      showLoadMoreBtn();
    });
  } catch (error) {
    Notify.failure(`${error} Please try again.`);
  }
}

function onLoadMoreClick() {
  pixabayApi.fetchPictures().then(pictures => {
    console.log(pictures);
    appendPictures(pictures);
  });
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
  return `
  <div class="photo-card">
  <img class="photo-card-img" src="${webformatURL}" alt="${tags}" loading="lazy" />
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
