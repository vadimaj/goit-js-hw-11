const BASIC_URL = 'https://pixabay.com/api';
const KEY = '34291894-c5b60193cb7b58e4e154e577d';
export default class PixabayApi {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
  }
  // fetchPictures() {
  //   return fetch(
  //     `${BASIC_URL}/?key=${KEY}&q=${this.searchQuery}&image_type=photo&lang=en&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
  //   )
  //     .then(response => response.json())
  //     .then(pictures => {
  //       this.incrementPage();
  //       return pictures.hits;
  //     });
  // }

  async fetchPictures() {
    const response = await fetch(
      `${BASIC_URL}/?key=${KEY}&q=${this.searchQuery}&image_type=photo&lang=en&orientation=horizontal&safesearch=true&per_page=40&page=${this.page}`
    );
    const pictures = await response.json();
    this.incrementPage();
    return pictures.hits;
  }

  incrementPage() {
    this.page += 1;
  }
  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }
  set query(newSearchQuery) {
    this.searchQuery = newSearchQuery;
  }
}
